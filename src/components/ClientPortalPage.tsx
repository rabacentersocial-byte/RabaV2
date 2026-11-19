import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileBadge,
  FileText,
  FolderOpen,
  FolderPlus,
  Home,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Paperclip,
  Phone,
  Plus,
  Printer,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  Upload,
  User as UserIcon,
  Users,
  AlertCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Appointment,
  FamilyMember,
  MemberRecord,
  MemberReportType,
} from '../types';
import {
  subscribeClientAppointments,
  subscribeMemberRecords,
  createMemberRecordInFirestore,
  updateClientProfileInFirestore,
} from '../services/firestoreService';
import { ClientProfileOnboardingForm } from './ClientProfileOnboardingForm';
import { SERVICES, THERAPY_PACKAGES, TIME_SLOTS } from '../data/mockData';
import { getStoredBranchesData, BranchItem } from '../data/branchesData';
import {
  generateRequestReference,
  saveAndBroadcastCustomerRequestAsync,
  getCustomerWhatsAppMessage,
} from '../data/customerRequests';

interface ClientPortalPageProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
  onOpenBooking: () => void;
}

type MemberWorkspaceTab = 'reports' | 'subfiles' | 'bookings';

const REPORT_TYPE_OPTIONS: { value: MemberReportType; labelAr: string; labelEn: string }[] = [
  { value: 'developmental_assessment', labelAr: 'تقييم نمائي وتشخيصي', labelEn: 'Developmental Assessment' },
  { value: 'aba_progress', labelAr: 'تقرير تقدم ABA', labelEn: 'ABA Progress Report' },
  { value: 'speech_therapy', labelAr: 'تقرير نطق وتخاطب', labelEn: 'Speech Therapy Report' },
  { value: 'occupational_therapy', labelAr: 'تقرير علاج وظيفي', labelEn: 'Occupational Therapy Report' },
  { value: 'iep_plan', labelAr: 'خطة تربوية فردية (IEP)', labelEn: 'Individualized Plan (IEP)' },
  { value: 'medical_file', labelAr: 'ملف طبي / فحوصات', labelEn: 'Medical File / Labs' },
  { value: 'school_report', labelAr: 'تقرير مدرسي / دمج', labelEn: 'School / Inclusion Report' },
  { value: 'other', labelAr: 'مستند / تقرير عام', labelEn: 'General Document / Report' },
];

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  onBackToHome,
  onOpenLogin,
  onOpenBooking,
}) => {
  const { isArabic, direction } = useLanguage();
  const {
    user,
    clientProfile,
    loading,
    profileLoading,
    logout,
    setClientProfile,
  } = useAuth();

  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  const [memberRecords, setMemberRecords] = useState<MemberRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  // Per-member workspace selection
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [memberTab, setMemberTab] = useState<MemberWorkspaceTab>('reports');

  // Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female'>('male');
  const [editDob, setEditDob] = useState('');
  const [editFamilyMembers, setEditFamilyMembers] = useState<FamilyMember[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick Add Family Member Modal
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberDob, setNewMemberDob] = useState('');
  const [newMemberGender, setNewMemberGender] = useState<'male' | 'female'>('male');
  const [newMemberNotes, setNewMemberNotes] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  // In-Portal Booking Modal State
  const [isPortalBookingOpen, setIsPortalBookingOpen] = useState(false);
  const [bookingMemberId, setBookingMemberId] = useState<string>('primary');
  const [bookingType, setBookingType] = useState<'service' | 'package'>('service');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(THERAPY_PACKAGES[0].id);
  const [branchesList, setBranchesList] = useState<BranchItem[]>(() => getStoredBranchesData());
  const [selectedCity, setSelectedCity] = useState<string>(() => getStoredBranchesData()[0]?.city || 'riyadh');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    const all = getStoredBranchesData();
    const defaultCity = all[0]?.city || 'riyadh';
    return all.find((b) => b.city === defaultCity)?.id || '';
  });
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingError, setBookingError] = useState<string>('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Sub-file Upload Modal State (Parent Supplementary Sub-Files)
  const [isSubfileModalOpen, setIsSubfileModalOpen] = useState(false);
  const [subfileMemberId, setSubfileMemberId] = useState<string>('');
  const [subfileTitle, setSubfileTitle] = useState('');
  const [subfileType, setSubfileType] = useState<MemberReportType>('medical_file');
  const [subfileDate, setSubfileDate] = useState(todayStr);
  const [subfileSummary, setSubfileSummary] = useState('');
  const [subfileUrl, setSubfileUrl] = useState('');
  const [subfileName, setSubfileName] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSavingSubfile, setIsSavingSubfile] = useState(false);
  const [subfileError, setSubfileError] = useState('');

  // Full Report / Sub-file Preview Modal
  const [viewingRecord, setViewingRecord] = useState<MemberRecord | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleBranchesSync = () => {
      setBranchesList(getStoredBranchesData());
    };
    window.addEventListener('raba_branches_updated', handleBranchesSync);
    window.addEventListener('raba_persistent_sync_ready' as any, handleBranchesSync);
    return () => {
      window.removeEventListener('raba_branches_updated', handleBranchesSync);
      window.removeEventListener('raba_persistent_sync_ready' as any, handleBranchesSync);
    };
  }, []);

  const availableCities = useMemo(() => {
    const map = new Map<string, { key: string; labelAr: string; labelEn: string }>();
    branchesList.forEach((b) => {
      if (b.city && !map.has(b.city)) {
        map.set(b.city, {
          key: b.city,
          labelAr: b.cityNameAr || b.city,
          labelEn: b.cityNameEn || b.city,
        });
      }
    });
    return Array.from(map.values());
  }, [branchesList]);

  const branchesInCity = useMemo(
    () => branchesList.filter((b) => b.city === selectedCity),
    [branchesList, selectedCity]
  );

  useEffect(() => {
    if (branchesInCity.length > 0 && !branchesInCity.some((b) => b.id === selectedBranchId)) {
      setSelectedBranchId(branchesInCity[0].id);
    }
  }, [branchesInCity, selectedBranchId]);

  const getCleanBranchName = (branch: BranchItem) => {
    const rawName = isArabic ? branch.name : (branch.nameEn || branch.name);
    return rawName.split(/\s*[-–—]\s*/)[0].replace(/\s*\([^)]*\)/g, '').trim();
  };

  useEffect(() => {
    if (!clientProfile) return;
    setEditFullName(clientProfile.fullName || '');
    setEditPhone(clientProfile.phone || '');
    setEditEmail(clientProfile.email || '');
    setEditGender(clientProfile.gender || 'male');
    setEditDob(clientProfile.dob || '');
    setEditFamilyMembers(Array.isArray(clientProfile.familyMembers) ? clientProfile.familyMembers : []);
  }, [clientProfile]);

  useEffect(() => {
    if (
      selectedMemberId !== 'all' &&
      clientProfile &&
      !(clientProfile.familyMembers || []).some((m) => m.id === selectedMemberId)
    ) {
      setSelectedMemberId('all');
    }
  }, [clientProfile?.familyMembers, selectedMemberId]);

  useEffect(() => {
    if (!user?.uid || !clientProfile) {
      setClientAppointments([]);
      setMemberRecords([]);
      return;
    }

    setAppointmentsLoading(true);
    setAppointmentsError(null);
    const unsubAppointments = subscribeClientAppointments(
      user.uid,
      (list) => {
        setClientAppointments(list);
        setAppointmentsLoading(false);
        setAppointmentsError(null);
      },
      (err) => {
        setAppointmentsLoading(false);
        setAppointmentsError(err?.message || (isArabic ? 'تعذر تحميل المواعيد.' : 'Failed to load appointments.'));
      }
    );

    setRecordsLoading(true);
    setRecordsError(null);
    const unsubRecords = subscribeMemberRecords(
      user.uid,
      (records) => {
        setMemberRecords(records);
        setRecordsLoading(false);
        setRecordsError(null);
      },
      (err) => {
        setRecordsLoading(false);
        setRecordsError(err?.message || (isArabic ? 'تعذر تحميل التقارير والملفات.' : 'Failed to load reports & sub-files.'));
      }
    );

    return () => {
      unsubAppointments();
      unsubRecords();
    };
  }, [user?.uid, clientProfile?.uid, isArabic]);

  const calculateAgeInfo = (dob?: string): { years: number; label: string } => {
    if (!dob) return { years: 5, label: isArabic ? 'غير محدد' : 'N/A' };
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return { years: 5, label: dob };
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const mDiff = now.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) {
      years -= 1;
    }
    if (years < 0) years = 0;
    if (years === 0) {
      const months = Math.max(1, (now.getFullYear() - birth.getFullYear()) * 12 + mDiff);
      return {
        years: 1,
        label: isArabic ? `${months} شهر` : `${months} mos`,
      };
    }
    return {
      years,
      label: isArabic
        ? years === 1
          ? 'سنة واحدة'
          : years === 2
          ? 'سنتان'
          : years <= 10
          ? `${years} سنوات`
          : `${years} سنة`
        : `${years} yrs`,
    };
  };

  const getReportTypeLabel = (type: MemberReportType): string => {
    const found = REPORT_TYPE_OPTIONS.find((opt) => opt.value === type);
    if (!found) return isArabic ? 'تقرير / ملف' : 'Report / File';
    return isArabic ? found.labelAr : found.labelEn;
  };

  const getMemberAppointments = (member: FamilyMember): Appointment[] => {
    const normName = (member.name || '').trim().toLowerCase();
    return clientAppointments.filter(
      (apt) =>
        apt.familyMemberId === member.id ||
        (!apt.familyMemberId && normName && (apt.childName || '').trim().toLowerCase() === normName)
    );
  };

  const getMemberAllRecords = (memberId: string): MemberRecord[] =>
    memberRecords.filter((rec) => rec.familyMemberId === memberId);

  const selectedMember = useMemo(
    () => (clientProfile?.familyMembers || []).find((m) => m.id === selectedMemberId) || null,
    [clientProfile?.familyMembers, selectedMemberId]
  );

  const selectedMemberRecords = useMemo(
    () => (selectedMember ? getMemberAllRecords(selectedMember.id) : []),
    [selectedMember, memberRecords]
  );

  const selectedMemberReports = useMemo(
    () => selectedMemberRecords.filter((r) => r.recordCategory === 'report'),
    [selectedMemberRecords]
  );

  const selectedMemberSubfiles = useMemo(
    () => selectedMemberRecords.filter((r) => r.recordCategory === 'subfile'),
    [selectedMemberRecords]
  );

  const selectedMemberAppointments = useMemo(
    () => (selectedMember ? getMemberAppointments(selectedMember) : []),
    [selectedMember, clientAppointments]
  );

  const handleAddFamilyMemberInline = () => {
    setIsEditingProfile(true);
    setEditFamilyMembers((prev) => [
      ...prev,
      {
        id: `fam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: '',
        relation: isArabic ? 'ابن / ابنة' : 'Child / Dependent',
        dob: '',
        gender: 'male',
        subFileNumber: `SUB-${String(prev.length + 1).padStart(2, '0')}`,
      },
    ]);
  };

  const handleSaveQuickAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !clientProfile) return;
    if (!newMemberName.trim() || newMemberName.trim().length < 2) {
      setAddMemberError(isArabic ? 'يرجى كتابة اسم الفرد أو الطفل.' : 'Please enter the member name.');
      return;
    }

    setAddMemberError('');
    setIsAddingMember(true);
    try {
      const existingMembers = Array.isArray(clientProfile.familyMembers) ? clientProfile.familyMembers : [];
      const newMember: FamilyMember = {
        id: `fam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: newMemberName.trim(),
        relation: newMemberRelation.trim() || (isArabic ? 'ابن / ابنة' : 'Child / Dependent'),
        dob: newMemberDob.trim(),
        gender: newMemberGender,
        subFileNumber: `SUB-${String(existingMembers.length + 1).padStart(2, '0')}`,
        ...(newMemberNotes.trim() ? { notes: newMemberNotes.trim() } : {}),
      };

      const nextMembers = [...existingMembers, newMember];
      await updateClientProfileInFirestore(user.uid, { familyMembers: nextMembers });
      setClientProfile({ ...clientProfile, familyMembers: nextMembers });
      setSelectedMemberId(newMember.id);
      setMemberTab('reports');
      setIsAddMemberModalOpen(false);
      setNewMemberName('');
      setNewMemberRelation('');
      setNewMemberDob('');
      setNewMemberGender('male');
      setNewMemberNotes('');
      setSaveMessage({
        type: 'success',
        text: isArabic
          ? `تم فتح الملف الفرعي الخاص بـ (${newMember.name}) بنجاح.`
          : `Sub-file created for ${newMember.name}.`,
      });
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setAddMemberError(err?.message || (isArabic ? 'تعذر إضافة الفرد.' : 'Failed to add member.'));
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !clientProfile) return;

    if (!editFullName.trim() || editFullName.trim().length < 3) {
      setSaveMessage({
        type: 'error',
        text: isArabic ? 'يرجى إدخال الاسم الكامل بشكل صحيح.' : 'Please enter a valid full name.',
      });
      return;
    }

    setIsSavingProfile(true);
    setSaveMessage(null);
    try {
      const cleanedMembers = editFamilyMembers
        .filter((m) => m.name.trim().length > 0)
        .map((m, idx) => ({
          ...m,
          name: m.name.trim(),
          relation: m.relation.trim() || (isArabic ? 'طفل مستفيد' : 'Child / Dependent'),
          dob: (m.dob || '').trim(),
          gender: m.gender === 'female' ? ('female' as const) : ('male' as const),
          subFileNumber: m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`,
        }));

      await updateClientProfileInFirestore(user.uid, {
        fullName: editFullName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        gender: editGender,
        dob: editDob.trim(),
        familyMembers: cleanedMembers,
      });

      setClientProfile({
        ...clientProfile,
        fullName: editFullName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        gender: editGender,
        dob: editDob.trim(),
        familyMembers: cleanedMembers,
      });

      setIsEditingProfile(false);
      setSaveMessage({
        type: 'success',
        text: isArabic ? 'تم تحديث بيانات الملف والأسرة بنجاح.' : 'Profile and family members updated successfully.',
      });
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err?.message || (isArabic ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Failed to save changes.'),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Open In-Portal Booking Modal (optionally bound to a specific family member)
  const openPortalBookingForMember = (member?: FamilyMember | null) => {
    if (member) {
      setBookingMemberId(member.id);
    } else if (selectedMember) {
      setBookingMemberId(selectedMember.id);
    } else if (clientProfile?.familyMembers?.length === 1) {
      setBookingMemberId(clientProfile.familyMembers[0].id);
    } else {
      setBookingMemberId('primary');
    }
    setConfirmedBooking(null);
    setBookingError('');
    setBookingNotes('');
    setBookingDate(todayStr);
    setIsPortalBookingOpen(true);
  };

  const handlePortalBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !clientProfile) return;

    const activeCityObj = availableCities.find((c) => c.key === selectedCity) || availableCities[0];
    const activeBranchObj = branchesInCity.find((b) => b.id === selectedBranchId) || branchesInCity[0];
    if (!activeCityObj || !activeBranchObj) {
      setBookingError(isArabic ? 'يرجى اختيار المدينة والفرع المناسب.' : 'Please select city and branch.');
      return;
    }

    const activeService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
    const activePackage = THERAPY_PACKAGES.find((p) => p.id === selectedPackageId) || THERAPY_PACKAGES[0];
    const targetMember = (clientProfile.familyMembers || []).find((m) => m.id === bookingMemberId) || null;

    setBookingError('');
    setIsSubmittingBooking(true);

    const requestType = bookingType === 'package' ? 'package' : 'appointment';
    const ref = generateRequestReference(requestType);
    const serviceTitle =
      bookingType === 'package'
        ? !isArabic && activePackage.nameEn
          ? activePackage.nameEn
          : activePackage.name
        : !isArabic && activeService.titleEn
        ? activeService.titleEn
        : activeService.title;
    const cityLabel = isArabic ? activeCityObj.labelAr : activeCityObj.labelEn;
    const branchLabel = getCleanBranchName(activeBranchObj);

    const ageInfo = targetMember
      ? calculateAgeInfo(targetMember.dob)
      : calculateAgeInfo(clientProfile.dob);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      referenceNumber: ref,
      childName: targetMember ? targetMember.name : clientProfile.fullName,
      childAge: ageInfo.years,
      ...(targetMember?.dob ? { childBirthDate: targetMember.dob } : {}),
      guardianName: clientProfile.fullName,
      guardianPhone: clientProfile.phone,
      guardianEmail: clientProfile.email || user.email || '',
      userId: user.uid,
      clientId: user.uid,
      ...(targetMember ? { familyMemberId: targetMember.id, familyMemberName: targetMember.name } : {}),
      serviceId: bookingType === 'package' ? activePackage.id : activeService.id,
      serviceTitle,
      specialistId: 'spec-general',
      specialistName: isArabic ? 'الفريق الإكلينيكي المختص' : 'Clinical Specialist Team',
      city: cityLabel,
      branch: branchLabel,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      notes: bookingNotes.trim(),
      status: 'new',
      paymentStatus: 'unpaid',
      amount:
        bookingType === 'package'
          ? activePackage.price
          : activeService.sessionPrice || 280,
      reminderSettings: {
        whatsapp: true,
        sms: true,
        email: false,
      },
      createdAt: new Date().toISOString(),
      requestType,
      requestSource: targetMember
        ? `بوابة الأسرة (${targetMember.name}) - ${cityLabel}`
        : `بوابة الأسرة - ${cityLabel}`,
      couponCode: '',
      readByAdmin: false,
    };

    try {
      await saveAndBroadcastCustomerRequestAsync(newAppointment);
      setConfirmedBooking(newAppointment);
      if (targetMember && selectedMemberId === targetMember.id) {
        setMemberTab('bookings');
      }
      try {
        confetti({ particleCount: 45, spread: 55, origin: { y: 0.65 } });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setBookingError(
        err?.message ||
          (isArabic
            ? 'تعذر حفظ الحجز. يرجى التأكد من الاتصال والمحاولة مرة أخرى.'
            : 'Failed to submit booking. Please try again.')
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Sub-file upload & save handlers
  const openSubfileModalForMember = (member: FamilyMember) => {
    setSubfileMemberId(member.id);
    setSubfileTitle('');
    setSubfileType('medical_file');
    setSubfileDate(todayStr);
    setSubfileSummary('');
    setSubfileUrl('');
    setSubfileName('');
    setSubfileError('');
    setIsSubfileModalOpen(true);
  };

  const handleUploadAttachmentFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setSubfileError(isArabic ? 'حجم الملف يتجاوز الحد الأقصى (15 ميغابايت).' : 'File exceeds 15MB limit.');
      return;
    }

    setSubfileError('');
    setIsUploadingFile(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const resp = await fetch('/api/sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, fileData: dataUrl }),
      });
      const json = await resp.json();
      if (!resp.ok || !json?.success || !json?.url) {
        throw new Error(json?.error || 'Upload failed');
      }
      setSubfileUrl(json.url);
      setSubfileName(file.name);
      if (!subfileTitle.trim()) {
        setSubfileTitle(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch (err: any) {
      setSubfileError(
        err?.message || (isArabic ? 'فشل رفع الملف، يمكنك كتابة ملاحظة أو رابط مباشر.' : 'Upload failed.')
      );
    } finally {
      setIsUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleSaveSubfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !clientProfile) return;
    const targetMember = (clientProfile.familyMembers || []).find((m) => m.id === subfileMemberId);
    if (!targetMember) {
      setSubfileError(isArabic ? 'يرجى تحديد الفرد أولاً.' : 'Please select a family member.');
      return;
    }
    if (!subfileTitle.trim() || subfileTitle.trim().length < 2) {
      setSubfileError(isArabic ? 'يرجى إدخال عنوان الملف الفرعي (حرفان على الأقل).' : 'Please enter a valid title.');
      return;
    }

    setSubfileError('');
    setIsSavingSubfile(true);
    try {
      await createMemberRecordInFirestore(user.uid, {
        familyMemberId: targetMember.id,
        familyMemberName: targetMember.name,
        recordCategory: 'subfile',
        reportType: subfileType,
        title: subfileTitle.trim(),
        summary: subfileSummary.trim() || (isArabic ? 'مرفق مضاف من ولي الأمر' : 'Parent uploaded document'),
        reportDate: subfileDate || todayStr,
        fileUrl: subfileUrl.trim() || undefined,
        fileName: subfileName.trim() || undefined,
        authorRole: 'client',
      });
      setIsSubfileModalOpen(false);
      setSelectedMemberId(targetMember.id);
      setMemberTab('subfiles');
      setSaveMessage({
        type: 'success',
        text: isArabic
          ? `تم حفظ الملف الفرعي في ملف (${targetMember.name}) بنجاح.`
          : `Sub-file saved under ${targetMember.name}.`,
      });
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setSubfileError(err?.message || (isArabic ? 'تعذر حفظ الملف الفرعي.' : 'Failed to save sub-file.'));
    } finally {
      setIsSavingSubfile(false);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          label: isArabic ? 'مؤكد' : 'Confirmed',
          cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        };
      case 'completed':
        return {
          label: isArabic ? 'مكتمل' : 'Completed',
          cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
        };
      case 'cancelled':
        return {
          label: isArabic ? 'ملغى' : 'Cancelled',
          cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
        };
      default:
        return {
          label: isArabic ? 'قيد المتابعة' : 'In Review',
          cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
        };
    }
  };

  const activePackages = clientAppointments.filter(
    (a) => a.requestType === 'package' && a.status !== 'cancelled'
  );

  const totalReportsCount = memberRecords.filter((r) => r.recordCategory === 'report').length;

  return (
    <div className="min-h-screen pt-6 sm:pt-10 pb-20 relative" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-[24px] liquid-glass-card">
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-btn text-xs sm:text-sm font-black text-[#161B26] dark:text-[#F8FAFC] hover:text-[#1263D6] dark:hover:text-[#60AFFF] transition-colors"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isArabic ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </a>

            <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]" aria-label="Breadcrumb">
              <Home className="w-3.5 h-3.5 text-[#2B95FF]" />
              <span>/</span>
              <span className="text-[#1263D6] dark:text-[#60AFFF] font-black">
                {isArabic ? 'بوابة الأسرة وملف العميل' : 'Family & Client Portal'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {clientProfile && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1463D6]/12 border border-[#1463D6]/25 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black font-mono">
                <FileBadge className="w-3.5 h-3.5" />
                <span>{clientProfile.fileNumber}</span>
              </span>
            )}

            {user && (
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-black transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {(loading || profileLoading) && (
          <div className="liquid-glass-card rounded-[28px] p-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#1463D6] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#1263D6] dark:text-[#60AFFF]">
              {isArabic ? 'جاري تحميل بيانات ملف الأسرة...' : 'Loading your Family Portal...'}
            </p>
          </div>
        )}

        {/* Unauthenticated Gate */}
        {!loading && !profileLoading && !user && (
          <div className="liquid-glass-card rounded-[32px] p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#2B95FF]/15 border border-[#2B95FF]/30 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#161B26] dark:text-white">
                {isArabic ? 'مرحباً بكم في بوابة الأسرة الإلكترونية' : 'Welcome to Raba Family Portal'}
              </h1>
              <p className="text-sm text-[#4B5563] dark:text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                {isArabic
                  ? 'سجّل الدخول أو أنشئ ملف الأسرة الخاص بك لمتابعة المواعيد المحجوزة، تقارير الأطفال، والملفات الفرعية لكل فرد بأمان.'
                  : 'Sign in or create your family file to manage appointments, child reports, and individual sub-files securely.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white font-black text-sm inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isArabic ? 'تسجيل الدخول / إنشاء ملف' : 'Sign In / Register'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-full liquid-glass-btn text-sm font-black inline-flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-[#1463D6] dark:text-[#60AFFF]" />
                <span>{isArabic ? 'حجز موعد سريع' : 'Quick Booking'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Authenticated without Profile -> Onboarding */}
        {!loading && !profileLoading && user && !clientProfile && (
          <div className="liquid-glass-card rounded-[32px] p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
            <div className="text-center space-y-1.5 border-b border-slate-200/70 dark:border-white/10 pb-4">
              <h1 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-white">
                {isArabic ? 'استكمال إنشاء ملف العميل في مركز رابا' : 'Complete Your Raba Client File'}
              </h1>
              <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                {user.email || user.displayName}
              </p>
            </div>
            <ClientProfileOnboardingForm
              firebaseUser={user}
              onComplete={(created) => {
                setClientProfile(created);
              }}
            />
          </div>
        )}

        {/* Authenticated with Profile */}
        {!loading && !profileLoading && user && clientProfile && (
          <div className="space-y-6">
            {clientProfile.status === 'suspended' && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-700 dark:text-rose-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1.5">
                  <div className="font-black">
                    {isArabic ? 'تنبيه: هذا الملف موقوف مؤقتاً من قبل الإدارة' : 'Notice: This client file is currently suspended'}
                  </div>
                  {clientProfile.suspensionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold">
                      <span className="opacity-80">{isArabic ? 'سبب الإيقاف: ' : 'Suspension reason: '}</span>
                      <span>{clientProfile.suspensionReason}</span>
                    </div>
                  )}
                  <p>
                    {isArabic
                      ? 'للاستفسار أو إعادة تفعيل الملف الطبي، يرجى التواصل مع إدارة المركز على الرقم 0575100100.'
                      : 'Please contact center administration at 0575100100 for assistance.'}
                  </p>
                </div>
              </div>
            )}

            {/* Header Hero Card */}
            <div className="obsidian-anchor-card rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B95FF]/15 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black font-mono">
                    <FileBadge className="w-3.5 h-3.5" />
                    <span>{clientProfile.fileNumber}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                      clientProfile.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        clientProfile.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <span>
                      {clientProfile.status === 'active'
                        ? isArabic
                          ? 'ملف نشط'
                          : 'Active File'
                        : isArabic
                        ? 'ملف موقوف'
                        : 'Suspended'}
                    </span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#161B26] dark:text-white">
                  {isArabic ? `مرحباً، ${clientProfile.fullName}` : `Welcome, ${clientProfile.fullName}`}
                </h1>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic
                    ? 'إدارة ملف الأسرة، الحجز المباشر، والاطلاع على تقارير الأطفال والملفات الفرعية لكل فرد بشكل مستقل.'
                    : 'Book directly, view child clinical reports, and manage separate sub-files for each family member.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openPortalBookingForMember(selectedMember)}
                  className="px-5 py-3 rounded-full bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>
                    {selectedMember
                      ? isArabic
                        ? `حجز موعد لـ ${selectedMember.name}`
                        : `Book for ${selectedMember.name}`
                      : isArabic
                      ? 'حجز موعد من البوابة'
                      : 'Book from Portal'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-4 py-3 rounded-full liquid-glass-btn text-xs sm:text-sm font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-[#1463D6] dark:text-[#60AFFF]" />
                  <span>{isArabic ? 'إضافة ملف فرعي / فرد' : 'Add Member Sub-File'}</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'أفراد الأسرة والملفات الفرعية' : 'Member Sub-Files'}
                </span>
                <div className="text-lg sm:text-xl font-black tabular-nums text-[#1263D6] dark:text-[#60AFFF]">
                  {clientProfile.familyMembers?.length || 0}
                </div>
              </div>

              <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'التقارير الإكلينيكية المنشورة' : 'Published Reports'}
                </span>
                <div className="text-lg sm:text-xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  {totalReportsCount}
                </div>
              </div>

              <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
                </span>
                <div className="text-lg sm:text-xl font-black tabular-nums text-[#161B26] dark:text-white">
                  {clientAppointments.length}
                </div>
              </div>

              <div className="liquid-glass-card rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-[#4B5563] dark:text-[#94A3B8]">
                  {isArabic ? 'الباقات النشطة' : 'Active Packages'}
                </span>
                <div className="text-lg sm:text-xl font-black tabular-nums text-[#161B26] dark:text-white">
                  {activePackages.length}
                </div>
              </div>
            </div>

            {saveMessage && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  saveMessage.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-200'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            )}

            {/* Separate Per-Member Sub-Files Switcher Bar */}
            <div className="liquid-glass-card rounded-[26px] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#161B26] dark:text-white">
                      {isArabic ? 'ملفات أفراد الأسرة والأبناء المنفصلة' : 'Individual Family Member Sub-Files'}
                    </h2>
                    <p className="text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                      {isArabic
                        ? 'اختر أي فرد لاستعراض تقاريره، ملفاته الفرعية، وحجز موعد مخصص له.'
                        : 'Select any family member to inspect their separate reports, sub-files, and bookings.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-3.5 py-2 rounded-full bg-[#1463D6]/10 hover:bg-[#1463D6]/20 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إضافة فرد / طفل' : 'Add Member'}</span>
                </button>
              </div>

              <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedMemberId('all')}
                  className={`shrink-0 px-4 py-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 ${
                    selectedMemberId === 'all'
                      ? 'bg-[#1463D6] text-white border-transparent shadow-md'
                      : 'bg-white/60 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 hover:border-[#2B95FF]/50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedMemberId === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">
                      {isArabic ? 'الملف الموحد للأسرة' : 'Unified Family File'}
                    </div>
                    <div
                      className={`text-[10px] font-bold ${
                        selectedMemberId === 'all' ? 'text-white/80' : 'text-[#4B5563] dark:text-[#94A3B8]'
                      }`}
                    >
                      {isArabic
                        ? `${clientAppointments.length} حجز · ${memberRecords.length} سجل`
                        : `${clientAppointments.length} bookings · ${memberRecords.length} records`}
                    </div>
                  </div>
                </button>

                {(clientProfile.familyMembers || []).map((member, idx) => {
                  const isActive = selectedMemberId === member.id;
                  const mRecordsCount = getMemberAllRecords(member.id).length;
                  const mBookingsCount = getMemberAppointments(member).length;
                  const subCode = member.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`;
                  const ageInfo = calculateAgeInfo(member.dob);

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setMemberTab('reports');
                      }}
                      className={`shrink-0 min-w-[200px] px-4 py-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 ${
                        isActive
                          ? 'bg-[#1463D6] text-white border-transparent shadow-md'
                          : 'bg-white/60 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 hover:border-[#2B95FF]/50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {member.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black truncate max-w-[130px]">{member.name}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF]'
                            }`}
                          >
                            {subCode}
                          </span>
                        </div>
                        <div
                          className={`text-[10px] font-bold truncate ${
                            isActive ? 'text-white/85' : 'text-[#4B5563] dark:text-[#94A3B8]'
                          }`}
                        >
                          {member.relation}
                          {member.dob ? ` · ${ageInfo.label}` : ''} · {mRecordsCount} {isArabic ? 'تقرير/ملف' : 'files'} · {mBookingsCount}{' '}
                          {isArabic ? 'حجز' : 'bk'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================== */}
            {/* SEPARATE PER-MEMBER SUB-FILE WORKSPACE                         */}
            {/* ============================================================== */}
            {selectedMember ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Member Header Banner */}
                <div className="liquid-glass-card rounded-[28px] p-5 sm:p-7 space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-white/10 pb-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMemberId('all')}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full liquid-glass-btn text-[11px] font-black cursor-pointer"
                        >
                          {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                          <span>{isArabic ? 'الملف الموحد' : 'Unified File'}</span>
                        </button>
                        <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] border border-[#1463D6]/20">
                          {clientProfile.fileNumber} / {selectedMember.subFileNumber || 'SUB-01'}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                          {selectedMember.relation}
                        </span>
                        {selectedMember.gender && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-500/10 text-[#4B5563] dark:text-[#94A3B8]">
                            {selectedMember.gender === 'female' ? (isArabic ? 'أنثى' : 'Female') : isArabic ? 'ذكر' : 'Male'}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-[#161B26] dark:text-white">
                        {isArabic ? `الملف الفرعي والتقارير: ${selectedMember.name}` : `Sub-File & Reports: ${selectedMember.name}`}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B5563] dark:text-[#94A3B8]">
                        {selectedMember.dob && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#2B95FF]" />
                            <span>
                              {isArabic ? 'الميلاد:' : 'DOB:'}{' '}
                              <strong dir="ltr" className="font-mono text-[#161B26] dark:text-white">
                                {selectedMember.dob}
                              </strong>{' '}
                              ({calculateAgeInfo(selectedMember.dob).label})
                            </span>
                          </span>
                        )}
                        {selectedMember.notes && (
                          <span className="inline-flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-[#2B95FF]" />
                            <span>{selectedMember.notes}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openPortalBookingForMember(selectedMember)}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>{isArabic ? `حجز موعد لـ ${selectedMember.name}` : `Book for ${selectedMember.name}`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openSubfileModalForMember(selectedMember)}
                        className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isArabic ? 'رفع ملف فرعي / مرفق' : 'Upload Sub-File'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Member Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMemberTab('reports')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-all ${
                        memberTab === 'reports'
                          ? 'bg-[#1463D6] text-white shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6]'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>{isArabic ? 'تقارير الطفل والتقييمات' : 'Child Clinical Reports'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/15 dark:bg-white/15">
                        {selectedMemberReports.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMemberTab('subfiles')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-all ${
                        memberTab === 'subfiles'
                          ? 'bg-[#1463D6] text-white shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6]'
                      }`}
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{isArabic ? 'الملفات الفرعية والمرفقات' : 'Sub-Files & Attachments'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/15 dark:bg-white/15">
                        {selectedMemberSubfiles.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMemberTab('bookings')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-all ${
                        memberTab === 'bookings'
                          ? 'bg-[#1463D6] text-white shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-[#4B5563] dark:text-[#94A3B8] hover:text-[#1263D6]'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{isArabic ? 'الحجوزات والباقات' : 'Bookings & Packages'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/15 dark:bg-white/15">
                        {selectedMemberAppointments.length}
                      </span>
                    </button>
                  </div>

                  {recordsError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{recordsError}</span>
                    </div>
                  )}

                  {/* TAB 1: Clinical Reports */}
                  {memberTab === 'reports' && (
                    <div className="space-y-4">
                      {recordsLoading ? (
                        <div className="py-10 text-center text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                          {isArabic ? 'جاري تحميل تقارير الطفل...' : 'Loading reports...'}
                        </div>
                      ) : selectedMemberReports.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                          <FileText className="w-10 h-10 text-[#2B95FF] mx-auto" />
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#161B26] dark:text-white">
                              {isArabic
                                ? `لا توجد تقارير إكلينيكية منشورة لـ (${selectedMember.name}) حتى الآن`
                                : `No clinical reports published yet for ${selectedMember.name}`}
                            </h3>
                            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] max-w-md mx-auto">
                              {isArabic
                                ? 'تظهر هنا جميع تقارير التقييم النمائي، خطط العلاج (ABA، التخاطب، الوظيفي)، وتقارير التقدم الدورية فور اعتمادها من أخصائيي المركز.'
                                : 'Developmental assessments, ABA/speech/OT progress reports, and IEPs appear here once published by your specialist team.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openPortalBookingForMember(selectedMember)}
                            className="px-5 py-2.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <CalendarCheck className="w-4 h-4" />
                            <span>{isArabic ? `حجز جلسة تقييم لـ ${selectedMember.name}` : `Book Assessment for ${selectedMember.name}`}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMemberReports.map((rec) => (
                            <div
                              key={rec.id}
                              className="p-4 sm:p-5 rounded-2xl bg-white/75 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="px-2.5 py-1 rounded-full bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] text-[10px] font-black">
                                    {getReportTypeLabel(rec.reportType)}
                                  </span>
                                  <span dir="ltr" className="text-[11px] font-mono font-bold text-[#4B5563] dark:text-[#94A3B8]">
                                    {rec.reportDate}
                                  </span>
                                </div>

                                <h3 className="text-sm sm:text-base font-black text-[#161B26] dark:text-white">
                                  {rec.title}
                                </h3>

                                {rec.specialistName && (
                                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                                    <Stethoscope className="w-3.5 h-3.5" />
                                    <span>{rec.specialistName}</span>
                                  </div>
                                )}

                                <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed line-clamp-3">
                                  {rec.summary}
                                </p>

                                {rec.recommendations && (
                                  <div className="p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-200 line-clamp-2">
                                    <strong>{isArabic ? 'التوصيات:' : 'Recommendations:'}</strong> {rec.recommendations}
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => setViewingRecord(rec)}
                                  className="px-3.5 py-1.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{isArabic ? 'عرض وطباعة التقرير' : 'View & Print'}</span>
                                </button>

                                {rec.fileUrl && (
                                  <a
                                    href={rec.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-full liquid-glass-btn text-[11px] font-black inline-flex items-center gap-1 text-[#1263D6] dark:text-[#60AFFF]"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{rec.fileName || (isArabic ? 'فتح المرفق' : 'Attachment')}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Sub-Files & Attachments */}
                  {memberTab === 'subfiles' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                          {isArabic
                            ? `الملفات الطبية والمدرسية والمرفقات الخاصة بـ ${selectedMember.name} فقط.`
                            : `Medical, school, and supplementary sub-files dedicated to ${selectedMember.name}.`}
                        </p>
                        <button
                          type="button"
                          onClick={() => openSubfileModalForMember(selectedMember)}
                          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'إضافة ملف فرعي جديد' : 'Add Sub-File'}</span>
                        </button>
                      </div>

                      {selectedMemberSubfiles.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                          <Paperclip className="w-10 h-10 text-emerald-500 mx-auto" />
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#161B26] dark:text-white">
                              {isArabic
                                ? `لا توجد ملفات فرعية مضافة لـ (${selectedMember.name})`
                                : `No sub-files yet for ${selectedMember.name}`}
                            </h3>
                            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] max-w-md mx-auto">
                              {isArabic
                                ? 'يمكنك رفع التقارير الطبية السابقة، تقارير المدرسة، أو أي مستندات مساندة ليطلع عليها الأخصائيون في المركز.'
                                : 'Upload prior medical records, school reports, or supporting documents for your child’s clinical team.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openSubfileModalForMember(selectedMember)}
                            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{isArabic ? 'رفع أول ملف فرعي' : 'Upload First Sub-File'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMemberSubfiles.map((rec) => (
                            <div
                              key={rec.id}
                              className="p-4 sm:p-5 rounded-2xl bg-white/75 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                    rec.authorRole === 'admin'
                                      ? 'bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] border-[#1463D6]/25'
                                      : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                                  }`}
                                >
                                  {rec.authorRole === 'admin'
                                    ? isArabic
                                      ? 'مرفق من المركز'
                                      : 'From Center'
                                    : isArabic
                                    ? 'مرفق ولي الأمر'
                                    : 'Parent Upload'}
                                </span>
                                <span dir="ltr" className="text-[11px] font-mono text-[#4B5563] dark:text-[#94A3B8]">
                                  {rec.reportDate}
                                </span>
                              </div>

                              <div>
                                <div className="text-[10px] font-bold text-[#1263D6] dark:text-[#60AFFF] mb-0.5">
                                  {getReportTypeLabel(rec.reportType)}
                                </div>
                                <h3 className="text-sm font-black text-[#161B26] dark:text-white">{rec.title}</h3>
                              </div>

                              {rec.summary && (
                                <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed line-clamp-3">
                                  {rec.summary}
                                </p>
                              )}

                              <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setViewingRecord(rec)}
                                    className="px-3 py-1.5 rounded-full bg-[#1463D6]/10 hover:bg-[#1463D6]/20 text-[#1263D6] dark:text-[#60AFFF] text-[11px] font-black inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isArabic ? 'التفاصيل' : 'Details'}</span>
                                  </button>

                                  {rec.fileUrl && (
                                    <a
                                      href={rec.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-full bg-emerald-600/12 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-black inline-flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      <span>{rec.fileName || (isArabic ? 'عرض الملف' : 'Open File')}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: Member Bookings & Packages */}
                  {memberTab === 'bookings' && (
                    <div className="space-y-4">
                      {selectedMemberAppointments.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                          <CalendarCheck className="w-10 h-10 text-[#2B95FF] mx-auto" />
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#161B26] dark:text-white">
                              {isArabic
                                ? `لا توجد حجوزات مسجلة لـ (${selectedMember.name}) حتى الآن`
                                : `No bookings recorded yet for ${selectedMember.name}`}
                            </h3>
                            <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                              {isArabic
                                ? 'احجز جلسة تقييم أو باقة تأهيلية مباشرة وسيتم ربطها تلقائياً بهذا الملف الفرعي.'
                                : 'Book an assessment or therapy package directly and it will link to this member’s sub-file.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openPortalBookingForMember(selectedMember)}
                            className="px-5 py-2.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <CalendarCheck className="w-4 h-4" />
                            <span>{isArabic ? `حجز موعد لـ ${selectedMember.name}` : `Book for ${selectedMember.name}`}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedMemberAppointments.map((apt) => {
                            const badge = getStatusBadge(apt.status);
                            return (
                              <div
                                key={apt.id}
                                className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2.5"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-xs font-black text-[#1263D6] dark:text-[#60AFFF] px-2.5 py-1 rounded-lg bg-[#2B95FF]/10">
                                      {apt.referenceNumber}
                                    </span>
                                    <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-white truncate">
                                      {apt.serviceTitle}
                                    </h3>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${badge.cls}`}>
                                    {badge.label}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4B5563] dark:text-[#94A3B8]">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                    <span dir="ltr" className="font-mono">{apt.date || '—'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                    <span>{apt.timeSlot || '—'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                    <span className="truncate">
                                      {[apt.city, apt.branch].filter(Boolean).join(' - ') || (isArabic ? 'مركز رابا' : 'Raba Center')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ============================================================ */
              /* UNIFIED FAMILY OVERVIEW (selectedMemberId === 'all')         */
              /* ============================================================ */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Start Column: Personal Profile & Family Members */}
                <div className="lg:col-span-5 liquid-glass-card rounded-[28px] p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3.5">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                      <h2 className="text-base sm:text-lg font-black text-[#161B26] dark:text-white">
                        {isArabic ? 'بيانات العميل والأسرة' : 'Profile & Family Members'}
                      </h2>
                    </div>

                    {!isEditingProfile && (
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1463D6]/10 hover:bg-[#1463D6]/20 text-[#1263D6] dark:text-[#60AFFF] text-xs font-black transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'تعديل' : 'Edit'}</span>
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'الاسم الكامل' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-sm outline-none focus:border-[#2B95FF]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                            {isArabic ? 'رقم الجوال' : 'Phone'}
                          </label>
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-sm font-mono text-left outline-none focus:border-[#2B95FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                            {isArabic ? 'تاريخ الميلاد' : 'Date of Birth'}
                          </label>
                          <input
                            type="date"
                            required
                            value={editDob}
                            onChange={(e) => setEditDob(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-sm font-mono outline-none focus:border-[#2B95FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'البريد الإلكتروني' : 'Email'}
                        </label>
                        <input
                          type="email"
                          required
                          dir="ltr"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-sm font-mono text-left outline-none focus:border-[#2B95FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'الجنس' : 'Gender'}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditGender('male')}
                            className={`h-9 rounded-xl text-xs font-bold cursor-pointer border ${
                              editGender === 'male'
                                ? 'bg-[#1463D6] text-white border-transparent'
                                : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {isArabic ? 'ذكر' : 'Male'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditGender('female')}
                            className={`h-9 rounded-xl text-xs font-bold cursor-pointer border ${
                              editGender === 'female'
                                ? 'bg-[#1463D6] text-white border-transparent'
                                : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {isArabic ? 'أنثى' : 'Female'}
                          </button>
                        </div>
                      </div>

                      {/* Editable Family Members */}
                      <div className="pt-2 space-y-2.5 border-t border-slate-200/70 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'أفراد الأسرة / الأبناء' : 'Family Members'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleAddFamilyMemberInline}
                            className="px-2.5 py-1 rounded-full bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] text-[11px] font-black inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isArabic ? 'إضافة' : 'Add'}</span>
                          </button>
                        </div>

                        {editFamilyMembers.map((member, idx) => (
                          <div key={member.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  setEditFamilyMembers((prev) =>
                                    prev.map((m, i) => (i === idx ? { ...m, name: e.target.value } : m))
                                  )
                                }
                                placeholder={isArabic ? 'الاسم' : 'Name'}
                                className="flex-1 h-9 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs outline-none"
                              />
                              {!clientProfile.familyMembers?.some((orig) => orig.id === member.id) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditFamilyMembers((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  className="w-8 h-9 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                                  aria-label={isArabic ? 'إلغاء الإضافة' : 'Cancel addition'}
                                  title={isArabic ? 'إلغاء إضافة السطر غير المحفوظ' : 'Remove unsaved row'}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={member.relation}
                                onChange={(e) =>
                                  setEditFamilyMembers((prev) =>
                                    prev.map((m, i) => (i === idx ? { ...m, relation: e.target.value } : m))
                                  )
                                }
                                placeholder={isArabic ? 'القرابة' : 'Relation'}
                                className="h-8 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs outline-none"
                              />
                              <select
                                value={member.gender || 'male'}
                                onChange={(e) =>
                                  setEditFamilyMembers((prev) =>
                                    prev.map((m, i) =>
                                      i === idx ? { ...m, gender: e.target.value as 'male' | 'female' } : m
                                    )
                                  )
                                }
                                className="h-8 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs outline-none"
                              >
                                <option value="male">{isArabic ? 'ذكر' : 'Male'}</option>
                                <option value="female">{isArabic ? 'أنثى' : 'Female'}</option>
                              </select>
                              <input
                                type="date"
                                value={member.dob}
                                onChange={(e) =>
                                  setEditFamilyMembers((prev) =>
                                    prev.map((m, i) => (i === idx ? { ...m, dob: e.target.value } : m))
                                  )
                                }
                                className="h-8 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[11px] font-mono outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSavingProfile ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التغييرات' : 'Save Changes')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setEditFullName(clientProfile.fullName);
                            setEditPhone(clientProfile.phone);
                            setEditEmail(clientProfile.email);
                            setEditGender(clientProfile.gender);
                            setEditDob(clientProfile.dob);
                            setEditFamilyMembers(clientProfile.familyMembers || []);
                          }}
                          className="py-2.5 px-4 rounded-xl liquid-glass-btn text-xs font-bold cursor-pointer"
                        >
                          {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2.5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.03]">
                          <span className="text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'الاسم' : 'Name'}</span>
                          </span>
                          <span className="font-black text-[#161B26] dark:text-white">{clientProfile.fullName}</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.03]">
                          <span className="text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'الجوال' : 'Phone'}</span>
                          </span>
                          <span dir="ltr" className="font-mono font-bold text-[#161B26] dark:text-white">{clientProfile.phone}</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.03]">
                          <span className="text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'البريد' : 'Email'}</span>
                          </span>
                          <span dir="ltr" className="font-mono text-xs font-bold text-[#161B26] dark:text-white truncate max-w-[200px]">{clientProfile.email}</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.03]">
                          <span className="text-[#4B5563] dark:text-[#94A3B8] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'تاريخ الميلاد' : 'Date of Birth'}</span>
                          </span>
                          <span dir="ltr" className="font-mono font-bold text-[#161B26] dark:text-white">{clientProfile.dob || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.03]">
                          <span className="text-[#4B5563] dark:text-[#94A3B8]">
                            {isArabic ? 'الجنس' : 'Gender'}
                          </span>
                          <span className="font-bold text-[#161B26] dark:text-white">
                            {clientProfile.gender === 'female' ? (isArabic ? 'أنثى' : 'Female') : (isArabic ? 'ذكر' : 'Male')}
                          </span>
                        </div>
                      </div>

                      {/* Family Members Read View with Separate Sub-File Actions */}
                      <div className="pt-3 border-t border-slate-200/70 dark:border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-[#161B26] dark:text-white flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#2B95FF]" />
                            <span>{isArabic ? 'أفراد الأسرة والأبناء' : 'Family Members'}</span>
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="inline-flex items-center gap-1 text-[11px] font-black text-[#1263D6] dark:text-[#60AFFF] hover:underline cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'إضافة فرد' : 'Add Member'}</span>
                          </button>
                        </div>

                        {!clientProfile.familyMembers || clientProfile.familyMembers.length === 0 ? (
                          <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] bg-white/40 dark:bg-white/[0.02] p-3 rounded-xl">
                            {isArabic
                              ? 'لا يوجد أفراد أسرة مضافون حالياً. أضف ابنك أو أحد أفراد الأسرة لفتح ملف فرعي مستقل وتقارير خاصة به.'
                              : 'No family members added yet. Add a member to open an independent sub-file and reports view.'}
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {clientProfile.familyMembers.map((member, idx) => {
                              const mRecords = getMemberAllRecords(member.id);
                              const mReportsCount = mRecords.filter((r) => r.recordCategory === 'report').length;
                              const subCode = member.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`;
                              return (
                                <div
                                  key={member.id}
                                  className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2.5"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs sm:text-sm font-black text-[#161B26] dark:text-white truncate">
                                          {member.name}
                                        </span>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] font-bold">
                                          {subCode}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-[#4B5563] dark:text-[#94A3B8] mt-0.5">
                                        {member.relation}
                                        {member.dob ? ` · ${calculateAgeInfo(member.dob).label}` : ''}
                                        {` · ${mReportsCount} ${isArabic ? 'تقرير' : 'reports'}`}
                                      </div>
                                    </div>
                                    {member.dob && (
                                      <span dir="ltr" className="text-[11px] font-mono text-[#1263D6] dark:text-[#60AFFF] shrink-0">
                                        {member.dob}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedMemberId(member.id);
                                        setMemberTab('reports');
                                      }}
                                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#1463D6]/10 hover:bg-[#1463D6] text-[#1263D6] dark:text-[#60AFFF] hover:text-white text-[11px] font-black inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <FolderOpen className="w-3.5 h-3.5" />
                                      <span>{isArabic ? 'فتح الملف والتقارير' : 'Open Sub-File'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openPortalBookingForMember(member)}
                                      className="py-1.5 px-3 rounded-xl bg-emerald-600/12 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white text-[11px] font-black inline-flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <CalendarCheck className="w-3.5 h-3.5" />
                                      <span>{isArabic ? 'حجز' : 'Book'}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right/End Column: Recent Reports + Active Packages + Linked Bookings */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Recent Reports & Sub-Files Summary */}
                  {memberRecords.length > 0 && (
                    <div className="liquid-glass-card rounded-[28px] p-5 sm:p-6 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                          <h2 className="text-base sm:text-lg font-black text-[#161B26] dark:text-white">
                            {isArabic ? 'أحدث تقارير الأطفال والملفات الفرعية' : 'Recent Child Reports & Sub-Files'}
                          </h2>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] tabular-nums">
                          {memberRecords.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {memberRecords.slice(0, 4).map((rec) => (
                          <div
                            key={rec.id}
                            className="p-3.5 rounded-2xl bg-white/65 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] text-[10px] font-black truncate">
                                {rec.familyMemberName}
                              </span>
                              <span dir="ltr" className="text-[10px] font-mono text-[#4B5563] dark:text-[#94A3B8]">
                                {rec.reportDate}
                              </span>
                            </div>
                            <div className="text-xs font-black text-[#161B26] dark:text-white truncate">{rec.title}</div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8]">
                                {getReportTypeLabel(rec.reportType)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setViewingRecord(rec)}
                                className="text-[11px] font-black text-[#1263D6] dark:text-[#60AFFF] hover:underline cursor-pointer"
                              >
                                {isArabic ? 'معاينة' : 'Preview'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Packages Card */}
                  {activePackages.length > 0 && (
                    <div className="liquid-glass-card rounded-[28px] p-5 sm:p-6 space-y-3.5">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h2 className="text-base sm:text-lg font-black text-[#161B26] dark:text-white">
                          {isArabic ? 'الباقات التأهيلية المرتبطة' : 'Linked Rehabilitation Packages'}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activePackages.map((pkg) => {
                          const badge = getStatusBadge(pkg.status);
                          return (
                            <div
                              key={pkg.id}
                              className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-emerald-500/20 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-black text-[#161B26] dark:text-white truncate">
                                  {pkg.serviceTitle}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${badge.cls}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#4B5563] dark:text-[#94A3B8] flex items-center justify-between">
                                <span>{pkg.familyMemberName || pkg.childName}</span>
                                <span dir="ltr" className="font-mono">{pkg.referenceNumber}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Linked Bookings History */}
                  <div className="liquid-glass-card rounded-[28px] p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                        <h2 className="text-base sm:text-lg font-black text-[#161B26] dark:text-white">
                          {isArabic ? 'المواعيد والحجوزات المرتبطة بالملف' : 'Linked Bookings & Consultations'}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] tabular-nums">
                          {clientAppointments.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => openPortalBookingForMember(null)}
                          className="px-3 py-1.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-[11px] font-black inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'حجز جديد' : 'New Booking'}</span>
                        </button>
                      </div>
                    </div>

                    {appointmentsError && (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{appointmentsError}</span>
                      </div>
                    )}

                    {appointmentsLoading ? (
                      <div className="py-10 text-center text-xs font-bold text-[#4B5563] dark:text-[#94A3B8]">
                        {isArabic ? 'جاري مزامنة المواعيد من السحابة...' : 'Syncing bookings from Firestore...'}
                      </div>
                    ) : clientAppointments.length === 0 ? (
                      <div className="py-10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#2B95FF]/12 text-[#1263D6] dark:text-[#60AFFF] flex items-center justify-center mx-auto">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-[#161B26] dark:text-white">
                            {isArabic ? 'لا توجد حجوزات مسجلة حتى الآن' : 'No bookings recorded yet'}
                          </p>
                          <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                            {isArabic
                              ? 'يمكنك الحجز مباشرة من داخل بوابة الأسرة وسيظهر الموعد هنا وفي الملف الفرعي للفرد تلقائياً.'
                              : 'Book directly inside the Family Portal and it will sync automatically.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openPortalBookingForMember(null)}
                          className="px-5 py-2.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CalendarCheck className="w-4 h-4" />
                          <span>{isArabic ? 'احجز أول موعد الآن' : 'Book Your First Appointment'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {clientAppointments.map((apt) => {
                          const badge = getStatusBadge(apt.status);
                          return (
                            <div
                              key={apt.id}
                              className="p-4 rounded-2xl bg-white/65 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2.5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-xs font-black text-[#1263D6] dark:text-[#60AFFF] px-2.5 py-1 rounded-lg bg-[#2B95FF]/10">
                                    {apt.referenceNumber}
                                  </span>
                                  <h3 className="text-xs sm:text-sm font-black text-[#161B26] dark:text-white truncate">
                                    {apt.serviceTitle}
                                  </h3>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${badge.cls}`}>
                                  {badge.label}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4B5563] dark:text-[#94A3B8]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                  <span dir="ltr" className="font-mono">{apt.date || '—'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                  <span>{apt.timeSlot || '—'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#2B95FF] shrink-0" />
                                  <span className="truncate">
                                    {[apt.city, apt.branch].filter(Boolean).join(' - ') || (isArabic ? 'مركز رابا' : 'Raba Center')}
                                  </span>
                                </div>
                              </div>

                              {(apt.familyMemberName || apt.childName || apt.notes) && (
                                <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-[#4B5563] dark:text-[#94A3B8] flex flex-wrap gap-3">
                                  {(apt.familyMemberName || apt.childName) && (
                                    <span>
                                      <strong>{isArabic ? 'المستفيد:' : 'Beneficiary:'}</strong>{' '}
                                      {apt.familyMemberName || apt.childName}
                                    </span>
                                  )}
                                  {apt.notes && (
                                    <span className="truncate max-w-full">
                                      <strong>{isArabic ? 'ملاحظات:' : 'Notes:'}</strong> {apt.notes}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* MODAL 1: IN-PORTAL APPOINTMENT BOOKING                             */}
      {/* ================================================================== */}
      {isPortalBookingOpen && clientProfile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsPortalBookingOpen(false)}
        >
          <div
            className="relative glass-modal-dialog bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-gradient-to-l from-[#1463D6]/10 to-transparent shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1463D6]/15 text-[#1463D6] dark:text-[#60AFFF] flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black">
                    {isArabic ? 'حجز موعد من داخل بوابة الأسرة' : 'Book Appointment in Portal'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isArabic ? 'يرتبط الحجز مباشرة بملفك والملف الفرعي للفرد المحدد' : 'Linked directly to your file & selected member'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPortalBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmedBooking ? (
              <div className="p-6 text-center space-y-4 overflow-y-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black">{isArabic ? 'تم تسجيل الحجز في ملفك بنجاح!' : 'Booking Recorded!'}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {isArabic
                      ? `رقم المرجع: ${confirmedBooking.referenceNumber} · المستفيد: ${confirmedBooking.familyMemberName || confirmedBooking.childName}`
                      : `Reference: ${confirmedBooking.referenceNumber} · Beneficiary: ${confirmedBooking.familyMemberName || confirmedBooking.childName}`}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1.5 text-start">
                  <div><strong>{isArabic ? 'البرنامج:' : 'Service:'}</strong> {confirmedBooking.serviceTitle}</div>
                  <div><strong>{isArabic ? 'الفرع:' : 'Branch:'}</strong> {[confirmedBooking.city, confirmedBooking.branch].filter(Boolean).join(' - ')}</div>
                  <div><strong>{isArabic ? 'الموعد:' : 'Date & Time:'}</strong> {confirmedBooking.date} ({confirmedBooking.timeSlot})</div>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={getCustomerWhatsAppMessage(confirmedBooking, isArabic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isArabic ? 'تأكيد عبر الواتساب' : 'Confirm via WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPortalBookingOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 font-bold text-xs cursor-pointer"
                  >
                    {isArabic ? 'العودة لبوابة الأسرة' : 'Back to Portal'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePortalBookingSubmit} className="p-5 space-y-3.5 overflow-y-auto">
                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {isArabic ? 'تحديد الفرد / المستفيد من الملف:' : 'Select Beneficiary / Member:'}
                  </label>
                  <select
                    value={bookingMemberId}
                    onChange={(e) => setBookingMemberId(e.target.value)}
                    className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs sm:text-sm outline-none focus:border-[#2B95FF]"
                  >
                    {(clientProfile.familyMembers || []).map((member, idx) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.relation} · {member.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`})
                      </option>
                    ))}
                    <option value="primary">
                      {clientProfile.fullName} ({isArabic ? 'صاحب الملف الرئيسي' : 'Primary Account Holder'})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {isArabic ? 'نوع الخدمة أو الباقة:' : 'Service or Package:'}
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl gap-1 mb-2 border border-slate-200/60 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setBookingType('service')}
                      className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                        bookingType === 'service'
                          ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isArabic ? 'جلسة تقييم / علاج' : 'Individual Session'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('package')}
                      className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                        bookingType === 'package'
                          ? 'bg-white dark:bg-[#1463D6] text-[#1463D6] dark:text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isArabic ? 'باقة تأهيلية متكاملة' : 'Therapy Package'}
                    </button>
                  </div>

                  {bookingType === 'service' ? (
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs sm:text-sm outline-none"
                    >
                      {SERVICES.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {!isArabic && srv.titleEn ? srv.titleEn : srv.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs sm:text-sm outline-none"
                    >
                      {THERAPY_PACKAGES.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {!isArabic && pkg.nameEn ? pkg.nameEn : pkg.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {isArabic ? 'المدينة:' : 'City:'}
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        const nextCity = e.target.value;
                        setSelectedCity(nextCity);
                        const first = branchesList.find((b) => b.city === nextCity);
                        setSelectedBranchId(first?.id || '');
                      }}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs sm:text-sm outline-none"
                    >
                      {availableCities.map((c) => (
                        <option key={c.key} value={c.key}>
                          {isArabic ? c.labelAr : c.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {isArabic ? 'الفرع:' : 'Branch:'}
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs sm:text-sm outline-none"
                    >
                      {branchesInCity.map((b) => (
                        <option key={b.id} value={b.id}>
                          {getCleanBranchName(b)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {isArabic ? 'التاريخ:' : 'Date:'}
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {isArabic ? 'الفترة:' : 'Time Slot:'}
                    </label>
                    <select
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs outline-none"
                    >
                      {TIME_SLOTS.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {isArabic ? 'ملاحظات (اختياري):' : 'Notes (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder={isArabic ? 'أي تفاصيل إضافية للفريق المختص...' : 'Any extra details...'}
                    className="w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 px-3 text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1668DC] to-[#1152B8] hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{isSubmittingBooking ? (isArabic ? 'جاري الحجز...' : 'Booking...') : (isArabic ? 'تأكيد الحجز الآن' : 'Confirm Booking')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: QUICK ADD FAMILY MEMBER / SUB-FILE                        */}
      {/* ================================================================== */}
      {isAddMemberModalOpen && clientProfile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsAddMemberModalOpen(false)}
        >
          <div
            className="relative glass-modal-dialog bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                <h3 className="text-sm sm:text-base font-black">
                  {isArabic ? 'إضافة فرد / فتح ملف فرعي جديد' : 'Add Family Member Sub-File'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickAddMember} className="p-5 space-y-3.5">
              {addMemberError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200">
                  {addMemberError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">
                  {isArabic ? 'اسم الطفل / الفرد:' : 'Member Name:'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder={isArabic ? 'مثال: سعود محمد' : 'Member full name'}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">{isArabic ? 'صلة القرابة:' : 'Relation:'}</label>
                  <input
                    type="text"
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    placeholder={isArabic ? 'ابن / ابنة' : 'Child'}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{isArabic ? 'تاريخ الميلاد:' : 'Date of Birth:'}</label>
                  <input
                    type="date"
                    value={newMemberDob}
                    onChange={(e) => setNewMemberDob(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{isArabic ? 'الجنس:' : 'Gender:'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMemberGender('male')}
                    className={`h-9 rounded-xl text-xs font-bold border cursor-pointer ${
                      newMemberGender === 'male'
                        ? 'bg-[#1463D6] text-white border-transparent'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isArabic ? 'ذكر' : 'Male'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMemberGender('female')}
                    className={`h-9 rounded-xl text-xs font-bold border cursor-pointer ${
                      newMemberGender === 'female'
                        ? 'bg-[#1463D6] text-white border-transparent'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isArabic ? 'أنثى' : 'Female'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{isArabic ? 'ملاحظات تعريفية (اختياري):' : 'Notes (Optional):'}</label>
                <input
                  type="text"
                  value={newMemberNotes}
                  onChange={(e) => setNewMemberNotes(e.target.value)}
                  placeholder={isArabic ? 'احتياجات خاصة، حساسية، صف دراسي...' : 'Optional brief notes...'}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingMember}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isAddingMember ? (isArabic ? 'جاري الإنشاء...' : 'Creating...') : (isArabic ? 'حفظ وفتح الملف الفرعي' : 'Create Sub-File')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 3: UPLOAD SUPPLEMENTARY SUB-FILE (PARENT)                    */}
      {/* ================================================================== */}
      {isSubfileModalOpen && clientProfile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsSubfileModalOpen(false)}
        >
          <div
            className="relative glass-modal-dialog bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black">
                  {isArabic ? 'إضافة ملف فرعي / مرفق للفرد' : 'Upload Member Sub-File'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubfile} className="p-5 space-y-3.5 overflow-y-auto">
              {subfileError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200">
                  {subfileError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">{isArabic ? 'عنوان المستند / الملف الفرعي:' : 'Document Title:'} *</label>
                <input
                  type="text"
                  required
                  value={subfileTitle}
                  onChange={(e) => setSubfileTitle(e.target.value)}
                  placeholder={isArabic ? 'مثال: تقرير فحص السمع أو خطة المدرسة' : 'e.g., Medical report or school IEP'}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">{isArabic ? 'التصنيف:' : 'Type:'}</label>
                  <select
                    value={subfileType}
                    onChange={(e) => setSubfileType(e.target.value as MemberReportType)}
                    className="w-full h-10 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                  >
                    {REPORT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isArabic ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{isArabic ? 'تاريخ المستند:' : 'Date:'}</label>
                  <input
                    type="date"
                    value={subfileDate}
                    onChange={(e) => setSubfileDate(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{isArabic ? 'رفع ملف (PDF أو صورة حتى 15MB):' : 'Attach File (PDF / Image):'}</label>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-dashed border-slate-300 dark:border-white/15 space-y-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleUploadAttachmentFile}
                    className="block w-full text-xs file:me-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-[#1463D6]/12 file:text-[#1263D6] dark:file:text-[#60AFFF] file:font-black cursor-pointer"
                  />
                  {isUploadingFile && (
                    <div className="text-[11px] font-bold text-[#1263D6] dark:text-[#60AFFF]">
                      {isArabic ? 'جاري رفع الملف بأمان...' : 'Uploading file...'}
                    </div>
                  )}
                  {subfileUrl && (
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="truncate">{subfileName || subfileUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{isArabic ? 'ملخص أو ملاحظات حول الملف:' : 'Summary / Notes:'}</label>
                <textarea
                  rows={3}
                  value={subfileSummary}
                  onChange={(e) => setSubfileSummary(e.target.value)}
                  placeholder={isArabic ? 'أضف تفاصيل مختصرة تساعد الأخصائي في فهم هذا الملف...' : 'Brief summary...'}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSubfile || isUploadingFile}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingSubfile ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ في الملف الفرعي' : 'Save Sub-File')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 4: FULL REPORT / SUB-FILE VIEWER & PRINT                     */}
      {/* ================================================================== */}
      {viewingRecord && clientProfile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setViewingRecord(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            <div className="p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 bg-gradient-to-l from-[#1463D6]/10 to-transparent print:hidden">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#1463D6] dark:text-[#60AFFF]" />
                <div>
                  <span className="text-[10px] font-black text-[#1263D6] dark:text-[#60AFFF] uppercase">
                    {getReportTypeLabel(viewingRecord.reportType)}
                  </span>
                  <h3 className="text-sm sm:text-base font-black">{viewingRecord.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'طباعة' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingRecord(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
                  aria-label={isArabic ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'مركز التأهيل:' : 'Center:'}</div>
                  <div className="font-black">{isArabic ? 'مركز رابا التخصصي' : 'Raba Rehabilitation Center'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'المستفيد:' : 'Member:'}</div>
                  <div className="font-black">{viewingRecord.familyMemberName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'رقم الملف الموحد:' : 'File #:'}</div>
                  <div dir="ltr" className="font-mono font-black text-[#1263D6] dark:text-[#60AFFF]">
                    {clientProfile.fileNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'تاريخ التقرير:' : 'Date:'}</div>
                  <div dir="ltr" className="font-mono font-bold">{viewingRecord.reportDate}</div>
                </div>
                {viewingRecord.specialistName && (
                  <div>
                    <div className="text-[10px] text-slate-500">{isArabic ? 'الأخصائي المسؤول:' : 'Specialist:'}</div>
                    <div className="font-bold">{viewingRecord.specialistName}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-slate-500">{isArabic ? 'المصدر:' : 'Source:'}</div>
                  <div className="font-bold">
                    {viewingRecord.authorRole === 'admin'
                      ? isArabic
                        ? 'الفريق الإكلينيكي بالمركز'
                        : 'Center Clinical Team'
                      : isArabic
                      ? 'مرفق ولي الأمر'
                      : 'Parent Attachment'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-500 dark:text-slate-400">
                  {isArabic ? 'ملخص التقييم والتقرير الإكلينيكي' : 'Clinical Summary & Findings'}
                </h4>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {viewingRecord.summary || '—'}
                </div>
              </div>

              {viewingRecord.recommendations && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    {isArabic ? 'التوصيات والخطوات القادمة' : 'Recommendations & Next Steps'}
                  </h4>
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-emerald-950 dark:text-emerald-100">
                    {viewingRecord.recommendations}
                  </div>
                </div>
              )}

              {viewingRecord.fileUrl && (
                <div className="p-3.5 rounded-2xl bg-[#1463D6]/8 border border-[#1463D6]/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold min-w-0">
                    <Paperclip className="w-4 h-4 text-[#1463D6] dark:text-[#60AFFF] shrink-0" />
                    <span className="truncate">{viewingRecord.fileName || viewingRecord.fileUrl}</span>
                  </div>
                  <a
                    href={viewingRecord.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#1463D6] text-white text-xs font-black inline-flex items-center gap-1.5 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'فتح / تحميل المرفق' : 'Open Attachment'}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortalPage;
