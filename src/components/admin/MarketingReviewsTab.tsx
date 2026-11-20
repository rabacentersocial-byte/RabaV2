import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Plus, 
  Sparkles, 
  Percent, 
  Copy,
  Check,
  Eye,
  EyeOff,
  X,
  Calendar,
  Gift,
  Clock,
  Palette,
  Sliders,
  CopyPlus,
  ShieldCheck
} from 'lucide-react';
import { ParentReview, PermissionId, OfferData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveDataOptional } from '../../context/LiveDataContext';
import {
  syncOffersCollectionToFirestore,
  deleteOfferFromFirestore,
  deleteTestimonialFromFirestore
} from '../../services/firestoreService';
import { getStoredOffers, saveStoredOffers } from '../../data/offersData';
import { OfferCustomizerModal } from './OfferCustomizerModal';

interface MarketingReviewsTabProps {
  reviews: ParentReview[];
  onUpdateReviews: (updated: ParentReview[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
  offers?: OfferData[];
  onUpdateOffers?: (updated: OfferData[]) => void;
  isSystemAdmin?: boolean;
}

export const MarketingReviewsTab: React.FC<MarketingReviewsTabProps> = ({
  reviews,
  onUpdateReviews,
  hasPermission,
  offers: propOffers,
  onUpdateOffers,
  isSystemAdmin = false
}) => {
  const { isArabic } = useLanguage();
  const liveData = useLiveDataOptional();
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'offers'>('reviews');

  const canManageOffers = hasPermission('manage_offers');
  const canManageReviews = hasPermission('manage_reviews');

  // Offers state
  const [offersList, setOffersList] = useState<OfferData[]>(() => {
    return propOffers || getStoredOffers();
  });

  // Customizer modal state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferData | null>(null);

  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isCustomizerOpen) return;
    if (liveData?.isAuthoritativeOffers) {
      setOffersList(liveData.offers);
    } else if (propOffers) {
      setOffersList(propOffers);
    }
  }, [liveData?.offers, liveData?.isAuthoritativeOffers, propOffers, isCustomizerOpen]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const syncOffers = (updated: OfferData[]) => {
    setOffersList(updated);
    saveStoredOffers(updated);
    void syncOffersCollectionToFirestore(updated);
    if (onUpdateOffers) {
      onUpdateOffers(updated);
    }
  };

  // Toggle Review Verified Status
  const handleToggleVerified = (reviewId: string) => {
    if (!canManageReviews) return;
    const updated = reviews.map((r) =>
      r.id === reviewId
        ? { ...r, isVerifiedParent: !r.isVerifiedParent, verifiedBeneficiary: !r.isVerifiedParent }
        : r
    );
    onUpdateReviews(updated);
    showFeedback(isArabic ? 'تم تحديث حالة توثيق ولي الأمر' : 'Review verification updated');
  };

  // Toggle Review Visibility (Active/Inactive on client frontend)
  const handleToggleReviewActive = (reviewId: string) => {
    if (!canManageReviews) return;
    const updated = reviews.map((r) => {
      if (r.id !== reviewId) return r;
      const nextActive = !(r.active !== false && r.isActive !== false);
      return { ...r, active: nextActive, isActive: nextActive };
    });
    onUpdateReviews(updated);
    showFeedback(isArabic ? 'تم تحديث حالة ظهور التقييم في الموقع' : 'Review visibility updated');
  };

  // Delete review (System Admin only)
  const handleDeleteReview = (reviewId: string) => {
    if (!canManageReviews || !isSystemAdmin) return;
    const updated = reviews.filter((r) => r.id !== reviewId);
    void deleteTestimonialFromFirestore(reviewId);
    onUpdateReviews(updated);
    showFeedback(isArabic ? '✓ تم حذف التقييم بنجاح' : 'Review deleted successfully');
  };

  // Toggle Offer Active Status
  const handleToggleOfferActive = (offerId: string) => {
    if (!canManageOffers) return;
    const updated = offersList.map((o) => o.id === offerId ? { ...o, active: !o.active } : o);
    syncOffers(updated);
    showFeedback(isArabic ? 'تم تحديث حالة العرض في السلايدر' : 'Offer slider status updated');
  };

  // Delete Offer (System Admin only)
  const handleDeleteOffer = (offerId: string) => {
    if (!canManageOffers || !isSystemAdmin) return;
    const updated = offersList.filter((o) => o.id !== offerId);
    void deleteOfferFromFirestore(offerId);
    syncOffers(updated);
    showFeedback(isArabic ? '✓ تم حذف العرض بنجاح' : 'Offer deleted successfully');
  };

  // Duplicate Offer for quick customization
  const handleDuplicateOffer = (offer: OfferData) => {
    if (!canManageOffers) return;
    const duplicated: OfferData = {
      ...offer,
      id: `offer-${Date.now()}`,
      titleAr: `${offer.titleAr} (نسخة جديدة)`,
      titleEn: `${offer.titleEn} (Copy)`,
      couponCode: `${offer.couponCode}-COPY`,
      active: false
    };
    const updated = [duplicated, ...offersList];
    syncOffers(updated);
    showFeedback(isArabic ? '✓ تم تكرار العرض - يمكنك تخصيص ألوانه وتفاصيله الآن' : 'Offer duplicated');
  };

  // Save Customized Offer from Modal
  const handleSaveCustomizedOffer = (savedOffer: OfferData) => {
    const exists = offersList.some(o => o.id === savedOffer.id);
    let updated: OfferData[];
    if (exists) {
      updated = offersList.map(o => o.id === savedOffer.id ? savedOffer : o);
    } else {
      updated = [savedOffer, ...offersList];
    }

    syncOffers(updated);
    setIsCustomizerOpen(false);
    setEditingOffer(null);
    showFeedback(
      isArabic 
        ? '✓ تم حفظ وتطبيق تخصيص بطاقة العرض الحصري بنجاح على السلايدر' 
        : 'Offer customization saved successfully'
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reviews'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {isArabic ? `تقييمات وآراء العملاء (${reviews.length})` : `Parent Reviews (${reviews.length})`}
          </button>

          <button
            onClick={() => setActiveSubTab('offers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'offers'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isArabic ? `إدارة العروض والكوبونات (${offersList.length})` : `Offers & Promotions (${offersList.length})`}</span>
          </button>
        </div>

        {activeSubTab === 'offers' && canManageOffers && (
          <button
            onClick={() => {
              setEditingOffer(null);
              setIsCustomizerOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#00E5BE] hover:brightness-105 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <Palette className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إضافة وتخصيص عرض جديد' : 'Add & Customize Offer'}</span>
          </button>
        )}
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Reviews Management Sub-Tab */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => {
            const isVisible = rev.active !== false && rev.isActive !== false;
            const isVerified = Boolean(rev.isVerifiedParent || rev.verifiedBeneficiary);
            return (
              <div
                key={rev.id}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs flex flex-col justify-between transition-all ${
                  isVisible
                    ? 'border-slate-200 dark:border-white/10'
                    : 'border-dashed border-slate-300 dark:border-white/15 opacity-65'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {isArabic ? rev.parentName : (rev.parentNameEn || rev.parentName)}
                        </h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isVisible
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                          }`}
                        >
                          {isVisible ? (isArabic ? 'ظاهر بالموقع' : 'Visible') : (isArabic ? 'مخفي' : 'Hidden')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {rev.childIssue || 'تأهيل سلوكي ونمائي'} • {rev.location || 'الرياض'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-3 rounded-2xl">
                    "{isArabic ? rev.comment : (rev.commentEn || rev.comment)}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 font-bold ${isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isVerified ? (isArabic ? 'مستفيد موثّق' : 'Verified Beneficiary') : (isArabic ? 'غير موثّق' : 'Unverified')}</span>
                    </span>
                  </div>

                  {canManageReviews && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleReviewActive(rev.id)}
                        title={isVisible ? (isArabic ? 'إخفاء من الموقع' : 'Hide from site') : (isArabic ? 'إظهار في الموقع' : 'Show on site')}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isVisible
                            ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleToggleVerified(rev.id)}
                        title={isArabic ? 'تبديل حالة التوثيق' : 'Toggle verified status'}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isVerified
                            ? 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      {isSystemAdmin && (
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          title={isArabic ? 'حذف التقييم' : 'Delete review'}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offers & Coupons Management Sub-Tab */}
      {activeSubTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{isArabic ? 'إدارة وتخصيص بطاقات العروض الحصرية' : 'Exclusive Offer Cards Management'}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00E5BE]/10 text-[#0F766E] dark:text-[#00E5BE] border border-[#00E5BE]/30">
                    {isArabic ? 'ألوان وتفاصيل كاملة' : 'Colors & Details Customizer'}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isArabic 
                    ? 'يمكنك تخصيص لون كل بطاقة، التدرجات اللونية، النصوص، الشارات، نسب الخصم والشروط مع ظهور التغييرات فوراً في سلايدر الصفحة الرئيسية.'
                    : 'Customize each card background, colors, gradients, labels, badges, discount calculation & terms with live sync to homepage.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5BE]" />
                  <span>{offersList.filter(o => o.active).length} {isArabic ? 'عروض نشطة' : 'Live Offers'}</span>
                </div>

                {canManageOffers && (
                  <button
                    onClick={() => {
                      setEditingOffer(null);
                      setIsCustomizerOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#00E5BE] hover:brightness-105 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'عرض جديد' : 'New Offer'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {offersList.map((offer) => {
                const styling = offer.styling || {};
                const fromColor = styling.bgGradientFrom || '#062c22';
                const accentColor = styling.accentColor || '#00E5BE';

                return (
                  <div 
                    key={offer.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                      offer.active
                        ? 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 shadow-xs'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-60'
                    }`}
                  >
                    <div className="space-y-3.5">
                      
                      {/* Top Bar: Color preview chip + Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            
                            {/* Color Theme Swatch Pill */}
                            <div 
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/20 text-[10px] font-bold text-white shadow-xs"
                              style={{ 
                                background: `linear-gradient(135deg, ${fromColor}, ${styling.bgGradientTo || fromColor})` 
                              }}
                            >
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                              <span className="font-mono text-[9px]">
                                {styling.themePreset ? styling.themePreset.toUpperCase() : 'THEME'}
                              </span>
                            </div>

                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${offer.isNationalDay ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200'}`}>
                              {offer.isNationalDay ? '🇸🇦 اليوم الوطني 96' : 'عرض خاص'}
                            </span>

                            <span className={`text-xs font-bold ${offer.active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                              {offer.active ? (isArabic ? '• نشط في السلايدر' : '• Live') : (isArabic ? '• معطل' : '• Disabled')}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-slate-900 dark:text-white pt-1">
                            {isArabic ? offer.titleAr : offer.titleEn}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {isArabic ? offer.subtitleAr : offer.subtitleEn}
                          </p>
                        </div>

                        {/* Coupon code pill */}
                        <button
                          onClick={() => handleCopyCode(offer.couponCode)}
                          title="Copy code"
                          className="flex items-center gap-1 border border-dashed border-emerald-500/50 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl font-mono text-xs font-black text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-white/10 cursor-pointer shrink-0"
                        >
                          {copiedCoupon === offer.couponCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px]">تم!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-emerald-500" />
                              <span>{offer.couponCode}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card meta summary */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isArabic ? offer.dateLabelAr : offer.dateLabelEn}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-[#00E5BE]" />
                          <span>{offer.discountType === 'free_day' ? 'يوم مجاني 100%' : (offer.discountType === 'fixed_amount' ? `${offer.discountValue} ر.س` : `${offer.discountValue}% خصم`)}</span>
                        </div>

                        {offer.terms && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <span>•</span>
                            <span>{offer.terms.length} {isArabic ? 'شروط مسجلة' : 'terms'}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Visual Color Strip */}
                      <div 
                        className="h-2 w-full rounded-full border border-white/10"
                        style={{
                          background: `linear-gradient(90deg, ${styling.bgGradientFrom || '#062c22'}, ${styling.accentColor || '#00E5BE'}, ${styling.bgGradientTo || '#041d17'})`
                        }}
                      />
                    </div>

                    {/* Actions Row */}
                    {canManageOffers && (
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 dark:border-white/10 gap-2 flex-wrap">
                        
                        <div className="flex items-center gap-1.5">
                          {/* Primary Customize Button */}
                          <button
                            onClick={() => {
                              setEditingOffer(offer);
                              setIsCustomizerOpen(true);
                            }}
                            className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Palette className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'تخصيص البطاقة والألوان' : 'Customize Colors & Details'}</span>
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicateOffer(offer)}
                            title={isArabic ? 'تكرار هذا العرض' : 'Duplicate offer'}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                          >
                            <CopyPlus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Toggle Active */}
                          <button
                            onClick={() => handleToggleOfferActive(offer.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                              offer.active
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                            }`}
                          >
                            {offer.active ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>{isArabic ? 'إيقاف' : 'Deactivate'}</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isArabic ? 'تفعيل' : 'Activate'}</span>
                              </>
                            )}
                          </button>

                          {/* Delete (System Admin Only) */}
                          {isSystemAdmin && (
                            <button
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isArabic ? 'حذف' : 'Delete'}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Offer Customizer Modal */}
      <OfferCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveCustomizedOffer}
        offerToEdit={editingOffer}
        isArabic={isArabic}
        isSystemAdmin={isSystemAdmin}
      />

    </div>
  );
};

export default MarketingReviewsTab;
