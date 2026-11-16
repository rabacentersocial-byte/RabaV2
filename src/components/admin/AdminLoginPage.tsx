import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Globe, 
  Sun, 
  Moon
} from 'lucide-react';
import { RabaLogo } from '../RabaLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { AdminUser } from '../../types';
import { authenticateAdmin, authenticateAdminWithGoogle } from '../../data/adminData';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToWebsite
}) => {
  const { isArabic, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { signInWithGoogle } = useAuth();
  const isDark = theme === 'dark';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      const { getLazyAuth } = await import('../../lib/firebase');
      const authInstance = await getLazyAuth();
      const fbUser = authInstance.currentUser;
      if (!fbUser) {
        throw new Error('لم يكتمل التحقق من حساب Google');
      }
      const adminUser = authenticateAdminWithGoogle({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL
      });
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(adminUser);
      }, 600);
    } catch (err: any) {
      console.error('[AdminLoginPage] Google sign-in error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setErrorMessage(isArabic ? 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.' : 'Sign-in popup was closed before completing.');
      } else {
        setErrorMessage(
          isArabic
            ? 'تعذر تسجيل الدخول عبر Google. تأكد من السماح بالنوافذ المنبثقة وإضافة النطاق في Firebase Auth.'
            : 'Google sign-in failed. Please allow popups and verify Firebase Auth authorized domains.'
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(isArabic ? 'يرجى كتابة اسم المستخدم أو البريد الإلكتروني' : 'Please enter username or email');
      return;
    }

    if (!password.trim()) {
      setErrorMessage(isArabic ? 'يرجى كتابة كلمة المرور' : 'Please enter password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateAdmin(identifier, password);
      setIsLoading(false);

      if (result.success && result.user) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 700);
      } else {
        setErrorMessage(result.error || (isArabic ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid credentials'));
      }
    } catch {
      setIsLoading(false);
      setErrorMessage(isArabic ? 'حدث خطأ أثناء التحقق من بيانات الدخول' : 'An error occurred during login verification');
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col bg-[#0D1B2A] text-white selection:bg-[#1463D6] selection:text-white font-sans overflow-x-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#0E2A54]/80 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#2E86EB]/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        {/* Logo & Platform Tag */}
        <div className="flex items-center gap-3">
          <RabaLogo variant="horizontal" size="md" />
          <div className="hidden sm:flex items-center gap-2 pr-3 rtl:pr-3 rtl:border-r rtl:border-white/15 ltr:pl-3 ltr:border-l ltr:border-white/15">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E86EB]/15 border border-[#2E86EB]/30 text-[#60AFFF] text-[11px] font-black tracking-wide">
              {isArabic ? 'لوحة تحكم الإدارة' : 'Admin Portal'}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isArabic ? 'Change language to English' : 'تغيير اللغة للعربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#00E5BE]" />
            <span>{isArabic ? 'English' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Back to Website Button */}
          <button
            onClick={onBackToWebsite}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{isArabic ? 'الموقع الإلكتروني' : 'Public Website'}</span>
            {isArabic ? <ArrowLeft className="w-3.5 h-3.5 text-[#00E5BE]" /> : <ArrowRight className="w-3.5 h-3.5 text-[#00E5BE]" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Center */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          
          {/* Main Glassmorphic Login Card */}
          <div className="bg-[#111827]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {/* Top Glowing Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2E86EB] to-transparent" />

            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0E2A54] to-[#1463D6] text-white flex items-center justify-center shadow-lg shadow-[#2E86EB]/20 mb-3.5 ring-4 ring-[#2E86EB]/10">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isArabic ? 'تسجيل دخول لوحة التحكم' : 'Control Center Login'}
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs">
                {isArabic 
                  ? 'بوابة الإدارة الطبية والتشغيلية المعتمدة لمركز رابا لتأهيل التوحد'
                  : 'Authorized medical & operational control portal for Raba Autism Rehabilitation'}
              </p>
            </div>

            {/* Success State Screen */}
            {isSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#00E5BE] border border-[#00E5BE]/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {isArabic ? 'تم التحقق بنجاح!' : 'Authenticated Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {isArabic ? 'جاري فتح لوحة التحكم وصلاحيات الحساب...' : 'Loading dashboard & role permissions...'}
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0B3B36] to-[#00E5BE] rounded-full animate-pulse w-full" />
                </div>
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Notice */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span className="font-medium leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* 1. Username or Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isArabic ? 'اسم المستخدم أو البريد الإداري' : 'Username or Admin Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder={isArabic ? 'مثال: admin أو admin@raba.sa' : 'e.g. admin or admin@raba.sa'}
                      className={`w-full bg-[#0E1526] border ${errorMessage ? 'border-rose-500/60' : 'border-white/15'} rounded-2xl py-3 ${isArabic ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-sm text-white placeholder:text-slate-400 outline-none focus:border-[#2E86EB] focus:ring-2 focus:ring-[#2E86EB]/20 transition-all font-medium`}
                      disabled={isLoading}
                    />
                    <User className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
                  </div>
                </div>

                {/* 2. Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isArabic ? 'كلمة المرور' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-bold text-[#60AFFF] hover:underline cursor-pointer"
                    >
                      {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-[#0E1526] border ${errorMessage ? 'border-rose-500/60' : 'border-white/15'} rounded-2xl py-3 ${isArabic ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11 text-left'} text-sm text-white placeholder:text-slate-400 outline-none focus:border-[#2E86EB] focus:ring-2 focus:ring-[#2E86EB]/20 transition-all font-mono`}
                      disabled={isLoading}
                    />
                    <Lock className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
                    
                    {/* Toggle password visibility */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer`}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-slate-800 text-[#2E86EB] focus:ring-[#2E86EB] focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{isArabic ? 'تذكر جلستي على هذا الجهاز' : 'Remember my session'}</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0E2A54] to-[#1463D6] hover:opacity-95 active:scale-[0.99] text-white font-black text-sm transition-all shadow-lg shadow-[#2E86EB]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isArabic ? 'جاري التحقق والاعتماد...' : 'Verifying credentials...'}</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-blue-300" />
                      <span>{isArabic ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard'}</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400">
                    {isArabic ? 'أو للمزامنة السحابية المباشرة (Firestore)' : 'Or for live Firestore Cloud Sync'}
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                {/* Google Cloud Auth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                      <span>{isArabic ? 'جاري الاتصال بـ Google...' : 'Connecting to Google...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                      </svg>
                      <span>{isArabic ? 'تسجيل الدخول عبر Google (المزامنة السحابية)' : 'Sign in with Google (Cloud Sync)'}</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Compliance & Security Footer Notice */}
          <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isArabic ? 'نظام مشفر ومحمي بمعايير أمن المعلومات الطبية والامتثال الصحي' : 'Encrypted with healthcare security & privacy compliance'}</span>
            </p>
            <p>© {new Date().getFullYear()} {isArabic ? 'مركز رابا لتأهيل ذوي اضطراب طيف التوحد — الرياض' : 'Raba Autism Rehabilitation Center — Riyadh'}</p>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-black text-white">
              {isArabic ? 'استعادة أو إعادة ضبط كلمة المرور' : 'Password Recovery'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isArabic 
                ? 'لأسباب تتعلق بالسرية الطبية وأمن المنظومة، تتم إعادة تعيين كلمات المرور حصرياً عبر المدير العام التنفيذي للمركز.'
                : 'For clinical compliance and security, administrative passwords are reset exclusively via the Super Administrator.'}
            </p>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 text-xs text-slate-200 text-right rtl:text-right ltr:text-left space-y-1">
              <div className="font-bold text-white mb-1">{isArabic ? 'قنوات الدعم الداخلي:' : 'Internal Channels:'}</div>
              <div>• {isArabic ? 'البريد التقني:' : 'Email:'} <span className="font-mono text-[#00E5BE]">admin@raba.sa</span></div>
              <div>• {isArabic ? 'هاتف الإدارة التنفيذية:' : 'Executive Ext:'} <span className="font-mono text-[#00E5BE]">011 234 5678</span></div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isArabic ? 'حسناً، فهمت' : 'Understood'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLoginPage;
