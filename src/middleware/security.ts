import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';

const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.trim().length >= 16
    ? process.env.ADMIN_SESSION_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VALID_ADMIN_ROLES = new Set([
  'super_admin',
  'operations_manager',
  'clinical_supervisor',
  'receptionist',
  'accountant',
  'custom',
  'admin'
]);

export function signAdminSessionToken(userId: string, username: string, role = 'admin'): string {
  const payload = JSON.stringify({
    uid: String(userId),
    u: String(username),
    r: String(role),
    exp: Date.now() + ADMIN_SESSION_TTL_MS
  });
  const encodedPayload = Buffer.from(payload, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string): { uid: string; username: string; role: string } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig, 'utf-8');
  const expectedBuf = Buffer.from(expectedSig, 'utf-8');
  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (!parsed || typeof parsed.uid !== 'string' || typeof parsed.exp !== 'number') {
      return null;
    }
    if (Date.now() > parsed.exp) {
      return null;
    }
    return {
      uid: parsed.uid,
      username: String(parsed.u || ''),
      role: String(parsed.r || 'admin')
    };
  } catch {
    return null;
  }
}

export function isAuthorizedAdminTokenClaims(decoded: any): boolean {
  if (!decoded || typeof decoded !== 'object') return false;
  if (typeof decoded.role === 'string' && VALID_ADMIN_ROLES.has(decoded.role)) {
    return true;
  }
  const email = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
  const emailVerified = decoded.email_verified === true;
  if (!email || !emailVerified) return false;
  if (email === 'rabacentersocial@gmail.com') return true;
  return /^[a-z0-9._%+-]+@(rabacenters\.com|raba\.sa)$/.test(email);
}

/**
 * 1. HTTP Security Headers Middleware (OWASP Secure Headers)
 * Protects against MIME-sniffing, clickjacking, XSS, and info leakage.
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  const host = (req.headers.host || '').toLowerCase();
  const isPreviewOrDevHost =
    process.env.NODE_ENV !== 'production' ||
    host.includes('.run.app') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1');

  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!isPreviewOrDevHost) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  }
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * 2. In-Memory Sliding Window Rate Limiter
 * Guards against brute-force and spam on public write endpoints.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export const createRateLimiter = (maxRequests = 20, windowMs = 60_000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown';
    const now = Date.now();

    // Prevent unbounded memory growth on long-running production instances
    if (rateLimitMap.size > 1000) {
      for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetAt) {
          rateLimitMap.delete(key);
        }
      }
    }

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const waitSec = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        success: false,
        error: `تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار ${waitSec} ثانية.`
      });
    }

    record.count++;
    next();
  };
};

/**
 * 3. CSRF Protection Middleware
 * Verifies Origin & Referer headers on state-mutating requests (POST, PUT, DELETE, PATCH).
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = (req.headers.origin as string) || (req.headers.referer as string);
  const rawHost = ((req.headers['x-forwarded-host'] as string) || req.headers.host || '').split(',')[0].trim().toLowerCase();

  // In non-production local development without origin header, permit request
  if (!origin && process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (!origin || !rawHost) {
    return res.status(403).json({
      success: false,
      error: 'فشل التحقق الأمني من مصدر الطلب (CSRF validation failed)'
    });
  }

  try {
    const parsedOrigin = new URL(origin);
    const originHost = parsedOrigin.host.toLowerCase();
    const stripWww = (h: string) => h.replace(/^www\./, '');
    const isLocal = originHost.includes('localhost') || originHost.includes('127.0.0.1') || originHost.includes('0.0.0.0');
    const isSameHost =
      originHost === rawHost ||
      stripWww(originHost) === stripWww(rawHost) ||
      (req.headers.host ? stripWww(originHost) === stripWww(req.headers.host.toLowerCase()) : false);

    if (!isSameHost && !isLocal) {
      return res.status(403).json({
        success: false,
        error: 'طلب غير مصرح به: المصدر غير مطابق (Cross-Site Request Forgery blocked)'
      });
    }
  } catch {
    return res.status(403).json({
      success: false,
      error: 'ترويسة مصدر الطلب غير صالحة'
    });
  }

  next();
};

/**
 * 4. Input Sanitization & Anti-XSS Helpers
 */
export function sanitizeString(val: any, maxLength = 250): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/script injection
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(phone: any): string {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+\s\-()]/g, '').trim().slice(0, 30);
}

export function sanitizeEmail(email: any): string {
  if (typeof email !== 'string') return '';
  const clean = email.trim().toLowerCase().slice(0, 100);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(clean) ? clean : '';
}

export function sanitizeDate(date: any): string | null {
  if (typeof date !== 'string') return null;
  const trimmed = date.trim();
  // Enforce YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * 5. SVG Security Inspector (Prevents Stored XSS via SVG payloads)
 */
export function isSafeSvg(svgContent: string): boolean {
  const lower = svgContent.toLowerCase();
  const dangerousPatterns = [
    /<script\b/i,
    /<\/script>/i,
    /javascript:/i,
    /data:text\/html/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /<iframe\b/i,
    /<embed\b/i,
    /<object\b/i
  ];
  return !dangerousPatterns.some(pattern => pattern.test(lower));
}

/**
 * 6. Unified Admin Authorization
 * Protects administrative and sensitive medical/patient endpoints.
 */
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Check 1: Verified Firebase Auth Bearer token belonging to an authorized admin
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      if (isAuthorizedAdminTokenClaims(decoded)) {
        (req as any).user = decoded;
        return next();
      }
    } catch {
      // Fall through to check HMAC-signed admin session token
    }
  }

  // Check 2: HMAC-SHA256 Signed Admin Session Token
  const adminToken = req.headers['x-admin-token'] || req.headers['x-admin-session'];
  if (typeof adminToken === 'string') {
    const verifiedSession = verifyAdminSessionToken(adminToken);
    if (verifiedSession) {
      (req as any).adminSession = verifiedSession;
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    error: 'غير مصرح بالوصول: يتطلب هذا الإجراء صلاحيات إدارية معتمدة'
  });
};

/**
 * 7. Safe Error Response Utility
 * Prevents leaking database schemas, connection strings, or system paths in error responses.
 */
export function sendSafeError(
  res: Response,
  status: number,
  userMessage: string,
  internalError?: any
): Response {
  if (internalError) {
    console.error(`[Security Shield - Safe Error ${status}]:`, internalError);
  }
  return res.status(status).json({
    success: false,
    error: userMessage
  });
}
