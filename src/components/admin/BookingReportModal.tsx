import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Printer, 
  Copy, 
  Check, 
  Calendar, 
  Filter, 
  Search, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  FileText,
  RefreshCw,
  Phone
} from 'lucide-react';
import { Appointment, Specialist } from '../../types';
import { SERVICES, SPECIALISTS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface BookingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

export const BookingReportModal: React.FC<BookingReportModalProps> = ({
  isOpen,
  onClose,
  appointments
}) => {
  const { isArabic } = useLanguage();

  const [liveSpecialists, setLiveSpecialists] = useState<Specialist[]>(() => {
    try {
      const saved = localStorage.getItem('raba_specialists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return SPECIALISTS;
  });

  useEffect(() => {
    const syncSpecs = () => {
      try {
        const saved = localStorage.getItem('raba_specialists');
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setLiveSpecialists(parsed);
      } catch {
        // ignore
      }
    };
    window.addEventListener('raba_specialists_updated', syncSpecs);
    window.addEventListener('raba_persistent_sync_ready', syncSpecs);
    return () => {
      window.removeEventListener('raba_specialists_updated', syncSpecs);
      window.removeEventListener('raba_persistent_sync_ready', syncSpecs);
    };
  }, []);

  // Filters state
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'this_week' | 'this_month'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [specialistFilter, setSpecialistFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Apply Preset Dates
  const handleApplyPreset = (preset: 'all' | 'today' | 'this_week' | 'this_month') => {
    setDatePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'this_week') {
      const d = new Date(today);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday/Sunday
      const start = new Date(d.setDate(diff)).toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(todayStr);
    } else if (preset === 'this_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      setStartDate(firstDay);
      setEndDate(todayStr);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setServiceFilter('all');
    setSpecialistFilter('all');
    setSearchQuery('');
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ =
          app.childName.toLowerCase().includes(q) ||
          app.guardianName.toLowerCase().includes(q) ||
          app.guardianPhone.toLowerCase().includes(q) ||
          app.referenceNumber.toLowerCase().includes(q) ||
          app.serviceTitle.toLowerCase().includes(q) ||
          app.specialistName.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // 3. Service Filter
      if (serviceFilter !== 'all' && app.serviceId !== serviceFilter) {
        return false;
      }

      // 4. Specialist Filter
      if (specialistFilter !== 'all' && app.specialistId !== specialistFilter) {
        return false;
      }

      // 5. Date Range
      if (startDate && app.date < startDate) {
        return false;
      }
      if (endDate && app.date > endDate) {
        return false;
      }

      return true;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter, specialistFilter, startDate, endDate]);

  // Statistics
  const totalCount = filteredAppointments.length;
  const confirmedCount = filteredAppointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = filteredAppointments.filter((a) => a.status === 'pending').length;
  const completedCount = filteredAppointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = filteredAppointments.filter((a) => a.status === 'cancelled').length;

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'رقم المرجع',
      'اسم العميل / ولي الأمر',
      'رقم الجوال',
      'اسم الطفل',
      'عمر الطفل',
      'الخدمة / البرنامج',
      'الأخصائي المعالج',
      'تاريخ الموعد',
      'وقت الموعد',
      'حالة الحجز',
      'ملاحظات إضافية',
      'تاريخ التسجيل'
    ];

    const rows = filteredAppointments.map((app) => [
      `"${app.referenceNumber}"`,
      `"${app.guardianName || 'ولي أمر'}"`,
      `"${app.guardianPhone}"`,
      `"${app.childName || 'المستفيد'}"`,
      `"${app.childAge || ''}"`,
      `"${app.serviceTitle}"`,
      `"${app.specialistName}"`,
      `"${app.date}"`,
      `"${app.timeSlot}"`,
      `"${
        app.status === 'confirmed'
          ? 'مؤكد'
          : app.status === 'pending'
          ? 'قيد الانتظار'
          : app.status === 'completed'
          ? 'مكتمل'
          : 'ملغى'
      }"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
      `"${app.createdAt ? app.createdAt.split('T')[0] : ''}"`
    ]);

    // Prepend UTF-8 BOM for proper Arabic support in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقرير_حجوزات_مركز_رابا_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const reportDate = new Date().toLocaleDateString('ar-SA');
    const text = `📊 تقرير حجوزات مركز رابا للرعاية وتأهيل التوحد\nتاريخ استخراج التقرير: ${reportDate}\n-----------------------------------\nإجمالي الحجوزات: ${totalCount}\n- الحجوزات المؤكدة: ${confirmedCount}\n- الحجوزات قيد الانتظار: ${pendingCount}\n- الحجوزات المكتملة: ${completedCount}\n- الحجوزات الملغاة: ${cancelledCount}\n\nفلاتر التقرير الحالية:\n- الحالة: ${statusFilter === 'all' ? 'الكل' : statusFilter}\n- الفترة: ${startDate || 'بداية السجل'} إلى ${endDate || 'اليوم'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print Report
  const handlePrintReport = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-l from-emerald-500/10 via-slate-50 dark:via-slate-800/80 to-white dark:to-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isArabic ? 'استخراج وتصدير تقرير الحجوزات' : 'Export & Filter Bookings Report'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25">
                  {totalCount} {isArabic ? 'حجز' : 'records'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic 
                  ? 'تصفية بيانات الحجوزات مع إمكانية التصدير كملف إكسل (CSV) والطباعة المباشرة'
                  : 'Filter booking records and export directly to CSV / Excel or printable format'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Filters Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? 'تصفية وفلترة التقرير:' : 'Report Filters:'}</span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium ml-1">
                  {isArabic ? 'فترات سريعة:' : 'Quick Presets:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      datePreset === 'all'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isArabic ? 'الكل' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('today')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    datePreset === 'today'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isArabic ? 'اليوم' : 'Today'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('this_week')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    datePreset === 'this_week'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isArabic ? 'هذا الأسبوع' : 'This Week'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('this_month')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    datePreset === 'this_month'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isArabic ? 'هذا الشهر' : 'This Month'}
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isArabic ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* 1. Status Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'حالة الحجز:' : 'Status:'}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">{isArabic ? 'كافة الحالات (الكل)' : 'All Statuses'}</option>
                  <option value="confirmed">{isArabic ? 'مؤكد' : 'Confirmed'}</option>
                  <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
                  <option value="cancelled">{isArabic ? 'ملغى' : 'Cancelled'}</option>
                </select>
              </div>

              {/* 2. Service Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'الخدمة / التخصص:' : 'Service:'}
                </label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">{isArabic ? 'كافة البرامج والتخصصات' : 'All Programs'}</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Specialist Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'الأخصائي المعالج:' : 'Specialist:'}
                </label>
                <select
                  value={specialistFilter}
                  onChange={(e) => setSpecialistFilter(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">{isArabic ? 'كافة الكوادر والأخصائيين' : 'All Specialists'}</option>
                  {(liveSpecialists.length > 0 ? liveSpecialists : SPECIALISTS).map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Text Search */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'بحث بالاسم، الجوال، أو المرجع:' : 'Search Name, Phone, Ref:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isArabic ? 'اكتب للبحث...' : 'Search term...'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-2.5`} />
                </div>
              </div>

            </div>

            {/* Date Range Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'من تاريخ:' : 'From Date:'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset('all');
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'إلى تاريخ:' : 'To Date:'}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset('all');
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono outline-none"
                />
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar for Report */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-bold mb-1">
                {isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {totalCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-bold mb-1">
                {isArabic ? 'حجوزات مؤكدة' : 'Confirmed'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {confirmedCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] text-amber-700 dark:text-amber-300 block font-bold mb-1">
                {isArabic ? 'قيد الانتظار' : 'Pending'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">
                {pendingCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
              <span className="text-[11px] text-sky-700 dark:text-sky-300 block font-bold mb-1">
                {isArabic ? 'مكتملة / أخرى' : 'Completed/Other'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-sky-700 dark:text-sky-400">
                {completedCount + cancelledCount}
              </span>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/10">
            <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-bold">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isArabic ? 'جاهز للتصدير الفوري:' : 'Ready for Export:'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Download CSV / Excel */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? 'تحميل ملف إكسل (CSV)' : 'Download Excel (CSV)'}</span>
              </button>

              {/* 2. Print Report */}
              <button
                type="button"
                onClick={handlePrintReport}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-white/10 dark:hover:bg-white/20 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isArabic ? 'طباعة التقرير / PDF' : 'Print / PDF'}</span>
              </button>

              {/* 3. Copy Summary */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الملخص' : 'Copy Summary')}</span>
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {isArabic ? 'معاينة سجلات التقرير الحالية:' : 'Live Report Records Preview:'}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {totalCount} {isArabic ? 'سجل مطابق' : 'matching records'}
              </span>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-right text-xs" dir={isArabic ? 'rtl' : 'ltr'}>
                <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">{isArabic ? 'المرجع' : 'Ref'}</th>
                    <th className="p-3">{isArabic ? 'الاسم / ولي الأمر' : 'Guardian/Name'}</th>
                    <th className="p-3">{isArabic ? 'رقم الجوال' : 'Phone'}</th>
                    <th className="p-3">{isArabic ? 'الطفل' : 'Child'}</th>
                    <th className="p-3">{isArabic ? 'الخدمة' : 'Service'}</th>
                    <th className="p-3">{isArabic ? 'الأخصائي' : 'Specialist'}</th>
                    <th className="p-3">{isArabic ? 'التاريخ والوقت' : 'Date & Time'}</th>
                    <th className="p-3">{isArabic ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-600 dark:text-slate-400 text-xs">
                        {isArabic ? 'لا توجد حجوزات مطابقة للفلاتر المحددة' : 'No records match selected filters'}
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app, idx) => (
                      <tr key={`${app.id}-${idx}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                          {app.referenceNumber}
                        </td>
                        <td className="p-3 font-bold">{app.guardianName || 'ولي الأمر'}</td>
                        <td className="p-3 font-mono" dir="ltr">{app.guardianPhone}</td>
                        <td className="p-3">{app.childName || 'المستفيد'}</td>
                        <td className="p-3 font-medium">{app.serviceTitle}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{app.specialistName}</td>
                        <td className="p-3">
                          <div>{app.date}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400">{app.timeSlot}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                                : app.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                                : app.status === 'completed'
                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20'
                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            {app.status === 'confirmed'
                              ? isArabic ? 'مؤكد' : 'Confirmed'
                              : app.status === 'pending'
                              ? isArabic ? 'قيد الانتظار' : 'Pending'
                              : app.status === 'completed'
                              ? isArabic ? 'مكتمل' : 'Completed'
                              : isArabic ? 'ملغى' : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <span>
            {isArabic 
              ? 'التقرير يشمل كافة البيانات المسجلة وتحديثات الحالات الحية في المنظومة' 
              : 'Report reflects current real-time state of clinic appointments'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-slate-100 rounded-xl font-bold cursor-pointer transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
