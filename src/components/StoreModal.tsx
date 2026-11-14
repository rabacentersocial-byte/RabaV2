import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  MessageCircle,
  Truck,
  CreditCard,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { Appointment, StoreOrderItem } from '../types';
import { 
  generateRequestReference, 
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage 
} from '../data/customerRequests';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  price: number;
  image: string;
  description: string;
  descriptionEn: string;
  rating: number;
}

const STORE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'حقيبة أدوات التدخل السلوكي وتحليل السلوك (ABA Token Kit)',
    nameEn: 'ABA Behavioral Intervention & Token Economy Kit',
    category: 'أدوات تعزيز السلوك',
    categoryEn: 'Behavior Reinforcement',
    price: 185,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
    description: 'لوحات التعزيز البصري ورموز النقاط والتعزيز الإيجابي لتحفيز السلوك التكيفي للطفل.',
    descriptionEn: 'Visual schedule boards, token charts, and positive reinforcement system for adaptive behavior.',
    rating: 4.9
  },
  {
    id: 'prod-2',
    name: 'مجموعة بطاقات التواصل البديل والمعزز (PECS Level 1 & 2)',
    nameEn: 'Alternative & Augmentative Communication (PECS Kit)',
    category: 'أدوات النطق والتخاطب',
    categoryEn: 'Speech & Communication',
    price: 220,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&q=80',
    description: 'أكثر من 300 بطاقة مصورة مقاومة للماء مع دفتر تواصل فيلكرو معتمد لتطوير طلب الاحتياجات.',
    descriptionEn: 'Over 300 waterproof picture cards with certified velcro binder for functional requesting.',
    rating: 5.0
  },
  {
    id: 'prod-3',
    name: 'سترة الضغط الحسي الموزونة لفرط الحركة والتهدئة (Weighted Vest)',
    nameEn: 'Calming Sensory Weighted Vest for Hyperactivity',
    category: 'التكامل الحسي والعلاج الوظيفي',
    categoryEn: 'Sensory & Occupational',
    price: 310,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    description: 'توفر ضغطاً عميقاً آمناً للمساعدة على التركيز وتقليل التشتت الحسي أثناء الجلسات والمذاكرة.',
    descriptionEn: 'Provides safe deep pressure input to enhance focus and regulate sensory stimuli during sessions.',
    rating: 4.8
  },
  {
    id: 'prod-4',
    name: 'لوحة المتاهات والتحكم بالقلم للتآزر البصري الحركي',
    nameEn: 'Fine Motor Control & Visual-Motor Maze Board',
    category: 'المهارات الحركية الدقيقة',
    categoryEn: 'Fine Motor Skills',
    price: 140,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80',
    description: 'تمرينات مرحة لتقوية قبضة الأصابع والتحكم الدقيق قبل دخول المدرسة.',
    descriptionEn: 'Engaging exercises for pre-writing finger grasp strengthening and pencil coordination.',
    rating: 4.9
  }
];

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, onAddToCart }) => {
  const { isArabic, direction } = useLanguage();
  
  // Cart Items: mapping productId -> quantity
  const [cart, setCart] = useState<Record<string, number>>({});
  const [view, setView] = useState<'catalog' | 'checkout' | 'success'>('catalog');
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityAddress, setCityAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'tamara'>('cod');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const cartProductList: { product: Product; quantity: number }[] = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => ({
      product: STORE_PRODUCTS.find(p => p.id === id)!,
      quantity: qty
    }))
    .filter(item => item.product !== undefined);

  const subtotal = cartProductList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    onAddToCart();
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => {
      const cur = prev[id] || 0;
      const next = cur + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError(isArabic ? 'يرجى إدخال اسم المستلم / العميل' : 'Please enter your name');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanDigits.length < 9) {
      setFormError(isArabic ? 'يرجى إدخال رقم جوال صحيح للتواصل (مثال: 05XXXXXXXX)' : 'Please enter a valid mobile number');
      return;
    }
    if (!cityAddress.trim()) {
      setFormError(isArabic ? 'يرجى كتابة المدينة والحي للتوصيل' : 'Please enter delivery city & address');
      return;
    }

    setIsSubmitting(true);

    const orderItems: StoreOrderItem[] = cartProductList.map(item => ({
      id: item.product.id,
      name: item.product.name,
      nameEn: item.product.nameEn,
      price: item.product.price,
      quantity: item.quantity
    }));

    const ref = generateRequestReference('store_order');

    const newRequest: Appointment = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: isArabic ? 'مستفيد - أدوات تأهيل' : 'Beneficiary Store Order',
      childAge: 5,
      guardianName: customerName.trim(),
      guardianPhone: phone.trim(),
      guardianEmail: 'store.order@customer.com',
      serviceId: 'srv-store',
      serviceTitle: isArabic ? `طلب أدوات متجر رابا (${orderItems.length} منتجات)` : `Raba Store Order (${orderItems.length} items)`,
      specialistId: 'spec-logistics',
      specialistName: isArabic ? 'إدارة التجهيزات والتوصيل' : 'Logistics & Dispatch Team',
      date: new Date().toISOString().split('T')[0],
      timeSlot: isArabic ? 'توصيل خلال 24 - 48 ساعة' : 'Delivery within 24-48 hrs',
      notes: notes.trim() || (isArabic ? `طلب من المتجر التعليمي والتأهيلي. العنوان: ${cityAddress}` : `Store order to: ${cityAddress}`),
      status: 'new', // Displayed as new order in admin
      paymentStatus: 'unpaid',
      paymentMethod: paymentMethod,
      amount: subtotal,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: true
      },
      createdAt: new Date().toISOString(),
      requestType: 'store_order',
      requestSource: 'متجر رابا للوسائل والأدوات التأهيلية',
      orderItems: orderItems,
      shippingAddress: cityAddress.trim(),
      readByAdmin: false
    };

    try {
      await saveAndBroadcastCustomerRequestAsync(newRequest);

      setSubmittedOrder(newRequest);
      setCart({});
      setView('success');

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('[StoreModal Error]:', err);
      setFormError(
        isArabic
          ? 'عذراً، حدث خطأ أثناء إرسال طلب الشراء. يرجى التحقق من اتصالك والمحاولة مجدداً.'
          : 'Failed to record store order in database. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setView('catalog');
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-3xl bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden ${isArabic ? 'text-right' : 'text-left'} flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 dark:bg-[#00E5BE]/20 text-sky-600 dark:text-[#00E5BE] border border-sky-400/30 dark:border-[#00E5BE]/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isArabic ? 'متجر مركز رابا التعليمي والتأهيلي' : 'Raba Educational & Rehab Store'}</span>
                {totalItemsCount > 0 && (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {totalItemsCount} {isArabic ? 'منتجات في السلة' : 'in cart'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic ? 'أدوات حسية، حقائب تعزيز ABA، ومساعدات نطق معتمدة طبياً' : 'Sensory tools, ABA reinforcement kits, and certified speech aids'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {view === 'catalog' && totalItemsCount > 0 && (
              <button
                onClick={() => setView('checkout')}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer hover:brightness-110 transition-all"
              >
                <span>{isArabic ? 'سلة الطلب' : 'Cart'}</span>
                <span className="bg-white/20 px-1.5 py-0.2 rounded-md font-mono">{totalItemsCount}</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors cursor-pointer"
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: Catalog */}
        {view === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STORE_PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div 
                    key={prod.id}
                    className="bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/15 hover:border-sky-400 dark:hover:border-[#00E5BE]/50 p-4 rounded-2xl flex flex-col justify-between transition-all"
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 dark:bg-white/5 mb-3 border border-slate-200 dark:border-white/10">
                      <img 
                        src={prod.image} 
                        alt={isArabic ? prod.name : prod.nameEn}
                        width={320}
                        height={180}
                        style={{ aspectRatio: '16 / 9' }}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover" 
                      />
                      <span className={`absolute top-2 ${isArabic ? 'right-2' : 'left-2'} bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-sky-700 dark:text-[#00E5BE] text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/15`}>
                        {isArabic ? prod.category : prod.categoryEn}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                          {isArabic ? prod.name : prod.nameEn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {isArabic ? prod.description : prod.descriptionEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-base font-black text-sky-600 dark:text-[#00E5BE]">{prod.price}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{isArabic ? 'ريال' : 'SAR'}</span>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(prod.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300 px-1">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(prod.id, 1)}
                            className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-emerald-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(prod.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 shadow-xs hover:scale-105"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'إضافة للسلة' : 'Add to Cart'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Checkout Form */}
        {view === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView('catalog')}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
              >
                {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isArabic ? 'العودة لتصفح المنتجات' : 'Back to Store Catalog'}</span>
              </button>

              <span className="text-xs font-bold text-slate-500">
                {isArabic ? 'إتمام الطلب وإرساله للوحة التحكم' : 'Submit Order to Dispatch'}
              </span>
            </div>

            {/* Selected items review */}
            <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                {isArabic ? 'المنتجات المختارة:' : 'Selected Items:'}
              </span>

              <div className="divide-y divide-slate-200/60 dark:divide-white/5 space-y-2">
                {cartProductList.map(item => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        width={40}
                        height={40}
                        style={{ aspectRatio: '1 / 1' }}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 rounded-lg object-cover shrink-0" 
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</span>
                        <span className="text-[11px] text-slate-500">{item.product.price} ر.س × {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {item.product.price * item.quantity} {isArabic ? 'ر.س' : 'SAR'}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title={isArabic ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-white/10 pt-3 flex items-center justify-between font-black text-sm">
                <span>{isArabic ? 'الإجمالي الكلي:' : 'Total Amount:'}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-base">
                  {subtotal} {isArabic ? 'ريال سعودي' : 'SAR'}
                </span>
              </div>
            </div>

            {/* Customer Shipping & Contact Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-700 dark:text-rose-300 font-bold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    {isArabic ? 'اسم المستلم / ولي الأمر:' : 'Full Name / Recipient:'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isArabic ? 'مثال: فيصل الخالدي' : 'e.g. John Doe'}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 pr-9 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <User className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-3`} />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    {isArabic ? 'رقم الجوال لتأكيد الشحن والتوصيل:' : 'Mobile Phone for Dispatch:'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      dir="ltr"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 pr-9 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono text-left"
                    />
                    <Phone className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-3`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'المدينة والحي وعنوان التوصيل:' : 'Delivery City & Address:'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cityAddress}
                    onChange={(e) => setCityAddress(e.target.value)}
                    placeholder={isArabic ? 'مثال: الرياض - حي الملقا - شارع وادي حنيفة' : 'e.g. Riyadh, Al-Malqa, St. 12'}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 pr-9 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <MapPin className={`w-4 h-4 text-slate-400 absolute ${isArabic ? 'right-3' : 'left-3'} top-3`} />
                </div>
              </div>

              {/* Payment Method Choice */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  {isArabic ? 'طريقة الدفع والتسليم المفضلة:' : 'Payment & Delivery Preference:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold' 
                      : 'border-slate-200 dark:border-white/10'
                  }`}>
                    <input
                      type="radio"
                      name="storePay"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-emerald-600"
                    />
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'دفع عند الاستلام' : 'Cash on Delivery'}</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold' 
                      : 'border-slate-200 dark:border-white/10'
                  }`}>
                    <input
                      type="radio"
                      name="storePay"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="text-emerald-600"
                    />
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'تحويل بنكي فوري' : 'Bank Transfer'}</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'tamara' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold' 
                      : 'border-slate-200 dark:border-white/10'
                  }`}>
                    <input
                      type="radio"
                      name="storePay"
                      checked={paymentMethod === 'tamara'}
                      onChange={() => setPaymentMethod('tamara')}
                      className="text-emerald-600"
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'تقسيط تمارا / إمكان' : 'Installments'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {isArabic ? 'ملاحظات إضافية للتوصيل (اختياري):' : 'Additional Delivery Instructions:'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isArabic ? 'أي تفاصيل خاصة بوقت الاستلام أو رقم المبنى...' : 'Apartment, building, or preferred delivery hours...'}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView('catalog')}
                  className="px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
                  <span>{isSubmitting ? (isArabic ? 'جاري حفظ وإرسال الطلب...' : 'Submitting order...') : (isArabic ? 'إرسال طلب الشراء إلى الإدارة' : 'Submit Order to Admin')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: Success Screen */}
        {view === 'success' && submittedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'تم استلام طلب الشراء وتمريره للإدارة!' : 'Order Placed & Sent to Admin!'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {isArabic 
                  ? 'تم تسجيل طلب الأدوات التأهيلية بنجاح في منظومة مركز رابا، وسيقوم فريق التجهيز والتوصيل بالتواصل لتأكيد الشحن.' 
                  : 'Your rehab tools order has been logged in Raba system. Our logistics team will call you.'}
              </p>
            </div>

            {/* Order Card Summary */}
            <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs text-right space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="text-slate-500">{isArabic ? 'رقم الطلب المرجعي:' : 'Order Ref:'}</span>
                <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm">
                  {submittedOrder.referenceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'اسم المستلم:' : 'Recipient:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedOrder.guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'رقم الجوال:' : 'Phone:'}</span>
                <span className="font-mono font-bold" dir="ltr">{submittedOrder.guardianPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isArabic ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{submittedOrder.shippingAddress}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-2 font-bold">
                <span className="text-slate-500">{isArabic ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 text-sm">
                  {submittedOrder.amount} {isArabic ? 'ر.س' : 'SAR'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <a
                href={getCustomerWhatsAppMessage(submittedOrder, isArabic)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'متابعة الطلب عبر الواتساب' : 'Track on WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {view === 'catalog' && (
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-sky-700 dark:text-[#00E5BE] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isArabic 
                  ? 'توصيل سريع لجميع مناطق المملكة وضمان جودة معتمدة طبياً' 
                  : 'Fast delivery across KSA & certified clinical quality warranty'}
              </span>
            </div>

            {totalItemsCount > 0 ? (
              <button
                onClick={() => setView('checkout')}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isArabic ? `متابعة الطلب (${subtotal} ر.س)` : `Checkout (${subtotal} SAR)`}</span>
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                {isArabic ? 'إغلاق المتجر' : 'Close Store'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
