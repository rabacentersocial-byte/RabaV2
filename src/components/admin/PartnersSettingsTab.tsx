import React, { useState, useEffect, useRef } from 'react';
import { 
  Handshake, 
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
  Upload,
  Image as ImageIcon,
  Building2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage } from '../../utils/imageCompressor';
import { 
  PartnerItem, 
  PartnersSliderSettings, 
  DEFAULT_PARTNERS, 
  DEFAULT_PARTNERS_SETTINGS, 
  getStoredPartners, 
  saveStoredPartners,
  getStoredPartnersSettings,
  saveStoredPartnersSettings
} from '../../data/partnersData';
import { PartnerLogoRenderer } from '../PartnerLogos';

interface PartnersSettingsTabProps {
  onClose?: () => void;
}

export const PartnersSettingsTab: React.FC<PartnersSettingsTabProps> = () => {
  const { isArabic } = useLanguage();

  const [partners, setPartners] = useState<PartnerItem[]>(() => getStoredPartners());
  const [settings, setSettings] = useState<PartnersSliderSettings>(() => getStoredPartnersSettings());
  
  // Feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<PartnerItem>>({
    name: '',
    nameEn: '',
    letter: '',
    category: '',
    categoryEn: '',
    badge: '',
    badgeEn: '',
    logoUrl: '',
    websiteUrl: '',
    accentColor: '#0D6D54',
    isActive: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setFormData({
      id: `partner-${Date.now()}`,
      name: '',
      nameEn: '',
      letter: 'ش',
      category: isArabic ? 'شريك استراتيجي' : 'Strategic Partner',
      categoryEn: 'Strategic Partner',
      badge: isArabic ? 'شريك معتمد' : 'Verified Partner',
      badgeEn: 'Verified Partner',
      logoUrl: '',
      websiteUrl: '',
      accentColor: '#0D6D54',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PartnerItem) => {
    setEditingPartner(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Automatically compress and preserve transparency for PNG/SVG logos
      const compressedUrl = await compressImage(file, 400, 400, 0.9, true);
      setFormData(prev => ({
        ...prev,
        logoUrl: compressedUrl
      }));
    } catch (err) {
      console.error('Failed to compress partner logo:', err);
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Partner (Create or Update)
  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    let updatedList: PartnerItem[];
    if (editingPartner) {
      updatedList = partners.map(p => 
        p.id === editingPartner.id ? { ...(p as PartnerItem), ...(formData as PartnerItem) } : p
      );
    } else {
      const newPartner: PartnerItem = {
        id: formData.id || `partner-${Date.now()}`,
        name: formData.name || '',
        nameEn: formData.nameEn || formData.name || '',
        letter: formData.letter || formData.name?.slice(0, 1) || 'ش',
        category: formData.category || (isArabic ? 'شريك معتمد' : 'Verified Partner'),
        categoryEn: formData.categoryEn || 'Verified Partner',
        badge: formData.badge || (isArabic ? 'شريك معتمد' : 'Verified'),
        badgeEn: formData.badgeEn || 'Verified',
        logoUrl: formData.logoUrl || '',
        websiteUrl: formData.websiteUrl || '',
        accentColor: formData.accentColor || '#0D6D54',
        isActive: formData.isActive ?? true
      };
      updatedList = [newPartner, ...partners];
    }

    setPartners(updatedList);
    saveStoredPartners(updatedList);
    setIsModalOpen(false);
    triggerSuccessFeedback();
  };

  // Delete Partner
  const handleDeletePartner = (id: string) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الشريك من السلايدر؟' : 'Are you sure you want to delete this partner?')) {
      return;
    }
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    saveStoredPartners(updated);
    triggerSuccessFeedback();
  };

  // Toggle Partner active status
  const handleToggleActive = (id: string) => {
    const updated = partners.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    setPartners(updated);
    saveStoredPartners(updated);
    triggerSuccessFeedback();
  };

  // Move Partner Up/Down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const listCopy = [...partners];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setPartners(listCopy);
    saveStoredPartners(listCopy);
  };

  // Save Settings
  const handleSaveSettings = () => {
    saveStoredPartnersSettings(settings);
    triggerSuccessFeedback();
  };

  // Restore Default Partners
  const handleRestoreDefaults = () => {
    if (!window.confirm(isArabic ? 'هل تريد استعادة قائمة الشركاء والإعدادات الافتراضية؟' : 'Restore default partners and settings?')) {
      return;
    }
    setPartners(DEFAULT_PARTNERS);
    saveStoredPartners(DEFAULT_PARTNERS);
    setSettings(DEFAULT_PARTNERS_SETTINGS);
    saveStoredPartnersSettings(DEFAULT_PARTNERS_SETTINGS);
    triggerSuccessFeedback();
  };

  const triggerSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[#0D6D54] dark:text-[#2DD4BF] flex items-center justify-center shrink-0 shadow-xs">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'إدارة شركاء النجاح والرعايات' : 'Partners & Alliances Management'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                {partners.length} {isArabic ? 'شريك' : 'Partners'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isArabic 
                ? 'رفع وتخصيص شعارات الجهات المعتمدة، الشركاء الحكوميين والتأمينيين، والتحكم الكامل في ظهورهم بالسلايدر.' 
                : 'Upload partner logos, manage corporate alliances, and customize display behavior.'}
            </p>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#0D6D54] hover:bg-[#0b5c47] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة شريك جديد' : 'Add New Partner'}</span>
          </button>
        </div>
      </div>

      {/* Floating Save Feedback */}
      {saveSuccess && (
        <div className="fixed bottom-6 end-6 z-50 flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{isArabic ? 'تم حفظ التعديلات وتحديث السلايدر بنجاح!' : 'Changes saved & slider updated successfully!'}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION CONTENT & CONFIGURATION */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'إعدادات نصوص السلايدر وطريقة العرض' : 'Slider Display & Section Texts'}
            </h3>
          </div>
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0D6D54] hover:bg-[#09523f] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isArabic ? 'حفظ الإعدادات' : 'Save Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Title Arabic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'عنوان القسم الرئيسي (بالعربي)' : 'Section Title (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.sectionTitleAr}
              onChange={(e) => setSettings({ ...settings, sectionTitleAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Section Title English */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'عنوان القسم الرئيسي (بالإنجليزي)' : 'Section Title (English)'}
            </label>
            <input
              type="text"
              value={settings.sectionTitleEn}
              onChange={(e) => setSettings({ ...settings, sectionTitleEn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Subtitle Arabic */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'النص التعريفي للقسم (بالعربي)' : 'Section Subtitle (Arabic)'}
            </label>
            <textarea
              rows={2}
              value={settings.sectionSubtitleAr}
              onChange={(e) => setSettings({ ...settings, sectionSubtitleAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Display Mode Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'طريقة عرض البطاقات في السلايدر:' : 'Display Mode:'}
            </label>
            <select
              value={settings.displayMode}
              onChange={(e) => setSettings({ ...settings, displayMode: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="auto">{isArabic ? 'تلقائي (عرض الشعار المرفوع إن وُجد، وإلا الرمز الدائري)' : 'Auto (Logo if available, else Monogram)'}</option>
              <option value="logo">{isArabic ? 'شعارات وصور فقط (Logo Mode)' : 'Logos Only'}</option>
              <option value="monogram">{isArabic ? 'أقراص دائرية بحروف مونوغرام (Monogram Mode)' : 'Monogram Emblem Mode'}</option>
            </select>
          </div>

          {/* Speed Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isArabic ? 'سرعة حركة السلايدر المستمرة:' : 'Slider Speed:'}
            </label>
            <select
              value={settings.speedSeconds}
              onChange={(e) => setSettings({ ...settings, speedSeconds: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value={55}>{isArabic ? 'هادئ جدًا ومريح (55 ثانية)' : 'Very Slow (55s)'}</option>
              <option value={40}>{isArabic ? 'افتراضي متناسق (40 ثانية)' : 'Standard (40s)'}</option>
              <option value={26}>{isArabic ? 'سريع نسبيًا (26 ثانية)' : 'Fast (26s)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PARTNERS LIST TABLE / CARDS */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0D6D54] dark:text-[#2DD4BF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'قائمة الشركاء والرعايات الحالية' : 'Current Partners List'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isArabic ? 'يمكنك إعادة ترتيب الشركاء باستخدام الأسهم ⇅' : 'Reorder using arrows ⇅'}
          </span>
        </div>

        <div className="space-y-3">
          {partners.map((partner, index) => {
            return (
              <div
                key={partner.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  partner.isActive !== false
                    ? 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-700/60'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-white/5 opacity-60'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  
                  {/* Logo or Monogram Thumbnail Preview */}
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/95 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                    <PartnerLogoRenderer partnerId={partner.id} logoUrl={partner.logoUrl} name={partner.name} />
                  </div>

                  {/* Name and Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {partner.name}
                      </h4>
                      {partner.badge && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: `${partner.accentColor || '#0D6D54'}15`,
                            color: partner.accentColor || '#0D6D54',
                          }}
                        >
                          {partner.badge}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {partner.category} {partner.nameEn ? `• ${partner.nameEn}` : ''}
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Move, Toggle, Edit, Delete) */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  
                  {/* Move Up */}
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isArabic ? 'تحريك لأعلى' : 'Move Up'}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === partners.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title={isArabic ? 'تحريك لأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(partner.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      partner.isActive !== false
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={partner.isActive !== false ? (isArabic ? 'إخفاء من السلايدر' : 'Hide') : (isArabic ? 'إظهار بالسلايدر' : 'Show')}
                  >
                    {partner.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEditModal(partner)}
                    className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    title={isArabic ? 'تعديل الشريك' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeletePartner(partner.id)}
                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title={isArabic ? 'حذف الشريك' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PARTNER MODAL WITH LOGO UPLOAD */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <Handshake className="w-5 h-5 text-[#0D6D54] dark:text-[#2DD4BF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingPartner 
                    ? (isArabic ? 'تعديل بيانات وشعار الشريك' : 'Edit Partner Details') 
                    : (isArabic ? 'إضافة شريك جديد للسلايدر' : 'Add New Partner')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePartner} className="p-6 space-y-4">
              
              {/* LOGO UPLOAD SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {isArabic ? 'شعار الشريك (رفع صورة أو رابط مباشر):' : 'Partner Logo (Upload or Direct URL):'}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  
                  {/* Logo Preview Squircle */}
                  <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center justify-center p-2 relative shrink-0 overflow-hidden shadow-inner group">
                    {formData.logoUrl ? (
                      <>
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo Preview" 
                          className="max-h-full max-w-full object-contain filter contrast-105" 
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                          className="absolute inset-0 bg-black/60 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          {isArabic ? 'إزالة الشعار' : 'Remove'}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" />
                        <span className="text-[10px] text-slate-400">{isArabic ? 'بدون شعار' : 'No Logo'}</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#0D6D54] hover:bg-[#09523f] disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? (isArabic ? 'جارٍ المعالجة...' : 'Uploading...') : (isArabic ? 'رفع صورة الشعار من جهازك' : 'Upload Logo File')}</span>
                      </button>

                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          {isArabic ? 'حذف الشعار' : 'Clear Logo'}
                        </button>
                      )}
                    </div>

                    {/* Direct URL Input */}
                    <div>
                      <input
                        type="url"
                        placeholder={isArabic ? 'أو الصق رابط صورة الشعار هنا (https://...)' : 'Or paste direct logo URL here...'}
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isArabic ? 'يدعم PNG و SVG و WebP بخلفية شفافة لظهور فاخر داخل السلايدر.' : 'Supports transparent PNG, SVG and WebP for optimal presentation.'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Partner Name (Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم الشريك (بالعربي) *' : 'Partner Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'مثال: وزارة الصحة' : 'e.g. Ministry of Health'}
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم الشريك (بالإنجليزي)' : 'Partner Name (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Health"
                    value={formData.nameEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Monogram Letter & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'حرف المونوغرام (رمز دائري)' : 'Monogram Letter'}
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder={isArabic ? 'مثال: ص' : 'e.g. M'}
                    value={formData.letter || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, letter: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-center font-bold text-amber-500 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'التصنيف / نوع الشراكة' : 'Category / Role'}
                  </label>
                  <input
                    type="text"
                    placeholder={isArabic ? 'مثال: ترخيص طبي وإشراف صحي' : 'e.g. Medical Licensing'}
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Badge Text & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'شارة التميز (Pill Badge)' : 'Badge Label'}
                  </label>
                  <input
                    type="text"
                    placeholder={isArabic ? 'مثال: ترخيص معتمد' : 'e.g. Verified Provider'}
                    value={formData.badge || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'لون التمييز (Accent Color)' : 'Accent Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#0D6D54'}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#0D6D54'}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'تفعيل وإظهار الشريك في السلايدر' : 'Active & Visible in Slider'}
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0D6D54] hover:bg-[#0b5c47] shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPartner ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') : (isArabic ? 'إضافة الشريك' : 'Add Partner')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default PartnersSettingsTab;
