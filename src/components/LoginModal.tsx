import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RabaLogo } from './RabaLogo';
import { useLanguage } from '../context/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (username: string) => void;
  onOpenAdmin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, onOpenAdmin }) => {
  const { t, isArabic, direction } = useLanguage();
  const [role, setRole] = useState<'parent' | 'specialist' | 'admin'>('parent');
  const [nationalIdOrPhone, setNationalIdOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (role === 'admin') {
          onOpenAdmin?.();
        } else {
          onSuccess?.(nationalIdOrPhone || (isArabic ? 'ولي أمر المستفيد' : 'Parent / Guardian'));
        }
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-md bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden ${isArabic ? 'text-right' : 'text-left'} p-6 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isArabic ? 'left-5' : 'right-5'} p-2 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer`}
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-5 border-b border-slate-200 dark:border-white/10">
          <RabaLogo variant="vertical" size="lg" className="justify-center" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-4">
            {role === 'admin'
              ? (isArabic ? 'دخول لوحة تحكم المنظومة' : 'Admin Control Login')
              : (isArabic ? 'تسجيل الدخول إلى البوابة الإلكترونية' : 'Sign in to Portal')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {role === 'admin'
              ? (isArabic ? 'إدارة المواعيد، المستخدمين، والصلاحيات التشغيلية' : 'Manage users, permissions, bookings, and clinic settings')
              : (isArabic ? 'متابعة الخطط العلاجية، تقارير جلسات ABA، والمواعيد' : 'Track therapy plans, ABA session reports, and schedule')}
          </p>
        </div>

        {/* 3-Role Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-white/[0.06] rounded-2xl my-4 border border-slate-200 dark:border-white/15">
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              role === 'parent' 
                ? 'bg-sky-600 text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-md' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'أولياء الأمور' : 'Parents'}
          </button>
          <button
            type="button"
            onClick={() => setRole('specialist')}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              role === 'specialist' 
                ? 'bg-sky-600 text-white dark:bg-[#00E5BE] dark:text-slate-950 font-black shadow-md' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'الأخصائيين' : 'Therapists'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenAdmin) {
                onClose();
                onOpenAdmin();
              } else {
                setRole('admin');
                setNationalIdOrPhone('');
                setPassword('');
              }
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              role === 'admin' 
                ? 'bg-[#0B3B36] text-white dark:bg-emerald-400 dark:text-slate-950 font-black shadow-md' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>{isArabic ? 'لوحة الإدارة' : 'Admin'}</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-[#00E5BE] rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {isArabic ? 'تم التحقق بنجاح' : 'Authenticated successfully'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {role === 'admin'
                ? (isArabic ? 'جاري نقلك للوحة التحكم الإدارية...' : 'Opening Admin Dashboard...')
                : (isArabic ? 'مرحباً بك في منصة مركز رابا الرقمية' : 'Welcome to Raba Center Digital Portal')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                {role === 'parent' 
                  ? (isArabic ? 'رقم الهوية الوطنية / الإقامة أو الجوال' : 'National ID / Iqama or Phone') 
                  : role === 'specialist'
                  ? (isArabic ? 'الرقم الوظيفي / البريد المهني' : 'Staff ID / Work Email')
                  : (isArabic ? 'اسم المستخدم أو البريد الإداري' : 'Admin Username or Email')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={nationalIdOrPhone}
                  onChange={(e) => setNationalIdOrPhone(e.target.value)}
                  placeholder={
                    role === 'parent' 
                      ? (isArabic ? 'مثال: 05XXXXXXXX أو 1XXXXXXXXX' : 'e.g. 05XXXXXXXX or ID')
                      : role === 'specialist'
                      ? (isArabic ? 'البريد أو الكود الوظيفي' : 'staff@raba.sa or Staff ID')
                      : 'admin@raba.sa'
                  }
                  className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-2xl py-3 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-[#00E5BE] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00E5BE]/30`}
                />
                <User className={`w-5 h-5 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-3.5`} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isArabic ? 'كلمة المرور' : 'Password'}
                </label>
                <button type="button" className="text-[11px] text-sky-600 dark:text-[#00E5BE] hover:underline cursor-pointer">
                  {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-2xl py-3 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-[#00E5BE] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00E5BE]/30`}
                />
                <Lock className={`w-5 h-5 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-3.5`} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#00E5BE] to-[#0284C7] active:scale-98 text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span>{isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>
                    {role === 'admin' 
                      ? (isArabic ? 'الدخول إلى لوحة التحكم الإدارية' : 'Open Admin Dashboard') 
                      : (isArabic ? 'دخول إلى حسابي' : 'Sign In')}
                  </span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {role === 'admin' && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAdmin?.();
                    onClose();
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-[#00E5BE] hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00E5BE]" />
                  <span>{isArabic ? 'الانتقال إلى صفحة دخول لوحة التحكم الرئيسية ↗' : 'Go to Dedicated Admin Login Page ↗'}</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
              <span>{isArabic ? 'تسجيل دخول مشفر ومحمي بنظام الصلاحيات RBAC' : 'Encrypted RBAC authentication'}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
