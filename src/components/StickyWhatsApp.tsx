import React, { useState } from 'react';
import { MessageCircle, X, Send, Clock, ShieldCheck, CheckCheck } from 'lucide-react';

export const StickyWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const quickTopics = [
    'استفسار عن جلسات العلاج الوظيفي والتكامل الحسي',
    'حجز موعد تقييم وتشخيص شامل لطفلي',
    'الاستفسار عن أسعار وباقات التأهيل المكثف',
    'متابعة تنبيهات الجلسات مع الأخصائي'
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || userMsg || 'السلام عليكم، أود الاستفسار عن خدمات وباقات مركز رعاية الطفل والعلاج الوظيفي';
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://wa.me/966575100100?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <aside aria-label="محادثة واتساب الفورية" className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      {/* 3D Interactive Chat Popup */}
      {isOpen && (
        <div 
          id="whatsapp-chat-popup"
          className="mb-3 w-80 sm:w-96 glass-modal-dialog rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 card-3d"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-white text-lg shadow-xs">
                  👶
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
              </div>
              <div className="text-right">
                <h4 className="font-black text-sm">فريق خدمة المستفيدين 3D</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" /> متواجدون الآن للرد الفوري
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-full text-emerald-100 hover:text-white transition-colors cursor-pointer"
              aria-label="إغلاق المحادثة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto text-right">
            <div className="liquid-glass-panel p-3.5 rounded-2xl rounded-tr-none text-xs text-[#161B26] dark:text-[#F8FAFC] leading-relaxed">
              <p className="font-bold text-[#047857] dark:text-[#34D399] mb-1">أهلاً بك في مركز خُطوة لرعاية وتأهيل الطفل 👋</p>
              <p className="text-[#4B5563] dark:text-[#94A3B8]">يسعدنا تقديم الاستشارة المجانية والإجابة على أي استفسار حول جلسات العلاج الوظيفي، النطق والتخاطب، وباقات التأهيل للأطفال.</p>
              <span className="text-[10px] text-[#525B6B] dark:text-[#94A3B8] block text-left mt-1">الآن</span>
            </div>

            {/* Quick Questions Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8] block">اختر موضوع الاستفسار السريع:</span>
              {quickTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(topic)}
                  className="w-full text-right text-xs liquid-glass-panel hover:border-emerald-500/40 text-[#161B26] dark:text-[#F8FAFC] p-2.5 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-1">{topic}</span>
                  <Send className="w-3.5 h-3.5 text-[#525B6B] dark:text-[#94A3B8] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-[#161B26]/[0.08] dark:border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 text-xs warm-pill-input rounded-full px-3.5 py-2.5 focus:outline-none text-right"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-all shadow-md cursor-pointer"
              title="إرسال عبر واتساب"
              aria-label="إرسال عبر واتساب"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Main 3D Button */}
      <button
        id="sticky-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-4 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl active:translate-y-1 transition-all cursor-pointer border-b-4 border-emerald-900"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Animated Pulse Ring */}
        <span className="absolute -inset-1 rounded-2xl bg-emerald-400 opacity-40 group-hover:opacity-75 animate-ping -z-10" />
        
        {/* WhatsApp Icon */}
        <div className="w-6 h-6 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white" />
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-black block leading-tight">تواصل عبر واتساب</span>
          <span className="text-[10px] text-emerald-100 block font-bold">رد فوري ومباشر</span>
        </div>

        {/* Unread indicator */}
        <span className="w-2.5 h-2.5 bg-amber-300 rounded-full animate-bounce"></span>
      </button>
    </aside>
  );
};
