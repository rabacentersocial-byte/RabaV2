import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { ParentReview, PermissionId, OfferData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredOffers, saveStoredOffers } from '../../data/offersData';

interface MarketingReviewsTabProps {
  reviews: ParentReview[];
  onUpdateReviews: (updated: ParentReview[]) => void;
  hasPermission: (perm: PermissionId) => boolean;
  offers?: OfferData[];
  onUpdateOffers?: (updated: OfferData[]) => void;
}

export const MarketingReviewsTab: React.FC<MarketingReviewsTabProps> = ({
  reviews,
  onUpdateReviews,
  hasPermission,
  offers: propOffers,
  onUpdateOffers
}) => {
  const { isArabic } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'offers'>('reviews');

  const canManageOffers = hasPermission('manage_offers');
  const canManageReviews = hasPermission('manage_reviews');

  // Offers state
  const [offersList, setOffersList] = useState<OfferData[]>(() => {
    return propOffers || getStoredOffers();
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // New offer form state
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSubtitleAr, setNewSubtitleAr] = useState('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'free_day' | 'fixed_amount'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState<number>(20);
  const [newTargetDate, setNewTargetDate] = useState('2026-10-31T23:59:59');
  const [newDateLabelAr, setNewDateLabelAr] = useState('ساري حتى 31/10/2026');
  const [newDescriptionAr, setNewDescriptionAr] = useState('');

  const syncOffers = (updated: OfferData[]) => {
    setOffersList(updated);
    saveStoredOffers(updated);
    if (onUpdateOffers) {
      onUpdateOffers(updated);
    }
  };

  // Toggle Review Verified Status
  const handleToggleVerified = (reviewId: string) => {
    if (!canManageReviews) return;
    const updated = reviews.map((r) => r.id === reviewId ? { ...r, isVerifiedParent: !r.isVerifiedParent } : r);
    onUpdateReviews(updated);
    showFeedback(isArabic ? 'تم تحديث حالة توثيق ولي الأمر' : 'Review status updated');
  };

  // Delete review
  const handleDeleteReview = (reviewId: string) => {
    if (!canManageReviews) return;
    const updated = reviews.filter((r) => r.id !== reviewId);
    onUpdateReviews(updated);
    showFeedback(isArabic ? '✓ تم حذف التقييم بنجاح' : 'Review deleted successfully');
  };

  // Toggle Offer Active Status
  const handleToggleOfferActive = (offerId: string) => {
    if (!canManageOffers) return;
    const updated = offersList.map((o) => o.id === offerId ? { ...o, active: !o.active } : o);
    syncOffers(updated);
    showFeedback(isArabic ? 'تم تحديث حالة العرض' : 'Offer status updated');
  };

  // Delete Offer
  const handleDeleteOffer = (offerId: string) => {
    if (!canManageOffers) return;
    const updated = offersList.filter((o) => o.id !== offerId);
    syncOffers(updated);
    showFeedback(isArabic ? '✓ تم حذف العرض بنجاح' : 'Offer deleted successfully');
  };

  // Add New Offer
  const handleAddOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr || !newCouponCode) return;

    const newOffer: OfferData = {
      id: 'offer-' + Date.now(),
      titleAr: newTitleAr,
      titleEn: newTitleEn || newTitleAr,
      subtitleAr: newSubtitleAr || (isArabic ? 'عرض خاص لفترة محدودة' : 'Limited time offer'),
      subtitleEn: 'Exclusive limited time offer',
      badgeAr: newDiscountType === 'percentage' ? `خصم ${newDiscountValue}%` : (newDiscountType === 'free_day' ? 'يوم مجاني' : `خصم ${newDiscountValue} ر.س`),
      badgeEn: newDiscountType === 'percentage' ? `${newDiscountValue}% OFF` : 'SPECIAL OFFER',
      couponCode: newCouponCode.trim().toUpperCase(),
      targetDate: newTargetDate,
      dateLabelAr: newDateLabelAr,
      dateLabelEn: 'Valid until ' + newTargetDate.split('T')[0],
      discountType: newDiscountType,
      discountValue: newDiscountValue,
      theme: 'teal',
      active: true,
      descriptionAr: newDescriptionAr || 'عرض ترويجي وتأهيلي مخصص لعملاء مركز رابا.',
      descriptionEn: 'Promotional therapy offer for Raba Center clients.',
      terms: [
        { textAr: 'الخصم يطبق على السعر الأصلي للخدمة أو الباقة.', textEn: 'Discount applies to original price.' },
        { textAr: 'الحجز المسبق مطلوب للاستفادة من الكوبون.', textEn: 'Advance reservation required.' }
      ]
    };

    const updated = [newOffer, ...offersList];
    syncOffers(updated);

    // Reset Form
    setNewTitleAr('');
    setNewTitleEn('');
    setNewSubtitleAr('');
    setNewCouponCode('');
    setNewDiscountType('percentage');
    setNewDiscountValue(20);
    setNewDescriptionAr('');
    setIsAddModalOpen(false);
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
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {isArabic ? `تقييمات وآراء العملاء (${reviews.length})` : `Parent Reviews (${reviews.length})`}
          </button>

          <button
            onClick={() => setActiveSubTab('offers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'offers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isArabic ? `إدارة العروض والكوبونات (${offersList.length})` : `Offers & Promotions (${offersList.length})`}</span>
          </button>
        </div>

        {activeSubTab === 'offers' && canManageOffers && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#00E5BE] hover:brightness-105 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة عرض جديد إلى السلايدر' : 'Add New Offer to Slider'}</span>
          </button>
        )}
      </div>

      {/* Reviews Management Sub-Tab */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {isArabic ? rev.parentName : (rev.parentNameEn || rev.parentName)}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {rev.childIssue || 'تأهيل سلوكي ونمائي'} • {rev.location || 'الرياض'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded-lg text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
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
                  <span className={`inline-flex items-center gap-1 font-bold ${rev.isVerifiedParent || rev.verifiedBeneficiary ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مستفيد موثّق' : 'Verified Beneficiary'}</span>
                  </span>
                </div>

                {canManageReviews && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleVerified(rev.id)}
                      title={isArabic ? 'تبديل حالة التوثيق' : 'Toggle verified status'}
                      className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                      {rev.isVerifiedParent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      title={isArabic ? 'حذف التقييم' : 'Delete review'}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offers & Coupons Management Sub-Tab */}
      {activeSubTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'العروض النشطة وحملات الخصومات في السلايدر' : 'Active Promotions & Slider Offers'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isArabic 
                    ? 'يمكنك تفعيل أو إيقاف أو حذف أو إضافة أي عروض جديدة وستظهر فوراً في سلايدر العروض بالصفحة الرئيسية.'
                    : 'Manage promotional offers. Any added or updated offer appears immediately in the homepage offers slider.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5BE]" />
                <span>{offersList.filter(o => o.active).length} {isArabic ? 'عروض معروضة الآن' : 'Offers Live'}</span>
              </div>
            </div>

            {/* List of Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {offersList.map((offer) => (
                <div 
                  key={offer.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    offer.active
                      ? 'bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${offer.isNationalDay ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200'}`}>
                            {offer.isNationalDay ? '🇸🇦 اليوم الوطني 96' : 'عرض خاص'}
                          </span>
                          <span className={`text-xs font-bold ${offer.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {offer.active ? (isArabic ? '• نشط في السلايدر' : '• Live') : (isArabic ? '• معطل' : '• Disabled')}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                          {isArabic ? offer.titleAr : offer.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
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

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isArabic ? offer.dateLabelAr : offer.dateLabelEn}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-[#00E5BE]" />
                        <span>{offer.discountType === 'free_day' ? 'يوم مجاني 100%' : `${offer.discountValue}% خصم`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {canManageOffers && (
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/60 dark:border-white/5">
                      <button
                        onClick={() => handleToggleOfferActive(offer.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                          offer.active
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {offer.active ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'إيقاف مؤقت' : 'Deactivate'}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'تفعيل في السلايدر' : 'Activate in Slider'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'حذف' : 'Delete'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Offer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              {isArabic ? 'إضافة عرض جديد إلى السلايدر' : 'Add New Offer to Slider'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {isArabic ? 'سيتم إدراج العرض مباشرة في شريط العروض بالصفحة الرئيسية.' : 'This offer will appear directly in the homepage slider.'}
            </p>

            <form onSubmit={handleAddOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'عنوان العرض الرئيسي (بالعربية)*' : 'Offer Title (Arabic)*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isArabic ? 'مثال: خصم 20% على جلسات التكامل الحسي' : 'e.g. 20% Off Sensory Therapy'}
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'كود الكوبون*' : 'Coupon Code*'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SENSORY20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-mono text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'نوع الخصم' : 'Discount Type'}
                  </label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                  >
                    <option value="percentage">{isArabic ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="free_day">{isArabic ? 'يوم مجاني (100%)' : 'Free Day'}</option>
                    <option value="fixed_amount">{isArabic ? 'مبلغ نقدي مقطوع (ر.س)' : 'Fixed Amount (SAR)'}</option>
                  </select>
                </div>
              </div>

              {newDiscountType !== 'free_day' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'قيمة الخصم' : 'Discount Value'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'تاريخ الانتهاء للعداد' : 'Expiry Date for Countdown'}
                  </label>
                  <input
                    type="datetime-local"
                    value={newTargetDate.replace('Z', '')}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'نص التاريخ المعروض' : 'Display Date Label'}
                  </label>
                  <input
                    type="text"
                    value={newDateLabelAr}
                    onChange={(e) => setNewDateLabelAr(e.target.value)}
                    placeholder="ساري حتى 31/10/2026"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'وصف العرض / الشروط' : 'Description / Terms'}
                </label>
                <textarea
                  rows={2}
                  value={newDescriptionAr}
                  onChange={(e) => setNewDescriptionAr(e.target.value)}
                  placeholder={isArabic ? 'ساري للعملاء الجدد، أو عند حجز جلستين معاً...' : 'Notes and conditions...'}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {isArabic ? 'حفظ وإضافة للسلايدر' : 'Save & Publish to Slider'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MarketingReviewsTab;
