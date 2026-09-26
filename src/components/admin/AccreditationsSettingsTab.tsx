import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Check, 
  RotateCcw, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileCheck,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  Camera,
  UploadCloud,
  RefreshCw,
  FileUp,
  Sliders
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { useLanguage } from '../../context/LanguageContext';
import { 
  AccreditationItem, 
  AccreditationsSectionSettings,
  ACCREDITATIONS_LIST,
  DEFAULT_ACCREDITATIONS_SETTINGS,
  getStoredAccreditations,
  saveStoredAccreditations,
  getStoredAccreditationSettings,
  saveStoredAccreditationSettings
} from '../../data/accreditationsData';
import { SmartAccreditationLogo } from '../SmartAccreditationLogo';

interface AccreditationsSettingsTabProps {
  onModuleToggle?: (key: string, enabled: boolean) => void;
  isModuleEnabled?: boolean;
}

export const AccreditationsSettingsTab: React.FC<AccreditationsSettingsTabProps> = ({
  onModuleToggle,
  isModuleEnabled = true
}) => {
  const { isArabic } = useLanguage();

  // Section Header & Config State
  const [sectionSettings, setSectionSettings] = useState<AccreditationsSectionSettings>(() => getStoredAccreditationSettings());
  
  // Accreditations List State
  const [items, setItems] = useState<AccreditationItem[]>(() => {
    const stored = getStoredAccreditations();
    return Array.isArray(stored) ? stored : [];
  });
  
  // Modal Edit / Add State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<AccreditationItem | null>(null);

  // Form Fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [issuerAr, setIssuerAr] = useState('');
  const [issuerEn, setIssuerEn] = useState('');
  const [badgeTextAr, setBadgeTextAr] = useState('');
  const [badgeTextEn, setBadgeTextEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [category, setCategory] = useState<'international' | 'local' | 'insurance' | 'behavioral'>('international');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [active, setActive] = useState(true);

  // File Upload & Compression State
  const [isCompressing, setIsCompressing] = useState(false);
  const [isModalDragging, setIsModalDragging] = useState(false);
  const [targetCardItem, setTargetCardItem] = useState<AccreditationItem | null>(null);
  const cardFileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Feedback Notification
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Direct File Upload from Card Row
  const handleTriggerCardFileUpload = (item: AccreditationItem) => {
    setTargetCardItem(item);
    if (cardFileInputRef.current) {
      cardFileInputRef.current.value = '';
      cardFileInputRef.current.click();
    }
  };

  const handleCardFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetCardItem) return;

    try {
      setIsCompressing(true);
      showFeedback(isArabic ? 'جاري ضغط ومعالجة صورة الشعار...' : 'Processing logo image...');
      const dataUrl = await compressImage(file, 800, 800, 0.9);
      
      const next = items.map((it) => it.id === targetCardItem.id ? {
        ...it,
        logoType: 'custom' as const,
        customLogoUrl: dataUrl
      } : it);
      
      setItems(next);
      saveStoredAccreditations(next);
      setIsCompressing(false);
      showFeedback(isArabic ? `✓ تم تحديث ورفع شعار "${targetCardItem.nameAr}" بنجاح!` : `Logo updated for "${targetCardItem.nameEn}"!`);
    } catch (err) {
      console.error(err);
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res && targetCardItem) {
          const next = items.map((it) => it.id === targetCardItem.id ? {
            ...it,
            logoType: 'custom' as const,
            customLogoUrl: res
          } : it);
          setItems(next);
          saveStoredAccreditations(next);
          showFeedback(isArabic ? `✓ تم رفع شعار "${targetCardItem.nameAr}" بنجاح!` : `Logo updated!`);
        }
      };
      reader.readAsDataURL(file);
      setIsCompressing(false);
    } finally {
      if (e.target) e.target.value = '';
      setTargetCardItem(null);
    }
  };

  // Remove an item's custom logo
  const handleRemoveCardLogo = (id: string) => {
    const next = items.map((it) => it.id === id ? {
      ...it,
      logoType: undefined,
      customLogoUrl: undefined
    } : it);
    setItems(next);
    saveStoredAccreditations(next);
    showFeedback(isArabic ? 'تمت إزالة صورة الشعار بنجاح' : 'Logo removed successfully');
  };

  // Upload logo from device inside Modal
  const processModalFile = async (file: File) => {
    try {
      setIsCompressing(true);
      showFeedback(isArabic ? 'جاري معالجة وضغط صورة الشعار...' : 'Processing logo...');
      const dataUrl = await compressImage(file, 800, 800, 0.9);
      setCustomLogoUrl(dataUrl);
      setIsCompressing(false);
      showFeedback(isArabic ? '✓ تم رفع وضغط صورة الشعار بنجاح!' : '✓ Logo image ready!');
    } catch (err) {
      console.error(err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setCustomLogoUrl(res);
          showFeedback(isArabic ? '✓ تم رفع صورة الشعار بنجاح!' : '✓ Logo uploaded!');
        }
      };
      reader.readAsDataURL(file);
      setIsCompressing(false);
    }
  };

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processModalFile(file);
    if (e.target) e.target.value = '';
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsModalDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processModalFile(file);
    }
  };

  // Sync external events if needed
  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredAccreditations();
      setItems(Array.isArray(stored) ? stored : []);
      setSectionSettings(getStoredAccreditationSettings());
    };
    window.addEventListener('raba_accreditations_updated', handleUpdate);
    window.addEventListener('raba_accreditations_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('raba_accreditations_updated', handleUpdate);
      window.removeEventListener('raba_accreditations_settings_updated', handleUpdate);
    };
  }, []);

  // Save Section Header Settings
  const handleSaveSectionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAccreditationSettings(sectionSettings);
    showFeedback(isArabic ? 'تم حفظ إعدادات ونصوص قسم الاعتمادات بنجاح' : 'Section settings saved successfully');
  };

  // Reset Section Header Settings
  const handleResetSectionSettings = () => {
    setSectionSettings(DEFAULT_ACCREDITATIONS_SETTINGS);
    saveStoredAccreditationSettings(DEFAULT_ACCREDITATIONS_SETTINGS);
    showFeedback(isArabic ? 'تمت استعادة نصوص القسم الافتراضية' : 'Section settings reset to default');
  };

  // Toggle Item Active/Inactive
  const handleToggleItemActive = (id: string) => {
    const next = items.map((it) => it.id === id ? { ...it, active: !it.active } : it);
    setItems(next);
    saveStoredAccreditations(next);
    showFeedback(isArabic ? 'تم تغيير حالة الظهور للاعتماد' : 'Accreditation visibility updated');
  };

  // Move Item Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    next.forEach((it, idx) => { it.order = idx + 1; });
    setItems(next);
    saveStoredAccreditations(next);
  };

  // Move Item Down
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    next.forEach((it, idx) => { it.order = idx + 1; });
    setItems(next);
    saveStoredAccreditations(next);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      showFeedback(isArabic ? 'يجب الإبقاء على اعتماد واحد على الأقل' : 'At least one accreditation must remain', 'error');
      return;
    }
    const next = items.filter((it) => it.id !== id);
    next.forEach((it, idx) => { it.order = idx + 1; });
    setItems(next);
    saveStoredAccreditations(next);
    showFeedback(isArabic ? 'تم حذف الاعتماد بنجاح' : 'Accreditation deleted');
  };

  // Reset Accreditations to Defaults (without forcing vector logos)
  const handleResetAllItems = () => {
    const next = ACCREDITATIONS_LIST.map((it) => ({
      ...it,
      logoType: undefined,
      customLogoUrl: undefined
    }));
    setItems(next);
    saveStoredAccreditations(next);
    showFeedback(isArabic ? 'تمت استعادة قائمة الاعتمادات مع تفريغ الشعارات لرفعها من جديد' : 'Reset accreditations list');
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setIsNewItem(true);
    setEditingItem(null);
    setNameAr('');
    setNameEn('');
    setIssuerAr('');
    setIssuerEn('');
    setBadgeTextAr('معتمد رسمياً');
    setBadgeTextEn('Verified');
    setDescriptionAr('');
    setDescriptionEn('');
    setCategory('international');
    setCustomLogoUrl('');
    setCertificateNumber(`RABA-${Date.now().toString().slice(-5)}`);
    setValidUntil('2027');
    setActive(true);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: AccreditationItem) => {
    setIsNewItem(false);
    setEditingItem(item);
    setNameAr(item.nameAr);
    setNameEn(item.nameEn);
    setIssuerAr(item.issuerAr);
    setIssuerEn(item.issuerEn);
    setBadgeTextAr(item.badgeTextAr);
    setBadgeTextEn(item.badgeTextEn);
    setDescriptionAr(item.descriptionAr);
    setDescriptionEn(item.descriptionEn);
    setCategory(item.category);
    setCustomLogoUrl(item.customLogoUrl || '');
    setCertificateNumber(item.certificateNumber || '');
    setValidUntil(item.validUntil || '');
    setActive(item.active !== false);
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      showFeedback(isArabic ? 'يرجى إدخال اسم جهة الاعتماد بالعربية' : 'Arabic name is required', 'error');
      return;
    }

    const effectiveCustomLogo = customLogoUrl.trim() ? customLogoUrl.trim() : undefined;

    if (isNewItem) {
      const newItem: AccreditationItem = {
        id: `acc-${Date.now()}`,
        code: nameEn ? nameEn.slice(0, 5).toUpperCase() : 'ACC',
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim() || nameAr.trim(),
        issuerAr: issuerAr.trim() || nameAr.trim(),
        issuerEn: issuerEn.trim() || nameEn.trim(),
        category,
        descriptionAr: descriptionAr.trim(),
        descriptionEn: descriptionEn.trim() || descriptionAr.trim(),
        badgeTextAr: badgeTextAr.trim() || 'معتمد رسمياً',
        badgeTextEn: badgeTextEn.trim() || 'Verified',
        verified: true,
        active,
        order: items.length + 1,
        logoType: effectiveCustomLogo ? 'custom' : undefined,
        customLogoUrl: effectiveCustomLogo,
        certificateNumber: certificateNumber.trim(),
        validUntil: validUntil.trim()
      };
      const next = [...items, newItem];
      setItems(next);
      saveStoredAccreditations(next);
      showFeedback(isArabic ? 'تمت إضافة الاعتماد الجديد بنجاح' : 'New accreditation added');
    } else if (editingItem) {
      const next = items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            nameAr: nameAr.trim(),
            nameEn: nameEn.trim() || nameAr.trim(),
            issuerAr: issuerAr.trim() || nameAr.trim(),
            issuerEn: issuerEn.trim() || nameEn.trim(),
            category,
            descriptionAr: descriptionAr.trim(),
            descriptionEn: descriptionEn.trim() || descriptionAr.trim(),
            badgeTextAr: badgeTextAr.trim(),
            badgeTextEn: badgeTextEn.trim(),
            active,
            logoType: effectiveCustomLogo ? 'custom' : undefined,
            customLogoUrl: effectiveCustomLogo,
            certificateNumber: certificateNumber.trim(),
            validUntil: validUntil.trim()
          };
        }
        return it;
      });
      setItems(next);
      saveStoredAccreditations(next);
      showFeedback(isArabic ? 'تم تحديث بيانات وشعار الاعتماد بنجاح' : 'Accreditation updated');
    }

    setIsModalOpen(false);
  };

  // Helper for rendering logo preview in card
  const renderPreviewLogo = (it: AccreditationItem) => {
    if (it.customLogoUrl) {
      return (
        <SmartAccreditationLogo 
          src={it.customLogoUrl} 
          alt={it.nameAr}
          className="h-10 w-auto max-w-[85px]"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-0.5 p-1 text-center">
        <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-[#00E5BE]" />
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
          {isArabic ? 'رفع شعار' : 'Upload'}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Top Banner & Intro */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-[#0B3B36]/10 to-amber-500/10 border border-teal-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-800 dark:text-[#00E5BE]">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-teal-800 dark:text-[#00E5BE]">
              {isArabic ? 'لوحة التحكم في الاعتمادات والشهادات' : 'Accreditations & Certificates Control'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {isArabic ? 'تخصيص شريط "معترف بنا من" بالكامل' : 'Customize "Recognized By" Section'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {isArabic 
              ? 'التحكم الكامل بنصوص وعناوين القسم، إضافة وتعديل جهات الاعتماد الرسمية، ترتيب الشعارات، وتفعيل أو إخفاء أي اعتماد فورياً.' 
              : 'Full control over section headlines, adding/editing badges, reordering logos, and toggling visibility.'}
          </p>
        </div>

        {/* Global Module Visibility Toggle if provided */}
        {onModuleToggle && (
          <div className="flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isArabic ? 'ظهور القسم في الموقع:' : 'Section in Site:'}
            </span>
            <button
              type="button"
              onClick={() => onModuleToggle('accreditations', !isModuleEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                isModuleEnabled
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isModuleEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isModuleEnabled ? (isArabic ? 'ظاهر للزوار' : 'Visible') : (isArabic ? 'مخفي' : 'Hidden')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all animate-in fade-in ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SECTION HEADERS & TEXT CUSTOMIZATION                                   */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveSectionSettings} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0D6D54]" />
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {isArabic ? '١. نصوص وعناوين القسم الرئيسية' : '1. Section Headlines & Texts'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSectionSettings}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استعادة الافتراضي' : 'Reset Texts'}</span>
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 text-xs font-black hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isArabic ? 'حفظ نصوص القسم' : 'Save Texts'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subtitle Arabic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'العنوان التمهيدي العلوي (بالعربية):' : 'Top Subtitle (Arabic):'}
            </label>
            <input
              type="text"
              value={sectionSettings.subtitleAr}
              onChange={(e) => setSectionSettings({ ...sectionSettings, subtitleAr: e.target.value })}
              placeholder="اعتمادات وشهادات"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D6D54]"
            />
          </div>

          {/* Subtitle English */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'العنوان التمهيدي العلوي (بالإنجليزية):' : 'Top Subtitle (English):'}
            </label>
            <input
              type="text"
              value={sectionSettings.subtitleEn}
              onChange={(e) => setSectionSettings({ ...sectionSettings, subtitleEn: e.target.value })}
              placeholder="Accreditations & Certifications"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              dir="ltr"
            />
          </div>

          {/* Main Title Arabic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'العنوان الرئيسي للقسم (بالعربية):' : 'Main Title (Arabic):'}
            </label>
            <input
              type="text"
              value={sectionSettings.titleAr}
              onChange={(e) => setSectionSettings({ ...sectionSettings, titleAr: e.target.value })}
              placeholder="معترف بنا من"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Main Title English */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'العنوان الرئيسي للقسم (بالإنجليزية):' : 'Main Title (English):'}
            </label>
            <input
              type="text"
              value={sectionSettings.titleEn}
              onChange={(e) => setSectionSettings({ ...sectionSettings, titleEn: e.target.value })}
              placeholder="Recognized & Accredited By"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              dir="ltr"
            />
          </div>

          {/* Description Arabic */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isArabic ? 'النص الوصفي والتوضيحي أسفل العنوان:' : 'Description Text:'}
            </label>
            <textarea
              rows={2}
              value={sectionSettings.descriptionAr}
              onChange={(e) => setSectionSettings({ ...sectionSettings, descriptionAr: e.target.value })}
              placeholder="يلتزم مركز رابا بأرفع المعايير الدولية والوطنية في تقديم خدمات تحليل السلوك التطبيقي..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Accent bar toggle & color */}
          <div className="flex flex-wrap items-center gap-4 md:col-span-2 pt-2 border-t border-slate-100 dark:border-white/5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sectionSettings.showAccentBar}
                onChange={(e) => setSectionSettings({ ...sectionSettings, showAccentBar: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isArabic ? 'إظهار خط التمييز اللوني تحت العنوان' : 'Show colored accent underline'}
              </span>
            </label>

            {sectionSettings.showAccentBar && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{isArabic ? 'لون الخط:' : 'Color:'}</span>
                {[
                  { name: 'Amber (الأصلي)', class: 'bg-amber-500' },
                  { name: 'Emerald', class: 'bg-emerald-500' },
                  { name: 'Indigo', class: 'bg-indigo-500' },
                  { name: 'Magenta', class: 'bg-[#E5007D]' },
                  { name: 'Cyan', class: 'bg-cyan-500' }
                ].map((c) => (
                  <button
                    key={c.class}
                    type="button"
                    onClick={() => setSectionSettings({ ...sectionSettings, accentBarColor: c.class })}
                    className={`w-6 h-6 rounded-full ${c.class} transition-transform ${
                      sectionSettings.accentBarColor === c.class ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 2. ACCREDITATIONS CARDS & LOGOS MANAGEMENT                                */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? '٢. بطاقات وشعارات جهات الاعتماد المعروضة' : '2. Accreditation Badges & Logos'}
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic 
                ? `يتم عرض (${items.filter(i => i.active).length} من ${items.length}) اعتماد نشط في شريط الصفحة الرئيسية`
                : `(${items.filter(i => i.active).length} of ${items.length}) accreditations are active on home page`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetAllItems}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة ضبط القائمة' : 'Reset List'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إضافة جهة اعتماد جديدة' : 'Add Accreditation'}</span>
            </button>
          </div>
        </div>

        {/* Accreditations List Cards */}
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                item.active
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 shadow-2xs'
                  : 'bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-white/5 opacity-60'
              }`}
            >
              {/* Left: Reorder, Logo Preview & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Reordering Controls */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors cursor-pointer"
                    title={isArabic ? 'تحريك للأعلى' : 'Move up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors cursor-pointer"
                    title={isArabic ? 'تحريك للأسفل' : 'Move down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>

                {/* Logo Box Preview with Direct Upload Trigger */}
                <div 
                  onClick={() => handleTriggerCardFileUpload(item)}
                  className={`w-20 h-16 rounded-xl border flex items-center justify-center p-2 shrink-0 shadow-2xs relative group cursor-pointer transition-all overflow-hidden ${
                    item.customLogoUrl 
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-emerald-500' 
                      : 'bg-emerald-500/5 dark:bg-emerald-500/10 border-dashed border-emerald-500/40 hover:border-emerald-500'
                  }`}
                  title={isArabic ? 'انقر لرفع أو تغيير صورة هذا الشعار مباشرة' : 'Click to upload or replace logo'}
                >
                  {renderPreviewLogo(item)}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span className="text-[9px] font-black">{item.customLogoUrl ? (isArabic ? 'تغيير' : 'Change') : (isArabic ? 'رفع' : 'Upload')}</span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {isArabic ? item.nameAr : item.nameEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      {item.code || 'ACC'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {isArabic ? item.badgeTextAr : item.badgeTextEn}
                    </span>
                    {item.customLogoUrl ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold inline-flex items-center gap-1 border border-emerald-500/30">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{isArabic ? 'صورة شعار مخصصة' : 'Logo uploaded'}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-bold inline-flex items-center gap-1 border border-amber-500/30">
                        <UploadCloud className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{isArabic ? 'بانتظار رفع الشعار' : 'No logo uploaded'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {isArabic ? item.issuerAr : item.issuerEn}
                    </p>
                    {item.customLogoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCardLogo(item.id);
                        }}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                        title={isArabic ? 'حذف صورة الشعار' : 'Remove uploaded logo'}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>{isArabic ? 'حذف الشعار' : 'Remove logo'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Direct Upload Logo Button */}
                <button
                  type="button"
                  onClick={() => handleTriggerCardFileUpload(item)}
                  disabled={isCompressing}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title={isArabic ? 'رفع صورة أو ملف الشعار من جهازك' : 'Upload logo image or file from device'}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{item.customLogoUrl ? (isArabic ? 'تغيير الشعار' : 'Change') : (isArabic ? 'رفع صورة أو ملف' : 'Upload File')}</span>
                </button>

                {/* Active Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleItemActive(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    item.active
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                  title={item.active ? (isArabic ? 'إخفاء من الموقع' : 'Hide from site') : (isArabic ? 'إظهار في الموقع' : 'Show on site')}
                >
                  {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.active ? (isArabic ? 'معروض' : 'Active') : (isArabic ? 'مخفي' : 'Hidden')}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title={isArabic ? 'تعديل كافة بيانات الاعتماد' : 'Edit accreditation'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors cursor-pointer"
                  title={isArabic ? 'حذف الاعتماد' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hidden File Input for Card Row Direct Upload */}
        <input
          ref={cardFileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleCardFileSelected}
          className="hidden"
        />

      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: ADD / EDIT ACCREDITATION ITEM                                    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden text-right max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 sm:left-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isNewItem 
                  ? (isArabic ? 'إضافة جهة اعتماد جديدة' : 'Add New Accreditation')
                  : (isArabic ? 'تعديل بيانات جهة الاعتماد' : 'Edit Accreditation')}
              </h3>
            </div>

            <form onSubmit={handleSaveModal} className="py-4 space-y-4">
              
              {/* Logo & Image Management Section (FILE / IMAGE UPLOAD ONLY - NO DEFAULT LOGOS) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isArabic ? 'شعار جهة الاعتماد (رفع ملف أو صورة فقط):' : 'Accreditation Logo (File/Image Upload Only):'}</span>
                  </label>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {isArabic ? 'رفع مباشر فقط' : 'Upload Only'}
                  </span>
                </div>

                {customLogoUrl ? (
                  /* When an image is uploaded: Show large preview card with change/remove controls */
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="w-24 h-20 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 shrink-0 shadow-2xs overflow-hidden">
                        <SmartAccreditationLogo
                          src={customLogoUrl}
                          alt="Custom logo preview"
                          className="max-h-16 w-auto max-w-[85px]"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {isArabic ? 'تم رفع صورة الشعار بنجاح' : 'Logo image uploaded'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isArabic ? 'ستظهر هذه الصورة في شريط الاعتمادات بالصفحة الرئيسية' : 'This logo will be displayed on the home page'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => modalFileInputRef.current?.click()}
                        disabled={isCompressing}
                        className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{isArabic ? 'استبدال الصورة' : 'Replace Image'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomLogoUrl('')}
                        className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title={isArabic ? 'حذف الصورة' : 'Remove image'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'حذف' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* When no image is uploaded: Show full dropzone */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsModalDragging(true); }}
                    onDragLeave={() => setIsModalDragging(false)}
                    onDrop={handleModalDrop}
                    onClick={() => modalFileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${
                      isModalDragging 
                        ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]' 
                        : 'border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:bg-emerald-500/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-[#00E5BE] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {isCompressing 
                        ? (isArabic ? 'جاري معالجة وضغط الصورة...' : 'Processing image...') 
                        : (isArabic ? 'انقر هنا لاختيار صورة الشعار أو اسحب الملف وأفلته' : 'Click to select logo file or drag and drop here')}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {isArabic ? 'يدعم PNG, JPG, WebP, SVG (يفضل بخلفية شفافة بدقة عالية)' : 'Supports PNG, JPG, WebP, SVG (transparent background recommended)'}
                    </p>
                  </div>
                )}

                {/* Hidden input for modal upload */}
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleModalFileUpload}
                  className="hidden"
                />
              </div>

              {/* Name Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم جهة الاعتماد (عربي):' : 'Name (Arabic):'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: المنظمة الدولية للمعايير"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم جهة الاعتماد (إنجليزي):' : 'Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. ISO 9001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Issuer Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المسمى التخصصي / جهة المنح (عربي):' : 'Issuer / Field (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={issuerAr}
                    onChange={(e) => setIssuerAr(e.target.value)}
                    placeholder="شهادة إدارة الجودة الشاملة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'نص الشارة السريع (عربي):' : 'Badge Tag (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={badgeTextAr}
                    onChange={(e) => setBadgeTextAr(e.target.value)}
                    placeholder="معتمد دولياً للجودة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'النبذة التوضيحية عن الاعتماد (تظهر عند النقر على البطاقة):' : 'Description:'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="معايير جودة دولية صارمة لإدارة العيادات والمراكز الصحية..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* License number & Valid Until */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'رقم الاعتماد / الترخيص:' : 'Credential ID:'}
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="ISO-SA-88421"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'ساري حتى (سنة الصلاحية):' : 'Valid Thru:'}
                  </label>
                  <input
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    placeholder="2027"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Active Toggle in Modal */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'تفعيل وإظهار هذا الاعتماد في شريط الموقع' : 'Active and visible on site'}
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B3B36] text-white dark:bg-[#00E5BE] dark:text-slate-950 text-xs font-black hover:opacity-90 cursor-pointer shadow-md"
                >
                  {isArabic ? 'حفظ الاعتماد' : 'Save Accreditation'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
