import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';

/**
 * 1. HTTP Security Headers Middleware (OWASP Secure Headers)
 * Protects against MIME-sniffing, clickjacking, XSS, and info leakage.
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
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
  const host = req.headers.host;

  // In non-production local development without origin header, permit request
  if (!origin && process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (!origin || !host) {
    return res.status(403).json({
      success: false,
      error: 'فشل التحقق الأمني من مصدر الطلب (CSRF validation failed)'
    });
  }

  try {
    const parsedOrigin = new URL(origin);
    const originHost = parsedOrigin.host;
    const isLocal = originHost.includes('localhost') || originHost.includes('127.0.0.1') || originHost.includes('0.0.0.0');
    const isSameHost = originHost === host;

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
  // Check 1: Firebase Auth Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      (req as any).user = decoded;
      return next();
    } catch {
      // Fall through to check session tokens
    }
  }

  // Check 2: Admin Session Token in header
  const adminToken = req.headers['x-admin-token'] || req.headers['x-admin-session'];
  if (typeof adminToken === 'string' && adminToken.length > 10) {
    try {
      const decoded = Buffer.from(adminToken, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      // Format: userId:username:timestamp
      if (parts.length >= 2 && (parts[0].startsWith('usr-') || parts[1] === 'admin' || parts[1].includes('.'))) {
        // Token is valid structure
        return next();
      }
    } catch {
      // Invalid base64
    }
  }

  // Check 3: Development mode localhost bypass for internal tooling
  const host = req.headers.host || '';
  if (process.env.NODE_ENV !== 'production' && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    const token = req.headers['x-admin-token'];
    if (token) return next();
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
