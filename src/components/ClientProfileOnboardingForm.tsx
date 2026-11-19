import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import {
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { ClientProfile, FamilyMember } from '../types';
import { createClientProfileInFirestore } from '../services/firestoreService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface ClientProfileOnboardingFormProps {
  firebaseUser: User;
  onComplete: (profile: ClientProfile) => void;
  compact?: boolean;
}

export const ClientProfileOnboardingForm: React.FC<ClientProfileOnboardingFormProps> = ({
  firebaseUser,
  onComplete,
  compact = false,
}) => {
  const { isArabic, direction } = useLanguage();
  const { setClientProfile } = useAuth();

  const [fullName, setFullName] = useState(firebaseUser.displayName || '');
  const [phone, setPhone] = useState(firebaseUser.phoneNumber || '');
  const [email, setEmail] = useState(firebaseUser.email || '');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dob, setDob] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: `fam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: '',
        relation: isArabic ? 'ابن / ابنة' : 'Child / Dependent',
        dob: '',
      },
    ]);
  };

  const handleUpdateMember = (idx: number, field: keyof FamilyMember, value: string) => {
    setFamilyMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveMember = (idx: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg(isArabic ? 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل).' : 'Please enter your full name (at least 3 characters).');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim() || digits.length < 9) {
      setErrorMsg(isArabic ? 'يرجى إدخال رقم جوال صحيح (مثال: 05XXXXXXXX).' : 'Please enter a valid mobile number (e.g. 05XXXXXXXX).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    if (!dob.trim()) {
      setErrorMsg(isArabic ? 'يرجى تحديد تاريخ الميلاد.' : 'Please select your date of birth.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedMembers = familyMembers
        .filter((m) => m.name.trim().length > 0)
        .map((m) => ({
          ...m,
          name: m.name.trim(),
          relation: m.relation.trim() || (isArabic ? 'طفل مستفيد' : 'Child / Dependent'),
          dob: m.dob.trim(),
        }));

      const profile = await createClientProfileInFirestore(firebaseUser.uid, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gender,
        dob: dob.trim(),
        familyMembers: cleanedMembers,
      });

      setClientProfile(profile);
      onComplete(profile);
    } catch (err: any) {
      console.error('[ClientProfileOnboardingForm] Create profile error:', err);
      setErrorMsg(
        err?.message ||
          (isArabic
            ? 'تعذر إنشاء الملف في قاعدة البيانات. يرجى المحاولة مجدداً.'
            : 'Failed to create client file in Firestore. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={direction}>
      <div className="p-3.5 rounded-2xl bg-[#2B95FF]/10 border border-[#2B95FF]/25 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#1263D6] dark:text-[#60AFFF] shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-[#161B26] dark:text-slate-200">
          <span className="font-black block">
            {isArabic ? 'إنشاء ملف الأسرة الإلكتروني للمرة الأولى' : 'First-Time Client File Setup'}
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-300">
            {isArabic
              ? 'أكمل بياناتك الأساسية لإصدار رقم الملف الطبي الخاص بك والوصول الفوري لبوابة الأسرة.'
              : 'Complete your basic details to generate your File Number and open your Family Portal.'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'sm:grid-cols-2 gap-4'}`}>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            {isArabic ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isArabic ? 'الاسم الثلاثي لولي الأمر / العميل' : 'Full name'}
              className={`w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl ${isArabic ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2B95FF]`}
            />
            <UserIcon className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            {isArabic ? 'رقم الجوال' : 'Phone Number'} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl pl-3 pr-10 text-sm text-slate-900 dark:text-white font-mono text-left focus:outline-none focus:border-[#2B95FF]"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl pl-3 pr-10 text-sm text-slate-900 dark:text-white font-mono text-left focus:outline-none focus:border-[#2B95FF]"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
            {isArabic ? 'تاريخ الميلاد' : 'Date of Birth'} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              required
              max={new Date().toISOString().split('T')[0]}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl px-3 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#2B95FF]"
            />
          </div>
        </div>
      </div>

      {/* Gender Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
          {isArabic ? 'الجنس' : 'Gender'} <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gender === 'male'
                ? 'bg-[#1463D6] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'ذكر' : 'Male'}
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gender === 'female'
                ? 'bg-[#1463D6] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isArabic ? 'أنثى' : 'Female'}
          </button>
        </div>
      </div>

      {/* Optional Family Members / Beneficiaries */}
      <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-100">
            <Users className="w-4 h-4 text-[#2B95FF]" />
            <span>{isArabic ? 'أفراد الأسرة / الأبناء (اختياري)' : 'Family Members / Children (Optional)'}</span>
          </div>
          <button
            type="button"
            onClick={handleAddFamilyMember}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1463D6]/10 hover:bg-[#1463D6]/20 text-[#1463D6] dark:text-[#60AFFF] text-[11px] font-black transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إضافة فرد' : 'Add Member'}</span>
          </button>
        </div>

        {familyMembers.length === 0 ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isArabic
              ? 'يمكنك إضافة أسماء الأبناء أو التابعين الآن أو لاحقاً من داخل بوابة الأسرة.'
              : 'You can add children or dependents now or later inside the Family Portal.'}
          </p>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-0.5">
            {familyMembers.map((member, idx) => (
              <div
                key={member.id}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
              >
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                  placeholder={isArabic ? 'اسم الابن / التابع' : 'Member name'}
                  className="sm:col-span-5 h-9 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2B95FF]"
                />
                <input
                  type="text"
                  value={member.relation}
                  onChange={(e) => handleUpdateMember(idx, 'relation', e.target.value)}
                  placeholder={isArabic ? 'صلة القرابة' : 'Relation'}
                  className="sm:col-span-3 h-9 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2B95FF]"
                />
                <input
                  type="date"
                  value={member.dob}
                  onChange={(e) => handleUpdateMember(idx, 'dob', e.target.value)}
                  aria-label={isArabic ? 'تاريخ ميلاد الفرد' : 'Member date of birth'}
                  className="sm:col-span-3 h-9 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-900 dark:text-white outline-none focus:border-[#2B95FF]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMember(idx)}
                  aria-label={isArabic ? 'حذف الفرد' : 'Remove member'}
                  className="sm:col-span-1 h-9 w-full sm:w-9 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#1463D6] to-[#00A88F] hover:brightness-110 active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {isSubmitting
            ? isArabic
              ? 'جاري إنشاء الملف وحفظه...'
              : 'Creating & Saving Client File...'
            : isArabic
            ? 'حفظ الملف والدخول إلى بوابة الأسرة'
            : 'Save Client File & Enter Portal'}
        </span>
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E5BE]" />
        <span>
          {isArabic
            ? 'يتم حفظ بياناتك بأمان في سحابة Cloud Firestore'
            : 'Securely persisted in Cloud Firestore'}
        </span>
      </div>

      {/* WhatsApp Support Notice */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
          {isArabic
            ? 'في حال واجهتك أي مشكلة قم بالتواصل معنا من خلال الواتساب وسوف نقوم بمساعدتك.'
            : 'If you experience any issue, please contact us on WhatsApp and we will assist you.'}
        </p>
        <a
          href={`https://wa.me/966575100100?text=${encodeURIComponent(
            isArabic
              ? 'مرحباً فريق مركز رابا، أحتاج إلى مساعدة في استكمال ملف بوابة الأسرة.'
              : 'Hello Raba Center team, I need assistance completing my Family Portal profile.'
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
  );
};
