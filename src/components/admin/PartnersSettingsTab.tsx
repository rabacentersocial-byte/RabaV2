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
  Layers,
  Sun,
  Moon,
  Camera,
  Palette,
  Sliders,
  CheckCheck
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

// Pre-installed official partner logos for quick 1-click selection
const OFFICIAL_LOGO_PRESETS = [
  { name: 'وزارة الداخلية', nameEn: 'Ministry of Interior', url: '/images/partners/partner-moi_custom.png', color: '#006C35' },
  { name: 'رئاسة أمن الدولة', nameEn: 'Presidency of State Security', url: '/images/partners/partner-state-security_custom.png', color: '#16A34A' },
  { name: 'وزارة الحرس الوطني', nameEn: 'Ministry of National Guard', url: '/images/partners/partner-national-guard_custom.png', color: '#15803D' },
  { name: 'الشؤون الصحية بالحرس الوطني', nameEn: 'MNGHA Health Affairs', url: '/images/partners/partner-mngha_custom.png', color: '#DC2626' },
  { name: 'وزارة البيئة والمياه والزراعة', nameEn: 'MEWA', url: '/images/partners/partner-mewa_custom.png', color: '#059669' },
  { name: 'وزارة الاستثمار', nameEn: 'Ministry of Investment (MISA)', url: '/images/partners/partner-misa_custom.png', color: '#0D6D54' },
  { name: 'جامعة الملك سعود', nameEn: 'King Saud University (KSU)', url: '/images/partners/partner-ksu_custom.png', color: '#1D4ED8' },
  { name: 'هيئة تطوير بوابة الدرعية', nameEn: 'DGDA', url: '/images/partners/partner-dgda_custom.png', color: '#10B981' },
  { name: 'شركة الدرعية', nameEn: 'Diriyah Company', url: '/images/partners/partner-diriyah_custom.png', color: '#92400E' },
  { name: 'مجموعة السيف مهندسون ومقاولون', nameEn: 'El Seif Group', url: '/images/partners/partner-el-seif_custom.png', color: '#C8102E' },
  { name: 'stc - شركة الاتصالات السعودية', nameEn: 'stc Telecom', url: '/images/partners/partner-stc_custom.png', color: '#4F008C' },
  { name: 'تمارا', nameEn: 'Tamara Financial', url: '/images/partners/partner-tamara_custom.png', color: '#F97316' },
  { name: 'جمعية أسر التوحد', nameEn: 'Autism Families Association', url: '/images/partners/autism_families.svg', color: '#0F4C81' },
  { name: 'مختبرات دلتا الطبية', nameEn: 'Delta Medical Labs', url: '/images/partners/partner-delta_custom.png', color: '#1E3A8A' },
  { name: 'شركة إمكان للتمويل', nameEn: 'Emkan Finance', url: '/images/partners/partner-emkan_custom.png', color: '#2DD4BF' },
  { name: 'مدارس الفيصلية الأهلية - جدة', nameEn: 'Al-Faisaliya Private Schools - Jeddah', url: '/images/partners/partner-faisaliah_custom.png', color: '#0B2341' },
  { name: 'برنامج اعتزاز', nameEn: 'Itizaz Program', url: '/images/partners/partner-itizaz_custom.png', color: '#203A30' },
  { name: 'شركة رؤية للتمكين', nameEn: 'Roaya Company', url: '/images/partners/roaya_company.svg', color: '#C59B27' },
  { name: 'هيئة الإذاعة والتلفزيون', nameEn: 'Saudi Broadcasting Authority (SBA)', url: '/images/partners/partner-sba_custom.png', color: '#0284C7' },
  { name: 'مركز شخصيتي للتقييم والتأهيل', nameEn: 'My Character Center', url: '/images/partners/partner-my-character_custom.png', color: '#0284C7' },
  { name: 'مدارس رياض المعارف الدولية (RAIS)', nameEn: 'Riyadh Al Maarif International Schools (RAIS)', url: '/images/partners/partner-rais_custom.png', color: '#004098' }
];

const ACCENT_COLOR_PRESETS = [
  { name: 'زمردي راقي', hex: '#0D6D54' },
  { name: 'أزرق سماوي', hex: '#0284C7' },
  { name: 'أزرق ملكي', hex: '#2563EB' },
  { name: 'بنفسجي stc', hex: '#4F008C' },
  { name: 'أخضر وطني', hex: '#16A34A' },
  { name: 'ذهبي أصيل', hex: '#D97706' },
  { name: 'برتقالي تمارا', hex: '#EA580C' },
  { name: 'كحلي داكن', hex: '#1E293B' }
];

export const PartnersSettingsTab: React.FC<PartnersSettingsTabProps> = () => {
  const { isArabic } = useLanguage();

  const [partners, setPartners] = useState<PartnerItem[]>(() => getStoredPartners());
  const [settings, setSettings] = useState<PartnersSliderSettings>(() => getStoredPartnersSettings());
  
  // Feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
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
    cardCoverUrl: '',
    imageFit: 'contain',
    imagePadding: 'md',
    logoScale: 100,
    canvasHeight: 'md',
    expandImageToEdges: false,
    imageBgColor: '#ffffff',
    cardStyle: 'standard',
    websiteUrl: '',
    accentColor: '#0D6D54',
    sector: 'government',
    description: '',
    descriptionEn: '',
    isActive: true
  });

  // Preview Mode inside modal (Light vs Dark mode toggle for live card inspection)
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // File Inputs
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const quickRowFileInputRef = useRef<HTMLInputElement>(null);
  const [quickUploadPartnerId, setQuickUploadPartnerId] = useState<string | null>(null);

  const triggerSuccessFeedback = (msg?: string) => {
    setFeedbackMessage(msg || (isArabic ? 'تم حفظ التعديلات وتحديث السلايدر بنجاح!' : 'Changes saved & slider updated!'));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2600);
  };

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
      cardCoverUrl: '',
      imageFit: 'contain',
      imagePadding: 'md',
      logoScale: 100,
      canvasHeight: 'md',
      expandImageToEdges: false,
      imageBgColor: '#ffffff',
      cardStyle: 'standard',
      websiteUrl: '',
      accentColor: '#0D6D54',
      sector: 'government',
      description: isArabic ? 'شراكة وتعاون مؤسسي لخدمة وتأهيل ورعاية أبناء ومنسوبي القطاع.' : 'Institutional collaboration serving and supporting beneficiaries and staff.',
      descriptionEn: 'Institutional collaboration serving and supporting beneficiaries and staff.',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PartnerItem) => {
    setEditingPartner(item);
    setFormData({
      ...item,
      imageFit: item.imageFit || 'contain',
      imagePadding: item.imagePadding || 'md',
      logoScale: typeof item.logoScale === 'number' ? item.logoScale : 100,
      canvasHeight: item.canvasHeight || 'md',
      expandImageToEdges: item.expandImageToEdges ?? false,
      imageBgColor: item.imageBgColor || '#ffffff',
      cardStyle: item.cardStyle || 'standard',
      cardCoverUrl: item.cardCoverUrl || '',
      accentColor: item.accentColor || '#0D6D54'
    });
    setIsModalOpen(true);
  };

  // Upload image to server disk via /api/sync/upload
  const uploadImageToServer = async (file: File, fallbackData: string): Promise<string> => {
    try {
      const res = await fetch('/api/sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileData: fallbackData
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.url) return json.url;
      }
    } catch (err) {
      console.warn('Server upload notice, falling back:', err);
    }
    return fallbackData;
  };

  // Main Logo Image Upload handler
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Automatically compress and preserve transparency for PNG/SVG logos & upload to server disk
      const compressedUrl = await compressImage(file, 450, 450, 0.92, true);
      const finalUrl = await uploadImageToServer(file, compressedUrl);
      setFormData(prev => ({
        ...prev,
        logoUrl: finalUrl
      }));
    } catch (err) {
      console.error('Failed to compress partner logo:', err);
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const finalUrl = await uploadImageToServer(file, dataUrl);
        setFormData(prev => ({ ...prev, logoUrl: finalUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  // Cover Image / Header Banner Upload handler
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file, 800, 300, 0.85, false);
      const finalUrl = await uploadImageToServer(file, compressedUrl);
      setFormData(prev => ({
        ...prev,
        cardCoverUrl: finalUrl
      }));
    } catch (err) {
      console.error('Failed to compress cover image:', err);
    } finally {
      setIsUploading(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // Quick 1-Click Image Replacement from Table Row
  const handleTriggerQuickUpload = (partnerId: string) => {
    setQuickUploadPartnerId(partnerId);
    quickRowFileInputRef.current?.click();
  };

  const handleQuickRowFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickUploadPartnerId) return;

    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file, 450, 450, 0.92, true);
      const finalUrl = await uploadImageToServer(file, compressedUrl);
      const updated = partners.map(p => 
        p.id === quickUploadPartnerId ? { ...p, logoUrl: finalUrl } : p
      );
      setPartners(updated);
      saveStoredPartners(updated);
      triggerSuccessFeedback(isArabic ? 'تم حفظ صورة الشعار على الخادم وتطبيقها في السلايدر بنجاح!' : 'Partner logo saved to server and updated in slider!');
    } catch (err) {
      console.error('Quick upload failed:', err);
    } finally {
      setIsUploading(false);
      setQuickUploadPartnerId(null);
      if (quickRowFileInputRef.current) quickRowFileInputRef.current.value = '';
    }
  };

  // Save Partner (Create or Update)
  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    let cleanWebsiteUrl = (formData.websiteUrl || '').trim();
    if (cleanWebsiteUrl && !cleanWebsiteUrl.startsWith('http://') && !cleanWebsiteUrl.startsWith('https://') && !cleanWebsiteUrl.startsWith('/') && !cleanWebsiteUrl.startsWith('mailto:') && !cleanWebsiteUrl.startsWith('tel:')) {
      cleanWebsiteUrl = `https://${cleanWebsiteUrl}`;
    }

    let updatedList: PartnerItem[];
    if (editingPartner) {
      updatedList = partners.map(p => 
        p.id === editingPartner.id ? { 
          ...(p as PartnerItem), 
          ...(formData as PartnerItem),
          logoScale: typeof formData.logoScale === 'number' ? formData.logoScale : 100,
          canvasHeight: formData.canvasHeight || 'md',
          expandImageToEdges: formData.expandImageToEdges ?? false,
          cardCoverUrl: formData.cardCoverUrl || '',
          imageFit: formData.imageFit || 'contain',
          imagePadding: formData.imagePadding || 'md',
          imageBgColor: formData.imageBgColor || '#ffffff',
          cardStyle: formData.cardStyle || 'standard',
          websiteUrl: cleanWebsiteUrl
        } : p
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
        logoScale: typeof formData.logoScale === 'number' ? formData.logoScale : 100,
        canvasHeight: formData.canvasHeight || 'md',
        expandImageToEdges: formData.expandImageToEdges ?? false,
        cardCoverUrl: formData.cardCoverUrl || '',
        imageFit: formData.imageFit || 'contain',
        imagePadding: formData.imagePadding || 'md',
        imageBgColor: formData.imageBgColor || '#ffffff',
        cardStyle: formData.cardStyle || 'standard',
        websiteUrl: cleanWebsiteUrl,
        accentColor: formData.accentColor || '#0D6D54',
        sector: formData.sector || 'government',
        description: formData.description || '',
        descriptionEn: formData.descriptionEn || '',
        isActive: formData.isActive ?? true
      };
      updatedList = [newPartner, ...partners];
    }

    setPartners(updatedList);
    saveStoredPartners(updatedList);
    setIsModalOpen(false);
    triggerSuccessFeedback(isArabic ? 'تم حفظ وتخصيص بطاقة الشريك بنجاح!' : 'Partner card customized successfully!');
  };

  // Delete Partner
  const handleDeletePartner = (id: string) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الشريك من السلايدر؟' : 'Are you sure you want to delete this partner?')) {
      return;
    }
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    saveStoredPartners(updated);
    triggerSuccessFeedback(isArabic ? 'تم حذف الشريك بنجاح.' : 'Partner removed.');
  };

  // Toggle Partner active status
  const handleToggleActive = (id: string) => {
    const updated = partners.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    setPartners(updated);
    saveStoredPartners(updated);
    triggerSuccessFeedback(isArabic ? 'تم تحديث حالة الظهور.' : 'Visibility updated.');
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
    triggerSuccessFeedback(isArabic ? 'تم حفظ إعدادات السلايدر بنجاح!' : 'Slider settings saved!');
  };

  // Restore Default Partners
  const handleRestoreDefaults = () => {
    if (!window.confirm(isArabic ? 'هل تريد استعادة قائمة الشركاء والإعدادات الافتراضية الرسمية (21 شريكاً معتمداً)؟' : 'Restore official default partners (21 partners)?')) {
      return;
    }
    setPartners(DEFAULT_PARTNERS);
    saveStoredPartners(DEFAULT_PARTNERS);
    setSettings(DEFAULT_PARTNERS_SETTINGS);
    saveStoredPartnersSettings(DEFAULT_PARTNERS_SETTINGS);
    triggerSuccessFeedback(isArabic ? 'تمت استعادة القائمة الافتراضية بنجاح!' : 'Defaults restored!');
  };

  return (
    <div className="space-y-8" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Hidden Quick File Input for instant 1-click table upload */}
      <input
        ref={quickRowFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleQuickRowFileChange}
        className="hidden"
      />

      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[#0D6D54] dark:text-[#2DD4BF] flex items-center justify-center shrink-0 shadow-xs">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'إدارة وتخصيص بطاقات الشركاء' : 'Partners & Alliances Management'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                {partners.length} {isArabic ? 'شريك' : 'Partners'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isArabic 
                ? 'تخصيص صور وشعارات بطاقات الشركاء، أبعاد ومحاذاة الشعار، ألوان التمييز، وخلفيات البطاقات مع معاينة حية فورية.' 
                : 'Upload partner logos, customize card visual layout, borders, background canvas, and see real-time live preview.'}
            </p>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
          <span>{feedbackMessage}</span>
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
      {/* PARTNERS LIST TABLE / CARDS WITH DIRECT IMAGE CUSTOMIZATION */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0D6D54] dark:text-[#2DD4BF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'قائمة الشركاء والرعايات وبطاقاتهم' : 'Current Partners List'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isArabic ? 'انقر على أيقونة الكاميرا لتغيير صورة الشعار فوراً، أو "تعديل" لتخصيص البطاقة بالكامل.' : 'Click camera icon for instant logo change, or "Edit" to customize full card.'}
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
                  
                  {/* Logo Thumbnail with Quick Upload Overlay */}
                  <div 
                    onClick={() => handleTriggerQuickUpload(partner.id)}
                    title={isArabic ? 'انقر لتغيير صورة الشعار مباشرة من جهازك' : 'Click to quickly change logo image'}
                    className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden relative group cursor-pointer"
                    style={{ backgroundColor: partner.imageBgColor || '#ffffff' }}
                  >
                    <PartnerLogoRenderer 
                      partnerId={partner.id} 
                      logoUrl={partner.logoUrl} 
                      name={partner.name}
                      accentColor={partner.accentColor}
                      letter={partner.letter}
                      imageFit={partner.imageFit}
                      imagePadding={partner.imagePadding}
                      logoScale={partner.logoScale}
                      expandImageToEdges={partner.expandImageToEdges}
                    />
                    
                    {/* Hover camera overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>{isArabic ? 'تغيير' : 'Edit'}</span>
                    </div>
                  </div>

                  {/* Name and Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {partner.cardCoverUrl && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                          {isArabic ? 'غلاف مخصص' : 'Custom Banner'}
                        </span>
                      )}
                      {partner.logoScale && partner.logoScale !== 100 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-mono">
                          {partner.logoScale}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {partner.category} {partner.nameEn ? `• ${partner.nameEn}` : ''}
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Quick Image Upload, Move, Toggle, Edit, Delete) */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  
                  {/* Quick Photo Upload Button */}
                  <button
                    onClick={() => handleTriggerQuickUpload(partner.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    title={isArabic ? 'رفع وتغيير صورة الشعار فوراً' : 'Quick replace logo image'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{isArabic ? 'تغيير الصورة' : 'Photo'}</span>
                  </button>

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

                  {/* Edit Full Card */}
                  <button
                    onClick={() => handleOpenEditModal(partner)}
                    className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    title={isArabic ? 'تخصيص البطاقة بالكامل' : 'Full Card Customization'}
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
      {/* COMPREHENSIVE CARD & IMAGE CUSTOMIZATION MODAL WITH LIVE PREVIEW          */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0D6D54] dark:text-[#2DD4BF] flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/40">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingPartner 
                      ? (isArabic ? 'تخصيص صورة وبطاقة الشريك' : 'Customize Partner Card & Image') 
                      : (isArabic ? 'إضافة وتخصيص شريك جديد' : 'Add & Customize Partner')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'تحكم في الصورة، الأبعاد، ألوان الإطار، والشارة مع معاينة حية فورية.' : 'Customize image, dimensions, canvas background, and live card preview.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2-Column on Desktop (Form on one side, Live Card Preview on the other) */}
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              
              {/* ================================================================= */}
              {/* COLUMN 1: FORM CONTROLS (Lg: cols 7)                              */}
              {/* ================================================================= */}
              <form onSubmit={handleSavePartner} noValidate id="partner-customize-form" className="lg:col-span-7 space-y-5">
                
                {/* 1. MAIN LOGO IMAGE CUSTOMIZATION */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0D6D54] dark:text-[#2DD4BF]" />
                      <span>{isArabic ? 'صورة وشعار الشريك الرئيسية:' : 'Primary Partner Logo / Image:'}</span>
                    </label>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {isArabic ? 'مسح الشعار' : 'Clear'}
                      </button>
                    )}
                  </div>

                  {/* Upload Button & Direct Text / URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[#0D6D54] hover:bg-[#09523f] disabled:opacity-50 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? (isArabic ? 'جارٍ الرفع والمعالجة...' : 'Uploading...') : (isArabic ? 'رفع صورة من جهازك' : 'Upload From Device')}</span>
                    </button>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder={isArabic ? 'أو ألصق رابط الصورة هنا (https://... أو /uploads/...)' : 'Or paste image URL...'}
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      {isArabic ? 'أو اختر من مكتبة الشعارات الرسمية الجاهزة (21 جهة):' : 'Or select from official pre-installed logos:'}
                    </label>
                    <select
                      onChange={(e) => {
                        const found = OFFICIAL_LOGO_PRESETS.find(p => p.url === e.target.value);
                        if (found) {
                          setFormData(prev => ({
                            ...prev,
                            name: prev.name || found.name,
                            nameEn: prev.nameEn || found.nameEn,
                            logoUrl: found.url,
                            accentColor: found.color
                          }));
                        }
                      }}
                      defaultValue=""
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="" disabled>{isArabic ? '-- اختر شعاراً رسمياً جاهزاً بضغطة زر --' : '-- Choose official partner logo --'}</option>
                      {OFFICIAL_LOGO_PRESETS.map((preset) => (
                        <option key={preset.url} value={preset.url}>
                          {preset.name} ({preset.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* LOGO ZOOM & EXPANSION SCALE (تكبير وتوسيع الشعار داخل البطاقة) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-500/20 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{isArabic ? 'تكبير وتوسيع الشعار داخل البطاقة (Scale):' : 'Logo Scale & Zoom in Card:'}</span>
                      </label>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono">
                        {formData.logoScale || 100}%
                      </span>
                    </div>

                    {/* Range Slider */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-bold">70%</span>
                      <input
                        type="range"
                        min="70"
                        max="220"
                        step="5"
                        value={formData.logoScale || 100}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoScale: parseInt(e.target.value, 10) }))}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">220%</span>
                    </div>

                    {/* Quick Scale Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 ms-1 font-bold">
                        {isArabic ? 'خيارات سريعة:' : 'Quick Presets:'}
                      </span>
                      {[
                        { label: isArabic ? '100% طبيعي' : '100% Normal', val: 100 },
                        { label: isArabic ? '125% متناسق' : '125% Medium', val: 125 },
                        { label: isArabic ? '150% كبير' : '150% Large', val: 150 },
                        { label: isArabic ? '180% موسع' : '180% Wide', val: 180 },
                        { label: isArabic ? '200% ضخم' : '200% Maximum', val: 200 }
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logoScale: preset.val }))}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            (formData.logoScale || 100) === preset.val
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CANVAS BOX HEIGHT & BORDERLESS EXPANSION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    
                    {/* Canvas Height / Expansion */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'ارتفاع وتوسيع إطار الشعار في البطاقة:' : 'Logo Canvas Height in Card:'}
                      </label>
                      <select
                        value={formData.canvasHeight || 'md'}
                        onChange={(e) => setFormData(prev => ({ ...prev, canvasHeight: e.target.value as any }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="sm">{isArabic ? 'ارتفاع مدمج (Compact - 70px)' : 'Compact (70px)'}</option>
                        <option value="md">{isArabic ? 'ارتفاع قياسي (Standard - 96px)' : 'Standard (96px)'}</option>
                        <option value="lg">{isArabic ? 'ارتفاع كبير مريح (Large - 112px)' : 'Large (112px)'}</option>
                        <option value="xl">{isArabic ? 'ارتفاع ضخم وعريض (X-Large - 128px)' : 'X-Large (128px)'}</option>
                        <option value="full">{isArabic ? 'ملء كامل لمساحة البطاقة (Hero Fill - 144px)' : 'Hero Full Fill (144px)'}</option>
                      </select>
                    </div>

                    {/* Expand Image to Edges (Borderless) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'حدود الإطار (Borders):' : 'Borders & Edge Expansion:'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, expandImageToEdges: !prev.expandImageToEdges }))}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          formData.expandImageToEdges
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{isArabic ? 'توسيع إلى حواف البطاقة بدون حدود' : 'Expand edge-to-edge (Borderless)'}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${formData.expandImageToEdges ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                          {formData.expandImageToEdges ? (isArabic ? 'مفعّل' : 'ON') : (isArabic ? 'معطل' : 'OFF')}
                        </span>
                      </button>
                    </div>

                  </div>

                  {/* Image Fit & Padding Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-white/5">
                    
                    {/* Image Fit */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'طريقة احتواء الصورة (Fit):' : 'Image Fit:'}
                      </label>
                      <select
                        value={formData.imageFit || 'contain'}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageFit: e.target.value as any }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="contain">{isArabic ? 'احتواء كامل (Contain) - للشعارات' : 'Contain (Recommended for logos)'}</option>
                        <option value="cover">{isArabic ? 'ملء الإطار (Cover) - للصور والبطاقات' : 'Cover (Fill canvas)'}</option>
                        <option value="fill">{isArabic ? 'تمديد كامل (Stretch Fill)' : 'Stretch Fill'}</option>
                      </select>
                    </div>

                    {/* Image Padding */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'هوامش إطار الشعار (Padding):' : 'Logo Padding:'}
                      </label>
                      <select
                        value={formData.imagePadding || 'md'}
                        disabled={formData.expandImageToEdges}
                        onChange={(e) => setFormData(prev => ({ ...prev, imagePadding: e.target.value as any }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none disabled:opacity-50"
                      >
                        <option value="none">{isArabic ? 'بدون هوامش (0px)' : 'None (0px)'}</option>
                        <option value="xs">{isArabic ? 'فائقة الصغر (2px)' : 'Extra Small (2px)'}</option>
                        <option value="sm">{isArabic ? 'هوامش مدمجة (4px)' : 'Compact (4px)'}</option>
                        <option value="md">{isArabic ? 'افتراضي متناسق (8px)' : 'Standard (8px)'}</option>
                        <option value="lg">{isArabic ? 'هوامش واسعة (14px)' : 'Spacious (14px)'}</option>
                      </select>
                    </div>

                  </div>

                  {/* Logo Canvas Background Color */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'لون خلفية إطار الشعار (Canvas Background):' : 'Canvas Box Background:'}
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { label: isArabic ? 'أبيض ناصع' : 'Pure White', value: '#ffffff' },
                        { label: isArabic ? 'شفاف' : 'Transparent', value: 'transparent' },
                        { label: isArabic ? 'رمادي ناعم' : 'Soft Slate', value: '#f8fafc' },
                        { label: isArabic ? 'داكن فخم' : 'Dark Navy', value: '#0f172a' }
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageBgColor: item.value }))}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            formData.imageBgColor === item.value
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
                              : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                      <div className="flex items-center gap-1.5 ms-auto">
                        <input
                          type="color"
                          value={formData.imageBgColor && formData.imageBgColor.startsWith('#') ? formData.imageBgColor : '#ffffff'}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageBgColor: e.target.value }))}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer overflow-hidden p-0"
                          title={isArabic ? 'تخصيص لون حر' : 'Custom Color'}
                        />
                        <span className="text-[10px] text-slate-400 font-mono">{formData.imageBgColor || '#ffffff'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. OPTIONAL CARD TOP COVER BANNER */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span>{isArabic ? 'صورة غلاف علوية للبطاقة (اختياري - Banner):' : 'Card Top Banner Image (Optional):'}</span>
                    </label>
                    {formData.cardCoverUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, cardCoverUrl: '' }))}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {isArabic ? 'إزالة الغلاف' : 'Clear'}
                      </button>
                    )}
                  </div>

                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => coverFileInputRef.current?.click()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'رفع صورة غلاف' : 'Upload Banner'}</span>
                    </button>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder={isArabic ? 'أو رابط صورة الغلاف (https://... أو /uploads/...)' : 'Or banner URL...'}
                        value={formData.cardCoverUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardCoverUrl: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PARTNER NAMES (ARABIC & ENGLISH) */}
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 4. CATEGORY & SECTOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'التصنيف / نوع الشراكة' : 'Category / Role'}
                    </label>
                    <input
                      type="text"
                      placeholder={isArabic ? 'مثال: القطاع الحكومي والوطني' : 'e.g. Healthcare Sector'}
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'قطاع الشراكة الرئيسي:' : 'Sector Tab:'}
                    </label>
                    <select
                      value={formData.sector || 'government'}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value as any }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="government">{isArabic ? 'حكومي ورسمي (Government)' : 'Government'}</option>
                      <option value="health">{isArabic ? 'رعاية صحية وتأهيل (Healthcare)' : 'Healthcare'}</option>
                      <option value="academic">{isArabic ? 'أكاديمي وتعليمي (Academic)' : 'Academic'}</option>
                      <option value="corporate">{isArabic ? 'شركات وتمكين (Corporate)' : 'Corporate'}</option>
                    </select>
                  </div>
                </div>

                {/* 5. BADGE LABEL & ACCENT COLOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'شارة التميز بالبطاقة (Badge):' : 'Badge Label:'}
                    </label>
                    <input
                      type="text"
                      placeholder={isArabic ? 'مثال: شريك معتمد' : 'e.g. Verified Partner'}
                      value={formData.badge || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'لون التمييز (Accent Color):' : 'Accent Color:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor || '#0D6D54'}
                        onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={formData.accentColor || '#0D6D54'}
                        onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Accent Color Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">{isArabic ? 'ألوان سريعة:' : 'Quick Palettes:'}</span>
                  {ACCENT_COLOR_PRESETS.map((colorItem) => (
                    <button
                      key={colorItem.hex}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, accentColor: colorItem.hex }))}
                      className="w-5 h-5 rounded-full border border-white dark:border-slate-800 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: colorItem.hex }}
                      title={colorItem.name}
                    />
                  ))}
                </div>

                {/* 6. WEBSITE URL & ACTIVE TOGGLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'رابط الموقع الرسمي (اختياري)' : 'Website URL (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={isArabic ? 'https://... أو raba.sa' : 'https://... or website.com'}
                      value={formData.websiteUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
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
                </div>

              </form>

              {/* ================================================================= */}
              {/* COLUMN 2: REAL-TIME INTERACTIVE CARD PREVIEW (Lg: cols 5)         */}
              {/* ================================================================= */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 relative">
                
                {/* Preview Header & Theme Switcher */}
                <div className="w-full flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'معاينة حية لشكل البطاقة بالسلايدر' : 'Live Card Preview'}</span>
                  </div>

                  {/* Light/Dark Toggle */}
                  <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-white/10 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('light')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        previewTheme === 'light' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'text-slate-400'
                      }`}
                      title={isArabic ? 'معاينة بالوضع النهاري' : 'Light Preview'}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('dark')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        previewTheme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-2xs' : 'text-slate-400'
                      }`}
                      title={isArabic ? 'معاينة بالوضع الليلي' : 'Dark Preview'}
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* THE ACTUAL LIVE CARD RENDERED EXACTLY AS IN SLIDER */}
                <div className={`p-4 rounded-3xl transition-colors duration-300 ${previewTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  
                  <div
                    className={`group w-[190px] ${
                      formData.canvasHeight === 'xl' || formData.canvasHeight === 'full' 
                        ? 'h-[250px]' 
                        : 'h-[230px]'
                    } rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-lg ${
                      previewTheme === 'dark' 
                        ? 'bg-slate-900 border-white/10 text-white' 
                        : 'bg-white border-slate-200/90 text-slate-900'
                    }`}
                  >
                    {/* Optional Card Top Cover Banner */}
                    {formData.cardCoverUrl && (
                      <div className="absolute top-0 inset-x-0 h-10 overflow-hidden opacity-35">
                        <img src={formData.cardCoverUrl} alt="" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${previewTheme === 'dark' ? 'to-slate-900' : 'to-white'}`} />
                      </div>
                    )}

                    {/* Top Header Row: Centered Badge & Dot */}
                    <div className="flex items-center justify-center w-full relative z-10">
                      <span 
                        className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full truncate max-w-[90%] text-center"
                        style={{
                          backgroundColor: formData.accentColor ? `${formData.accentColor}18` : undefined,
                          color: formData.accentColor || undefined,
                          border: `1px solid ${formData.accentColor ? `${formData.accentColor}30` : 'transparent'}`
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full shrink-0 shadow-xs" 
                          style={{ backgroundColor: formData.accentColor || '#0D6D54' }}
                        />
                        <span className="truncate">{formData.badge || (isArabic ? 'شريك معتمد' : 'Verified')}</span>
                      </span>
                    </div>

                    {/* Clean Framed Canvas for Logo */}
                    <div 
                      className={`w-full ${
                        formData.canvasHeight === 'sm'
                          ? 'h-18'
                          : formData.canvasHeight === 'lg'
                            ? 'h-26'
                            : formData.canvasHeight === 'xl'
                              ? 'h-30'
                              : formData.canvasHeight === 'full'
                                ? 'h-34'
                                : 'h-22'
                      } rounded-xl ${
                        formData.expandImageToEdges 
                          ? 'border-0 p-0 shadow-none' 
                          : 'border border-slate-200/80 dark:border-white/20 shadow-2xs'
                      } flex items-center justify-center overflow-hidden my-auto relative z-10 transition-all`}
                      style={{
                        backgroundColor: formData.imageBgColor || '#ffffff'
                      }}
                    >
                      <PartnerLogoRenderer
                        partnerId={formData.id}
                        logoUrl={formData.logoUrl}
                        name={formData.name || (isArabic ? 'اسم الشريك' : 'Partner Name')}
                        accentColor={formData.accentColor}
                        letter={formData.letter || (formData.name ? formData.name.slice(0, 1) : 'ش')}
                        imageFit={formData.imageFit}
                        imagePadding={formData.imagePadding}
                        logoScale={formData.logoScale}
                        expandImageToEdges={formData.expandImageToEdges}
                      />
                    </div>

                    {/* Partner Name & Subtitle */}
                    <div className="w-full text-center mt-1 relative z-10">
                      <h4 className="text-xs font-black truncate">
                        {isArabic ? (formData.name || 'اسم الشريك') : (formData.nameEn || formData.name || 'Partner Name')}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {isArabic ? (formData.category || 'التصنيف والشراكة') : (formData.categoryEn || 'Partnership Role')}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-4 text-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'هكذا ستظهر البطاقة تماماً للمستخدمين في موقع المركز.' : 'This is exactly how the card appears on the live site.'}
                  </span>
                </div>

              </div>

            </div>

            {/* Modal Footer / Save Actions */}
            <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/40">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'يتم حفظ وتطبيق التعديل مباشرة على السلايدر وقاعدة البيانات.' : 'Changes sync directly with slider & persistent storage.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  form="partner-customize-form"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#0D6D54] hover:bg-[#0b5c47] shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPartner ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') : (isArabic ? 'إضافة الشريك' : 'Add Partner')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PartnersSettingsTab;
