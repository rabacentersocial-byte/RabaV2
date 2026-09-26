import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Key, 
  Copy, 
  Check, 
  Globe, 
  Code, 
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getStoredSupabaseConfig, 
  saveStoredSupabaseConfig, 
  testSupabaseConnection, 
  SUPABASE_SQL_SCHEMA,
  SupabaseConfig 
} from '../../lib/supabase';

interface SupabaseSettingsSectionProps {
  onNotify?: (msg: string, type: 'success' | 'error') => void;
}

export const SupabaseSettingsSection: React.FC<SupabaseSettingsSectionProps> = ({ onNotify }) => {
  const { isArabic } = useLanguage();
  const [config, setConfig] = useState<SupabaseConfig>({ url: '', anonKey: '', connected: false });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    const current = getStoredSupabaseConfig();
    setConfig(current);
  }, []);

  const handleSaveAndTest = async () => {
    if (!config.url || !config.anonKey) {
      const msg = isArabic 
        ? 'يرجى إدخال كل من رابط المشروع (Project URL) ومفتاح (Anon Key)' 
        : 'Please provide both Project URL and Anon Public Key';
      setTestResult({ success: false, message: msg });
      if (onNotify) onNotify(msg, 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testSupabaseConnection(config.url.trim(), config.anonKey.trim());
      setTestResult(result);
      if (result.success) {
        setConfig(prev => ({
          ...prev,
          url: config.url.trim(),
          anonKey: config.anonKey.trim(),
          connected: true,
          lastTested: new Date().toISOString()
        }));
        if (onNotify) onNotify(result.message, 'success');
      } else {
        if (onNotify) onNotify(result.message, 'error');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'خطأ غير متوقع أثناء الاتصال';
      setTestResult({ success: false, message: errMsg });
      if (onNotify) onNotify(errMsg, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute top-0 end-0 -mt-12 -me-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3ECF8E]/20 to-teal-500/10 border border-[#3ECF8E]/30 flex items-center justify-center text-[#3ECF8E] shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-white">
                {isArabic ? 'الربط المباشر مع Supabase' : 'Direct Supabase Integration'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                config.connected 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {config.connected 
                  ? (isArabic ? 'متصل ✓' : 'Connected') 
                  : (isArabic ? 'جاهز للإعداد' : 'Ready to Connect')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isArabic 
                ? 'مكتبة @supabase/supabase-js مثبتة وجاهزة للربط المباشر مع قاعدة بيانات PostgreSQL وسحابة Supabase' 
                : '@supabase/supabase-js is installed and ready for direct PostgreSQL connection'}
            </p>
          </div>
        </div>

        <a 
          href="https://supabase.com/dashboard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700 transition-all self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4 text-[#3ECF8E]" />
          <span>{isArabic ? 'فتح لوحة تحكم Supabase' : 'Open Supabase Dashboard'}</span>
        </a>
      </div>

      {/* Connection Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {/* Project URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#3ECF8E]" />
              {isArabic ? 'رابط المشروع (Project URL)' : 'Project URL'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">https://xyz.supabase.co</span>
          </label>
          <input
            type="text"
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            placeholder="https://your-project-id.supabase.co"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] text-slate-100 placeholder-slate-500 text-xs font-mono transition-all"
            dir="ltr"
          />
        </div>

        {/* Public Anon Key */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              {isArabic ? 'مفتاح الوصول العام (Anon Key)' : 'Public Anon Key'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">eyJh...</span>
          </label>
          <input
            type="password"
            value={config.anonKey}
            onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] text-slate-100 placeholder-slate-500 text-xs font-mono transition-all"
            dir="ltr"
          />
        </div>
      </div>

      {/* Action Buttons & Feedback */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAndTest}
            disabled={isTesting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3ECF8E] to-teal-500 hover:from-[#34b77c] hover:to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3ECF8E]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>
              {isTesting 
                ? (isArabic ? 'جاري فحص الاتصال...' : 'Testing...') 
                : (isArabic ? 'حفظ واختبار الاتصال المباشر' : 'Save & Test Connection')}
            </span>
          </button>

          <button
            onClick={() => setShowSql(!showSql)}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Code className="w-4 h-4 text-sky-400" />
            <span>{showSql ? (isArabic ? 'إخفاء سكربت SQL' : 'Hide SQL') : (isArabic ? 'عرض سكربت الجداول SQL' : 'View SQL Schema')}</span>
          </button>
        </div>

        {/* Quick Instructions Step */}
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" />
          <span>
            {isArabic 
              ? 'تجد المفاتيح في Supabase: Settings -> API -> Project URL & Project API Keys'
              : 'Find keys in Supabase: Settings -> API -> Project URL & Project API Keys'}
          </span>
        </div>
      </div>

      {/* Test Result Message */}
      {testResult && (
        <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-xs font-bold ${
          testResult.success 
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        }`}>
          {testResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* SQL Script Box */}
      {showSql && (
        <div className="mt-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'سكربت إنشاء جداول قاعدة البيانات (SQL Editor)' : 'SQL Schema Setup'}</span>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[#3ECF8E] text-[11px] font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ السكربت' : 'Copy SQL')}</span>
            </button>
          </div>
          <pre className="text-[11px] text-slate-300 font-mono overflow-x-auto max-h-56 p-2 bg-slate-900/50 rounded-xl" dir="ltr">
            {SUPABASE_SQL_SCHEMA}
          </pre>
          <p className="text-[10px] text-slate-500 mt-2">
            {isArabic 
              ? 'انسخ السكربت أعلاه، ثم توجه إلى لوحة Supabase وافتح SQL Editor واضغط Run لإنشاء الجداول وصلاحيات الأمان تلقائياً.' 
              : 'Copy the SQL above and run it in the Supabase SQL Editor to initialize tables.'}
          </p>
        </div>
      )}

      {/* 3 Step Guide Card */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[10px]">1</span>
            <span>{isArabic ? 'إنشاء مشروع Supabase' : 'Create Project'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isArabic ? 'سجل في supabase.com وأنشئ مشروع جديد مجاني في ثوانٍ.' : 'Sign up at supabase.com and create a free project.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[10px]">2</span>
            <span>{isArabic ? 'نسخ المفاتيح' : 'Copy Keys'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isArabic ? 'من Project Settings -> API انسخ رابط المشروع ومفتاح anon.' : 'From Project Settings -> API copy URL and anon key.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center text-[10px]">3</span>
            <span>{isArabic ? 'تشغيل السكربت والربط' : 'Run SQL & Connect'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isArabic ? 'شغل سكربت الجداول أعلاه واضغط زر حفظ واختبار الاتصال.' : 'Run the SQL schema and hit Save & Test Connection.'}
          </p>
        </div>
      </div>
    </div>
  );
};
