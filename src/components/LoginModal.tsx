import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getClientProfileFromFirestore } from '../services/firestoreService';
import { ClientProfileOnboardingForm } from './ClientProfileOnboardingForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (username: string) => void;
  onOpenAdmin?: () => void;
  onOpenPortal?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPortal,
}) => {
  const { isArabic, direction } = useLanguage();
  const {
    user,
    clientProfile,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendPasswordReset,
    logout,
    setClientProfile,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [onboardingUser, setOnboardingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg(null);
      setInfoMsg(null);
      setOnboardingUser(null);
      return;
    }

    if (user && clientProfile) {
      onClose();
      onOpenPortal?.();
    } else if (user && !clientProfile) {
      // User already authenticated with Firebase Auth but hasn't created Firestore profile yet
      getClientProfileFromFirestore(user.uid).then((profile) => {
        if (profile) {
          setClientProfile(profile);
          onClose();
          onOpenPortal?.();
        } else {
          setOnboardingUser(user);
        }
      });
    }
  }, [isOpen, user, clientProfile, onClose, onOpenPortal, setClientProfile]);

  if (!isOpen) return null;

  const mapFirebaseAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/operation-not-allowed') {
      return isArabic
        ? 'تسجيل البريد الإلكتروني غير مفعل حالياً في Firebase Console. يمكنك الدخول فوراً عبر Google أو تفعيل Email/Password من إعدادات المصادقة.'
        : 'Email/Password sign-in is not yet enabled in Firebase Console. Please use Google Sign-In or enable Email/Password under Authentication > Sign-in method.';
    }
    if (code === 'auth/email-already-in-use') {
      return isArabic
        ? 'هذا البريد الإلكتروني مسجل بالفعل. قم بتسجيل الدخول بدلاً من ذلك.'
        : 'This email is already registered. Please sign in instead.';
    }
    if (code === 'auth/invalid-email') {
      return isArabic ? 'صيغة البريد الإلكتروني غير صحيحة.' : 'Invalid email address format.';
    }
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return isArabic
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        : 'Incorrect email or password.';
    }
    if (code === 'auth/weak-password') {
      return isArabic
        ? 'كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف على الأقل.'
        : 'Password must be at least 6 characters long.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return isArabic
        ? 'تم إغلاق نافذة Google قبل إتمام تسجيل الدخول.'
        : 'Google sign-in popup was closed before completing.';
    }
    if (code === 'auth/too-many-requests') {
      return isArabic
        ? 'محاولات متعددة، يرجى الانتظار قليلاً والمحاولة لاحقاً.'
        : 'Too many attempts. Please wait a moment and try again.';
    }
    return err?.message || (isArabic ? 'حدث خطأ أثناء تسجيل الدخول.' : 'Authentication error.');
  };

  const handlePostAuthUser = async (fbUser: User) => {
    const existing = await getClientProfileFromFirestore(fbUser.uid);
    if (existing) {
      setClientProfile(existing);
      onSuccess?.(existing.fullName);
      onClose();
      onOpenPortal?.();
    } else {
      setOnboardingUser(fbUser);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setErrorMsg(isArabic ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fbUser =
        authMode === 'register'
          ? await registerWithEmail(email, password)
          : await signInWithEmail(email, password);
      await handlePostAuthUser(fbUser);
    } catch (err: any) {
      setErrorMsg(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setIsGoogleLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      await handlePostAuthUser(fbUser);
    } catch (err: any) {
      setErrorMsg(mapFirebaseAuthError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(
        isArabic
          ? 'أدخل بريدك الإلكتروني أولاً لإرسال رابط استعادة كلمة المرور.'
          : 'Enter your email address first to receive a password reset link.'
      );
      return;
    }
    try {
      await sendPasswordReset(email);
      setInfoMsg(
        isArabic
          ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.'
          : 'Password reset link sent to your email.'
      );
    } catch (err: any) {
      setErrorMsg(mapFirebaseAuthError(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          onboardingUser ? 'max-w-xl' : 'max-w-md'
        } bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isArabic ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${
            isArabic ? 'left-5' : 'right-5'
          } z-10 p-2 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer`}
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          {/* Header */}
          <div className="flex flex-col items-center text-center pt-1 pb-4 border-b border-slate-200 dark:border-white/10">
            <RabaLogo variant="vertical" size="lg" className="justify-center" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-3">
              {onboardingUser
                ? isArabic
                  ? 'استكمال ملف العميل والأسرة'
                  : 'Complete Client & Family Profile'
                : authMode === 'register'
                ? isArabic
                  ? 'إنشاء حساب وملف جديد'
                  : 'Create Family Portal Account'
                : isArabic
                ? 'بوابة الأسرة الإلكترونية'
                : 'Family Digital Portal'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {onboardingUser
                ? isArabic
                  ? 'خطوة واحدة أخيرة لحفظ ملفك وربطه بحجوزاتك'
                  : 'One quick step to create your client file and link your bookings'
                : isArabic
                ? 'إدارة ملف الأسرة، متابعة الحجوزات، والباقات التأهيلية'
                : 'Manage family file, track bookings, and rehabilitation packages'}
            </p>
          </div>

          {onboardingUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs">
                <span className="text-slate-600 dark:text-slate-300 truncate">
                  {onboardingUser.email || onboardingUser.displayName || onboardingUser.uid}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setOnboardingUser(null);
                  }}
                  className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تبديل الحساب' : 'Switch Account'}</span>
                </button>
              </div>
              <ClientProfileOnboardingForm
                firebaseUser={onboardingUser}
                compact
                onComplete={(created) => {
                  onSuccess?.(created.fullName);
                  onClose();
                  onOpenPortal?.();
                }}
              />
            </div>
          ) : (
            <>
              {/* Sign In / Register Toggle */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-slate-800 text-[#1463D6] dark:text-[#60AFFF] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-800 text-[#1463D6] dark:text-[#60AFFF] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {infoMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {/* Google Sign-In Button */}
              <button
                type="button"
                disabled={isGoogleLoading || isSubmitting}
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
                <span>
                  {isGoogleLoading
                    ? isArabic
                      ? 'جاري الاتصال بحساب Google...'
                      : 'Connecting to Google...'
                    : isArabic
                    ? 'المتابعة باستخدام Google'
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                <span className="shrink-0 px-3 text-[11px] font-bold text-slate-400">
                  {isArabic ? 'أو بالبريد الإلكتروني' : 'OR VIA EMAIL'}
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
              </div>

              <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-2xl py-3 pl-4 pr-10 text-sm text-slate-900 dark:text-white font-mono text-left placeholder:text-slate-400 focus:outline-none focus:border-[#2B95FF]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {isArabic ? 'كلمة المرور' : 'Password'}
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-[#1463D6] dark:text-[#00E5BE] hover:underline cursor-pointer"
                      >
                        {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-2xl py-3 ${
                        isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                      } text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2B95FF]`}
                    />
                    <Lock className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-2xl py-3 ${
                          isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                        } text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2B95FF]`}
                      />
                      <Lock className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3.5' : 'left-3.5'} top-3.5`} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] active:scale-[0.98] text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-1 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>
                      {authMode === 'register'
                        ? isArabic
                          ? 'جاري إنشاء الحساب...'
                          : 'Creating account...'
                        : isArabic
                        ? 'جاري تسجيل الدخول...'
                        : 'Signing in...'}
                    </span>
                  ) : (
                    <>
                      <span>
                        {authMode === 'register'
                          ? isArabic
                            ? 'إنشاء الحساب والمتابعة'
                            : 'Create Account & Continue'
                          : isArabic
                          ? 'دخول إلى بوابة الأسرة'
                          : 'Sign In to Portal'}
                      </span>
                      {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
                  <span>
                    {isArabic
                      ? 'دخول موثق ومحمي عبر Firebase Authentication'
                      : 'Secured via Firebase Authentication'}
                  </span>
                </div>

                {/* WhatsApp Support Notice */}
                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                    {isArabic
                      ? 'في حال واجهتك أي مشكلة قم بالتواصل معنا من خلال الواتساب وسوف نقوم بمساعدتك.'
                      : 'If you experience any issue, please contact us on WhatsApp and we will assist you.'}
                  </p>
                  <a
                    href={`https://wa.me/966575100100?text=${encodeURIComponent(
                      isArabic
                        ? 'مرحباً فريق مركز رابا، أحتاج إلى مساعدة بخصوص بوابة الأسرة الإلكترونية.'
                        : 'Hello Raba Center team, I need assistance with the Family Portal.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-black shrink-0 shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{isArabic ? 'تواصل عبر الواتساب' : 'WhatsApp Support'}</span>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
