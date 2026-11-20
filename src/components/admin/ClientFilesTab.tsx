import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  RefreshCw,
  FileBadge,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Plus,
  Trash2,
  Package,
  FolderHeart,
  Clock,
  MapPin,
  Edit3,
  FileText,
  FolderOpen,
  Paperclip,
  Stethoscope,
  Upload,
  ExternalLink,
  UserPlus,
  Lock,
  MessageSquareWarning,
} from 'lucide-react';
import {
  AdminUser,
  Appointment,
  ClientProfile,
  FamilyMember,
  MemberRecord,
  MemberRecordCategory,
  MemberReportType,
  PermissionId,
  Specialist,
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  subscribeAllClients,
  getAllClientsFromFirestore,
  adminCreateClientProfileInFirestore,
  updateClientProfileInFirestore,
  deleteClientProfileFromFirestore,
  sortClientsNewestFirst,
  getClientAppointmentsFromFirestore,
  subscribeMemberRecords,
  createMemberRecordInFirestore,
  updateMemberRecordInFirestore,
  deleteMemberRecordFromFirestore,
  subscribeSpecialists,
  formatFirestoreUiError,
} from '../../services/firestoreService';
import { SPECIALISTS } from '../../data/mockData';
import { getStoredAdminUsers } from '../../data/adminData';
import {
  deduplicateSpecialists,
  isSameSpecialist,
  normalizeSpecialistName,
} from '../../utils/specialistDeduplication';

const ADMIN_REPORT_TYPES: { value: MemberReportType; labelAr: string; labelEn: string }[] = [
  { value: 'developmental_assessment', labelAr: 'تقييم نمائي وتشخيصي', labelEn: 'Developmental Assessment' },
  { value: 'aba_progress', labelAr: 'تقرير تقدم ABA', labelEn: 'ABA Progress Report' },
  { value: 'speech_therapy', labelAr: 'تقرير نطق وتخاطب', labelEn: 'Speech Therapy Report' },
  { value: 'occupational_therapy', labelAr: 'تقرير علاج وظيفي', labelEn: 'Occupational Therapy Report' },
  { value: 'iep_plan', labelAr: 'خطة تربوية فردية (IEP)', labelEn: 'Individualized Plan (IEP)' },
  { value: 'medical_file', labelAr: 'ملف طبي / فحوصات', labelEn: 'Medical File / Labs' },
  { value: 'school_report', labelAr: 'تقرير مدرسي / دمج', labelEn: 'School / Inclusion Report' },
  { value: 'other', labelAr: 'مستند / تقرير عام', labelEn: 'General Document / Report' },
];

interface ClientFilesTabProps {
  appointments: Appointment[];
  specialists?: Specialist[];
  adminUsers?: AdminUser[];
  currentUser?: AdminUser;
  hasPermission: (perm: PermissionId) => boolean;
  isFirebaseAuthenticated?: boolean;
  firebaseAuthEmail?: string | null;
}

export const ClientFilesTab: React.FC<ClientFilesTabProps> = ({
  appointments,
  specialists,
  adminUsers,
  currentUser,
  hasPermission,
  isFirebaseAuthenticated = false,
}) => {
  const { isArabic } = useLanguage();

  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [clientLiveAppointments, setClientLiveAppointments] = useState<Appointment[]>([]);
  const [isLoadingClientAppointments, setIsLoadingClientAppointments] = useState(false);

  // Create New Client Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFullName, setCreateFullName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createGender, setCreateGender] = useState<'male' | 'female'>('male');
  const [createDob, setCreateDob] = useState('');
  const [createAdminNotes, setCreateAdminNotes] = useState('');
  const [createFamilyMembers, setCreateFamilyMembers] = useState<FamilyMember[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // Status Toggle (Activate / Suspend with Comment) Modal State
  const [statusModalClient, setStatusModalClient] = useState<ClientProfile | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [statusModalError, setStatusModalError] = useState<string | null>(null);

  // Super-Admin Delete Confirmation Modal State
  const [deleteModalClient, setDeleteModalClient] = useState<ClientProfile | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  // Editable Drawer State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female'>('male');
  const [editDob, setEditDob] = useState('');
  const [editFamilyMembers, setEditFamilyMembers] = useState<FamilyMember[]>([]);
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Per-Member Reports & Sub-Files Drawer State
  const [drawerTab, setDrawerTab] = useState<'overview' | 'records'>('overview');
  const [clientMemberRecords, setClientMemberRecords] = useState<MemberRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [selectedRecordMemberFilter, setSelectedRecordMemberFilter] = useState<string>('all');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recMemberId, setRecMemberId] = useState<string>('');
  const [recCategory, setRecCategory] = useState<MemberRecordCategory>('report');
  const [recType, setRecType] = useState<MemberReportType>('developmental_assessment');
  const [recTitle, setRecTitle] = useState('');
  const [recSpecialistName, setRecSpecialistName] = useState('');
  const [recDate, setRecDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [recSummary, setRecSummary] = useState('');
  const [recRecommendations, setRecRecommendations] = useState('');
  const [recFileUrl, setRecFileUrl] = useState('');
  const [recFileName, setRecFileName] = useState('');
  const [isUploadingRecFile, setIsUploadingRecFile] = useState(false);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  const isActiveStaff = !currentUser || currentUser.status !== 'suspended';
  const isSystemAdmin = currentUser?.role === 'super_admin' && currentUser?.status !== 'suspended';
  const canAddClient = isActiveStaff;
  const canToggleStatus = isActiveStaff; // All active dashboard users can activate/deactivate client files
  const canDeleteClient = isSystemAdmin; // Strictly system super admin only
  const canManage = hasPermission('manage_appointments') || hasPermission('manage_users');

  // Live Specialists Sources (Props + LocalStorage/Defaults + Firestore Realtime)
  const [cloudSpecialists, setCloudSpecialists] = useState<Specialist[]>([]);
  const [storedSpecialistsVersion, setStoredSpecialistsVersion] = useState(0);

  useEffect(() => {
    const bump = () => setStoredSpecialistsVersion((v) => v + 1);
    window.addEventListener('raba_specialists_updated', bump);
    window.addEventListener('raba_persistent_sync_ready', bump);
    return () => {
      window.removeEventListener('raba_specialists_updated', bump);
      window.removeEventListener('raba_persistent_sync_ready', bump);
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeSpecialists(
      (list) => {
        if (Array.isArray(list)) {
          setCloudSpecialists(list);
        }
      },
      () => {
        // Non-blocking fallback to prop/local specialists list
      }
    );
    return () => unsub();
  }, []);

  const activeSpecialists = useMemo(() => {
    let baseList: Specialist[] = [];
    if (Array.isArray(specialists) && specialists.length > 0) {
      baseList = specialists;
    } else {
      try {
        const raw = localStorage.getItem('raba_specialists');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            baseList = parsed;
          }
        }
      } catch {
        // ignore
      }
      if (baseList.length === 0) {
        baseList = SPECIALISTS;
      }
    }

    const isRecordActive = (
      item: Specialist & {
        status?: string;
        isActive?: boolean;
        enabled?: boolean;
        isHidden?: boolean;
      }
    ): boolean => {
      if (!item || typeof item.name !== 'string' || !item.name.trim()) return false;
      const st = (item.status || '').toLowerCase();
      if (st === 'suspended' || st === 'inactive' || st === 'disabled') return false;
      if (item.isActive === false || item.enabled === false || item.isHidden === true) return false;
      return true;
    };

    const combinedRaw = [...cloudSpecialists, ...baseList];
    const activeDirectory = deduplicateSpecialists(combinedRaw.filter(isRecordActive));

    // Include active clinical supervisor users if not already in activeDirectory
    const usersPool = Array.isArray(adminUsers) && adminUsers.length > 0 ? adminUsers : getStoredAdminUsers();
    const suspendedKeys = new Set(
      usersPool
        .filter((u) => u.status === 'suspended' && u.role === 'clinical_supervisor')
        .map((u) => normalizeSpecialistName(u.name))
    );

    const activeFiltered = activeDirectory.filter((spec) => {
      const specTokens = normalizeSpecialistName(spec.name).split(' ').filter(Boolean);
      for (const suspName of suspendedKeys) {
        if (!suspName) continue;
        const suspTokens = suspName.split(' ').filter(Boolean);
        if (
          specTokens.length >= 2 &&
          suspTokens.length >= 2 &&
          specTokens[0] === suspTokens[0] &&
          specTokens[specTokens.length - 1] === suspTokens[suspTokens.length - 1]
        ) {
          return false;
        }
      }
      return true;
    });

    const mergedList: Specialist[] = [...activeFiltered];
    usersPool
      .filter((u) => u.status === 'active' && u.role === 'clinical_supervisor' && u.name.trim())
      .forEach((u) => {
        const uNorm = normalizeSpecialistName(u.name);
        const uTokens = uNorm.split(' ').filter(Boolean);
        const alreadyExists = mergedList.some((existing) => {
          if (isSameSpecialist({ id: existing.id, name: existing.name }, { id: u.id, name: u.name })) {
            return true;
          }
          const eTokens = normalizeSpecialistName(existing.name).split(' ').filter(Boolean);
          return (
            uTokens.length >= 2 &&
            eTokens.length >= 2 &&
            uTokens[0] === eTokens[0] &&
            uTokens[uTokens.length - 1] === eTokens[eTokens.length - 1]
          );
        });
        if (!alreadyExists) {
          mergedList.push({
            id: u.id,
            name: u.name.trim(),
            nameEn: u.nameEn?.trim() || u.name.trim(),
            title: u.roleTitleAr || 'أخصائي سريري',
            titleEn: u.roleTitleEn || 'Clinical Specialist',
            role: u.roleTitleAr || 'أخصائي سريري',
            avatar: u.avatar || '',
            experienceYears: 5,
            licenseNumber: '',
            specialties: [],
            education: [],
            bio: '',
            certifications: [],
            availableDays: [],
            rating: 5,
            reviewsCount: 0,
            sessionPrice: 0,
          });
        }
      });

    return mergedList;
  }, [specialists, cloudSpecialists, adminUsers, storedSpecialistsVersion]);

  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    setIsLoading(true);
    setSyncError(null);
    const unsub = subscribeAllClients(
      (list) => {
        setClients(list);
        setIsLoading(false);
        setSyncError(null);
        // Keep drawer synced if currently viewing a client
        setSelectedClient((prev) => {
          if (!prev) return null;
          const updated = list.find((c) => c.uid === prev.uid);
          return updated || prev;
        });
      },
      (err) => {
        setIsLoading(false);
        const formatted = formatFirestoreUiError(
          err,
          isArabic,
          'تعذر مزامنة ملفات العملاء من قاعدة البيانات السحابية.',
          'Failed to sync client files from Cloud Firestore.'
        );
        setSyncError(formatted.message);
      }
    );

    return () => unsub();
  }, [isFirebaseAuthenticated, isArabic]);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    setSyncError(null);
    try {
      const list = await getAllClientsFromFirestore();
      setClients(list);
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر تحديث قائمة العملاء من قاعدة البيانات السحابية.',
        'Failed to refresh client files.'
      );
      setSyncError(formatted.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getLinkedAppointmentsForClient = (client: ClientProfile): Appointment[] => {
    const cleanClientPhone = (client.phone || '').replace(/\D/g, '').slice(-9);
    const map = new Map<string, Appointment>();

    appointments.forEach((apt) => {
      const uidMatch = apt.userId === client.uid || apt.clientId === client.uid;
      const cleanAptPhone = (apt.guardianPhone || '').replace(/\D/g, '').slice(-9);
      const phoneMatch = cleanClientPhone.length >= 9 && cleanAptPhone === cleanClientPhone;
      if (uidMatch || phoneMatch) {
        map.set(apt.id, apt);
      }
    });

    return Array.from(map.values());
  };

  useEffect(() => {
    if (!selectedClient?.uid) {
      setClientMemberRecords([]);
      setRecordsError(null);
      setRecordsLoading(false);
      return;
    }

    setRecordsLoading(true);
    setRecordsError(null);
    const unsub = subscribeMemberRecords(
      selectedClient.uid,
      (records) => {
        setClientMemberRecords(records);
        setRecordsLoading(false);
        setRecordsError(null);
      },
      (err) => {
        setRecordsLoading(false);
        const formatted = formatFirestoreUiError(
          err,
          isArabic,
          'تعذر تحميل تقارير وملفات المستفيدين.',
          'Failed to load member reports and sub-files.'
        );
        setRecordsError(formatted.message);
      }
    );

    return () => unsub();
  }, [selectedClient?.uid, isFirebaseAuthenticated, isArabic]);

  const resetRecordForm = (defaultMemberId?: string) => {
    setEditingRecordId(null);
    setRecMemberId(
      defaultMemberId ||
        selectedClient?.familyMembers?.[0]?.id ||
        (selectedClient ? `primary-${selectedClient.uid}` : '')
    );
    setRecCategory('report');
    setRecType('developmental_assessment');
    setRecTitle('');
    setRecSpecialistName('');
    setRecDate(new Date().toISOString().split('T')[0]);
    setRecSummary('');
    setRecRecommendations('');
    setRecFileUrl('');
    setRecFileName('');
  };

  const openClientDrawer = async (client: ClientProfile) => {
    setSelectedClient(client);
    setDrawerTab('overview');
    setSelectedRecordMemberFilter('all');
    setRecordsError(null);
    setIsEditingDetails(false);
    setEditFullName(client.fullName || '');
    setEditPhone(client.phone || '');
    setEditEmail(client.email || '');
    setEditGender(client.gender || 'male');
    setEditDob(client.dob || '');
    setEditFamilyMembers(Array.isArray(client.familyMembers) ? client.familyMembers : []);
    setEditAdminNotes(client.adminNotes || '');
    setEditingRecordId(null);
    setRecMemberId(client.familyMembers?.[0]?.id || `primary-${client.uid}`);
    setRecCategory('report');
    setRecType('developmental_assessment');
    setRecTitle('');
    setRecSpecialistName('');
    setRecDate(new Date().toISOString().split('T')[0]);
    setRecSummary('');
    setRecRecommendations('');
    setRecFileUrl('');
    setRecFileName('');

    const propMatches = getLinkedAppointmentsForClient(client);
    setClientLiveAppointments(propMatches);

    setIsLoadingClientAppointments(true);
    try {
      const liveDocs = await getClientAppointmentsFromFirestore(client.uid);
      const merged = new Map<string, Appointment>();
      liveDocs.forEach((d) => merged.set(d.id, d));
      propMatches.forEach((d) => {
        if (!merged.has(d.id)) merged.set(d.id, d);
      });
      setClientLiveAppointments(Array.from(merged.values()));
    } catch {
      // Fallback already populated from appointments prop
    } finally {
      setIsLoadingClientAppointments(false);
    }
  };

  const handleUploadRecordAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast('error', isArabic ? 'حجم الملف يتجاوز 15 ميغابايت.' : 'File exceeds 15MB limit.');
      e.target.value = '';
      return;
    }

    setIsUploadingRecFile(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(isArabic ? 'تعذر قراءة الملف المحدد.' : 'Failed to read selected file.'));
        reader.readAsDataURL(file);
      });
      const resp = await fetch('/api/sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, fileData: dataUrl }),
      });
      let json: any = null;
      try {
        json = await resp.json();
      } catch {
        json = null;
      }
      if (!resp.ok || !json?.success || !json?.url) {
        throw new Error(
          json?.error ||
            (isArabic ? 'تعذر رفع المرفق إلى الخادم. تأكد من نوع وحجم الملف.' : 'Upload failed on server.')
        );
      }
      setRecFileUrl(json.url);
      setRecFileName(file.name);
      showToast('success', isArabic ? 'تم رفع المرفق بنجاح.' : 'Attachment uploaded.');
    } catch (err: any) {
      showToast('error', err?.message || (isArabic ? 'فشل رفع الملف.' : 'Upload failed.'));
    } finally {
      setIsUploadingRecFile(false);
      e.target.value = '';
    }
  };

  const handleSaveMemberRecord = async () => {
    if (!selectedClient || !canManage) return;

    const availableMembers = selectedClient.familyMembers || [];
    const matchedMember = availableMembers.find((m) => m.id === recMemberId);
    const targetMemberId = matchedMember ? matchedMember.id : `primary-${selectedClient.uid}`;
    const targetMemberName = (matchedMember ? matchedMember.name : selectedClient.fullName).trim() || selectedClient.fileNumber;

    const cleanTitle = recTitle.trim();
    if (cleanTitle.length < 2 || cleanTitle.length > 200) {
      showToast(
        'error',
        isArabic
          ? 'يرجى إدخال عنوان صحيح للتقرير أو الملف (من 2 إلى 200 حرف).'
          : 'Please enter a valid title (2-200 characters).'
      );
      return;
    }

    if (recFileUrl.trim().length > 1000) {
      showToast('error', isArabic ? 'رابط المرفق أطول من الحد المسموح.' : 'Attachment URL is too long.');
      return;
    }

    const validDate = recDate.trim().length >= 4 ? recDate.trim().slice(0, 30) : new Date().toISOString().split('T')[0];

    setIsSavingRecord(true);
    try {
      if (editingRecordId) {
        await updateMemberRecordInFirestore(selectedClient.uid, editingRecordId, {
          familyMemberId: targetMemberId,
          familyMemberName: targetMemberName,
          reportType: recType,
          title: cleanTitle,
          summary: recSummary.trim().slice(0, 6000) || (isArabic ? 'تم التحديث من لوحة الإدارة' : 'Updated by administration'),
          recommendations: recRecommendations.trim().slice(0, 4000),
          specialistName: recSpecialistName.trim().slice(0, 150),
          reportDate: validDate,
          fileUrl: recFileUrl.trim(),
          fileName: recFileName.trim().slice(0, 250),
        });
        showToast('success', isArabic ? 'تم تحديث التقرير بنجاح.' : 'Report updated successfully.');
      } else {
        await createMemberRecordInFirestore(selectedClient.uid, {
          familyMemberId: targetMemberId,
          familyMemberName: targetMemberName,
          recordCategory: recCategory,
          reportType: recType,
          title: cleanTitle,
          summary: recSummary.trim().slice(0, 6000) || (isArabic ? 'تقرير صادر عن مركز رابا التخصصي' : 'Issued by Raba Specialist Center'),
          recommendations: recRecommendations.trim().slice(0, 4000) || undefined,
          specialistName: recSpecialistName.trim().slice(0, 150) || undefined,
          reportDate: validDate,
          fileUrl: recFileUrl.trim() || undefined,
          fileName: recFileName.trim().slice(0, 250) || undefined,
          authorRole: 'admin',
        });
        showToast(
          'success',
          isArabic
            ? `تم نشر ${recCategory === 'report' ? 'التقرير' : 'الملف الفرعي'} في حساب (${targetMemberName}).`
            : 'Record published to member sub-file.'
        );
      }
      resetRecordForm(targetMemberId);
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر حفظ التقرير في قاعدة البيانات السحابية.',
        'Failed to save record in Cloud Firestore.'
      );
      showToast('error', formatted.message);
    } finally {
      setIsSavingRecord(false);
    }
  };

  const handleEditMemberRecord = (rec: MemberRecord) => {
    setEditingRecordId(rec.id);
    setRecMemberId(rec.familyMemberId);
    setRecCategory(rec.recordCategory);
    setRecType(rec.reportType);
    setRecTitle(rec.title);
    setRecSpecialistName(rec.specialistName || '');
    setRecDate(rec.reportDate || new Date().toISOString().split('T')[0]);
    setRecSummary(rec.summary || '');
    setRecRecommendations(rec.recommendations || '');
    setRecFileUrl(rec.fileUrl || '');
    setRecFileName(rec.fileName || '');
    setDrawerTab('records');
  };

  const handleDeleteMemberRecord = async (rec: MemberRecord) => {
    if (!selectedClient || !canDeleteClient) return;
    setDeletingRecordId(rec.id);
    try {
      await deleteMemberRecordFromFirestore(selectedClient.uid, rec.id);
      if (editingRecordId === rec.id) {
        resetRecordForm();
      }
      showToast('success', isArabic ? 'تم حذف السجل بنجاح.' : 'Record deleted.');
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر حذف السجل من قاعدة البيانات.',
        'Failed to delete record.'
      );
      showToast('error', formatted.message);
    } finally {
      setDeletingRecordId(null);
    }
  };

  const getReportTypeLabel = (type: MemberReportType): string => {
    const found = ADMIN_REPORT_TYPES.find((opt) => opt.value === type);
    if (!found) return isArabic ? 'تقرير' : 'Report';
    return isArabic ? found.labelAr : found.labelEn;
  };

  const handleSaveClientDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !canManage) return;

    const cleanFullName = editFullName.trim();
    const cleanPhone = editPhone.trim();
    const cleanEmail = editEmail.trim();
    const cleanDob = editDob.trim();

    if (cleanFullName.length < 2 || cleanFullName.length > 150) {
      showToast('error', isArabic ? 'يرجى إدخال الاسم الكامل (حرفين على الأقل).' : 'Full name must be 2-150 characters.');
      return;
    }
    if (cleanPhone.length < 7 || cleanPhone.length > 35) {
      showToast('error', isArabic ? 'يرجى إدخال رقم جوال صحيح (7 أرقام على الأقل).' : 'Phone number must be 7-35 characters.');
      return;
    }
    if (cleanEmail.length < 3 || !cleanEmail.includes('@')) {
      showToast('error', isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (cleanDob.length < 4) {
      showToast('error', isArabic ? 'يرجى تحديد تاريخ ميلاد العميل.' : 'Please specify a valid date of birth.');
      return;
    }

    const nonEmptyMembers = editFamilyMembers.filter((m) => m.name.trim().length > 0);
    if (nonEmptyMembers.length > 20) {
      showToast('error', isArabic ? 'الحد الأقصى لعدد أفراد الأسرة هو 20 فرداً.' : 'Maximum of 20 family members allowed.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanedMembers = nonEmptyMembers.map((m, idx) => ({
        ...m,
        name: m.name.trim().slice(0, 150),
        relation: m.relation.trim() || (isArabic ? 'طفل مستفيد' : 'Child / Dependent'),
        dob: (m.dob || '').trim(),
        gender: m.gender === 'female' ? ('female' as const) : ('male' as const),
        subFileNumber: m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`,
      }));

      await updateClientProfileInFirestore(selectedClient.uid, {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        gender: editGender,
        dob: cleanDob,
        familyMembers: cleanedMembers,
        adminNotes: editAdminNotes.slice(0, 4000),
      });

      const updated: ClientProfile = {
        ...selectedClient,
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        gender: editGender,
        dob: cleanDob,
        familyMembers: cleanedMembers,
        adminNotes: editAdminNotes.slice(0, 4000),
      };
      setSelectedClient(updated);
      setClients((prev) => prev.map((c) => (c.uid === updated.uid ? updated : c)));
      setIsEditingDetails(false);
      showToast('success', isArabic ? 'تم حفظ تحديثات ملف العميل بنجاح.' : 'Client file updated successfully.');
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر حفظ تعديلات ملف العميل في قاعدة البيانات.',
        'Failed to save client file changes.'
      );
      showToast('error', formatted.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetCreateForm = () => {
    setCreateFullName('');
    setCreatePhone('');
    setCreateEmail('');
    setCreateGender('male');
    setCreateDob('');
    setCreateAdminNotes('');
    setCreateFamilyMembers([]);
    setCreateError(null);
  };

  const handleOpenCreateModal = () => {
    if (!canAddClient) return;
    resetCreateForm();
    setShowCreateModal(true);
  };

  const handleCreateClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddClient) return;
    setCreateError(null);

    const cleanFullName = createFullName.trim();
    const cleanPhone = createPhone.trim();
    const cleanEmail = createEmail.trim();
    const cleanDob = createDob.trim();

    if (cleanFullName.length < 2 || cleanFullName.length > 150) {
      setCreateError(isArabic ? 'يرجى إدخال الاسم الكامل للعميل (حرفان على الأقل).' : 'Full name must be 2–150 characters.');
      return;
    }
    if (cleanPhone.length < 7 || cleanPhone.length > 35) {
      setCreateError(isArabic ? 'يرجى إدخال رقم جوال صحيح (7 أرقام على الأقل).' : 'Phone number must be 7–35 characters.');
      return;
    }
    if (cleanEmail.length < 3 || !cleanEmail.includes('@') || cleanEmail.length > 150) {
      setCreateError(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (cleanDob.length < 4) {
      setCreateError(isArabic ? 'يرجى تحديد تاريخ الميلاد.' : 'Please specify date of birth.');
      return;
    }

    const nonEmptyMembers = createFamilyMembers.filter((m) => m.name.trim().length > 0);
    if (nonEmptyMembers.length > 20) {
      setCreateError(isArabic ? 'الحد الأقصى لعدد أفراد الأسرة المضافين هو 20 فرداً.' : 'Maximum of 20 family members allowed.');
      return;
    }

    setIsCreatingClient(true);
    try {
      const created = await adminCreateClientProfileInFirestore({
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        gender: createGender,
        dob: cleanDob,
        adminNotes: createAdminNotes.trim(),
        familyMembers: nonEmptyMembers.map((m, idx) => ({
          ...m,
          name: m.name.trim().slice(0, 150),
          relation: m.relation.trim() || (isArabic ? 'طفل مستفيد' : 'Child / Dependent'),
          dob: (m.dob || '').trim(),
          gender: m.gender === 'female' ? ('female' as const) : ('male' as const),
          subFileNumber: m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`,
        })),
        status: 'active',
      });

      setClients((prev) => {
        if (prev.some((c) => c.uid === created.uid)) return prev;
        return sortClientsNewestFirst([created, ...prev]);
      });
      setShowCreateModal(false);
      resetCreateForm();
      showToast(
        'success',
        isArabic
          ? `تم إنشاء ملف العميل الجديد (${created.fileNumber}) بنجاح.`
          : `Client file (${created.fileNumber}) created successfully.`
      );
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر إنشاء ملف العميل الجديد في قاعدة البيانات السحابية.',
        'Failed to create client file in Cloud Firestore.'
      );
      setCreateError(formatted.message);
    } finally {
      setIsCreatingClient(false);
    }
  };

  const openStatusToggleModal = (client: ClientProfile) => {
    if (!canToggleStatus) return;
    setStatusModalClient(client);
    setStatusComment('');
    setStatusModalError(null);
  };

  const handleConfirmStatusToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalClient || !canToggleStatus) return;
    setStatusModalError(null);

    const isSuspending = statusModalClient.status === 'active';
    const cleanComment = statusComment.trim();

    if (isSuspending && cleanComment.length < 3) {
      setStatusModalError(
        isArabic
          ? 'يرجى كتابة تعليق واضح يوضح سبب إيقاف تنشيط الملف (3 أحرف على الأقل).'
          : 'Please enter a clear reason explaining why this file is being suspended.'
      );
      return;
    }

    const nextStatus: 'active' | 'suspended' = isSuspending ? 'suspended' : 'active';
    const actorName = currentUser?.name || (isArabic ? 'الإدارة' : 'Admin');
    const nowIso = new Date().toISOString();

    let nextAdminNotes = statusModalClient.adminNotes || '';
    if (!isSuspending && cleanComment) {
      const auditLine = `[${isArabic ? 'إعادة تنشيط' : 'Reactivated'} - ${actorName} (${nowIso.slice(0, 10)})]: ${cleanComment}`;
      nextAdminNotes = nextAdminNotes ? `${auditLine}\n${nextAdminNotes}` : auditLine;
    } else if (isSuspending) {
      const auditLine = `[${isArabic ? 'إيقاف تنشيط' : 'Suspended'} - ${actorName} (${nowIso.slice(0, 10)})]: ${cleanComment}`;
      nextAdminNotes = nextAdminNotes ? `${auditLine}\n${nextAdminNotes}` : auditLine;
    }

    setIsSaving(true);
    try {
      await updateClientProfileInFirestore(statusModalClient.uid, {
        status: nextStatus,
        suspensionReason: isSuspending ? cleanComment.slice(0, 1000) : '',
        suspendedAt: isSuspending ? nowIso : '',
        suspendedBy: isSuspending ? actorName.slice(0, 150) : '',
        adminNotes: nextAdminNotes.slice(0, 4000),
      });

      const updated: ClientProfile = {
        ...statusModalClient,
        status: nextStatus,
        suspensionReason: isSuspending ? cleanComment.slice(0, 1000) : '',
        suspendedAt: isSuspending ? nowIso : '',
        suspendedBy: isSuspending ? actorName.slice(0, 150) : '',
        adminNotes: nextAdminNotes.slice(0, 4000),
      };
      setClients((prev) => prev.map((c) => (c.uid === statusModalClient.uid ? updated : c)));
      if (selectedClient?.uid === statusModalClient.uid) {
        setSelectedClient(updated);
        setEditAdminNotes(updated.adminNotes || '');
      }
      setStatusModalClient(null);
      setStatusComment('');
      showToast(
        'success',
        nextStatus === 'active'
          ? isArabic
            ? 'تم إعادة تنشيط ملف العميل بنجاح.'
            : 'Client file activated.'
          : isArabic
          ? 'تم إيقاف تنشيط ملف العميل وحفظ سبب الإيقاف.'
          : 'Client file suspended with reason recorded.'
      );
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر تغيير حالة ملف العميل.',
        'Failed to update client status.'
      );
      setStatusModalError(formatted.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteClient = async () => {
    if (!deleteModalClient || !canDeleteClient) return;
    setIsDeletingClient(true);
    const target = deleteModalClient;
    try {
      await deleteClientProfileFromFirestore(target.uid);
      setClients((prev) => prev.filter((c) => c.uid !== target.uid));
      if (selectedClient?.uid === target.uid) {
        setSelectedClient(null);
      }
      setDeleteModalClient(null);
      showToast(
        'success',
        isArabic
          ? `تم حذف ملف العميل (${target.fileNumber}) نهائياً من النظام.`
          : `Client file (${target.fileNumber}) permanently deleted.`
      );
    } catch (err: any) {
      const formatted = formatFirestoreUiError(
        err,
        isArabic,
        'تعذر حذف ملف العميل. تأكد من تسجيل الدخول بصلاحيات الأدمن الرئيسي للنظام.',
        'Failed to delete client file. System super-admin privileges are required.'
      );
      showToast('error', formatted.message);
    } finally {
      setIsDeletingClient(false);
    }
  };

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return clients.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        (c.fullName || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.fileNumber || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    });
  }, [clients, searchQuery, statusFilter]);

  const activeCount = clients.filter((c) => c.status === 'active').length;
  const suspendedCount = clients.filter((c) => c.status === 'suspended').length;
  const linkedBookingsTotal = useMemo(
    () => clients.reduce((sum, c) => sum + getLinkedAppointmentsForClient(c).length, 0),
    [clients, appointments]
  );

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
    return d.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="liquid-glass-card rounded-[26px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1463D6]/12 text-[#1463D6] dark:text-[#60AFFF] flex items-center justify-center shrink-0">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {isArabic ? 'إدارة ملفات العملاء والأسر' : 'Client Files Management'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isArabic
                ? 'استعراض وإضافة وإدارة ملفات العملاء، التحكم في تنشيط وإيقاف الملفات مع التوضيح، والحجوزات المرتبطة.'
                : 'View, create, and manage client files, activation status with reason notes, linked bookings, and sub-files.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          {canAddClient && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إضافة ملف جديد' : 'Add New File'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isArabic ? 'تحديث الملفات' : 'Refresh Files'}</span>
          </button>
        </div>
      </div>

      {syncError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{syncError}</span>
          </div>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-rose-600/15 hover:bg-rose-600/25 text-rose-700 dark:text-rose-200 text-[11px] font-black shrink-0 cursor-pointer"
          >
            {isArabic ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="liquid-glass-card rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {isArabic ? 'إجمالي الملفات' : 'Total Client Files'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {clients.length}
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {isArabic ? 'الملفات النشطة' : 'Active Accounts'}
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {activeCount}
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {isArabic ? 'الملفات الموقوفة' : 'Suspended Accounts'}
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {suspendedCount}
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {isArabic ? 'الحجوزات المرتبطة' : 'Linked Bookings'}
          </div>
          <div className="text-2xl font-black text-[#1263D6] dark:text-[#60AFFF] mt-1 tabular-nums">
            {linkedBookingsTotal}
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="liquid-glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'بحث بالاسم، رقم الجوال، رقم الملف (FILE-...) أو البريد...'
                : 'Search by name, phone, file number, or email...'
            }
            className="w-full h-10 ps-10 pe-4 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs sm:text-sm outline-none focus:border-[#2E86EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          {(['all', 'active', 'suspended'] as const).map((statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setStatusFilter(statusKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                statusFilter === statusKey
                  ? 'bg-[#1463D6] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {statusKey === 'all'
                ? isArabic
                  ? 'الكل'
                  : 'All'
                : statusKey === 'active'
                ? isArabic
                  ? 'نشط'
                  : 'Active'
                : isArabic
                ? 'موقوف'
                : 'Suspended'}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table / Cards */}
      <div className="liquid-glass-card rounded-[26px] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
            {isArabic ? 'جاري تحميل ملفات العملاء من Firestore...' : 'Loading client files from Firestore...'}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-black text-slate-700 dark:text-slate-200">
              {isArabic ? 'لا توجد ملفات عملاء مطابقة للبحث' : 'No matching client files found'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isArabic
                ? 'سيظهر هنا كل عميل ينشئ ملفه عبر بوابة الأسرة تلقائياً.'
                : 'Any client registering through the Family Portal will appear here automatically.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300">
                    <th className="py-3.5 px-4 text-start font-black">{isArabic ? 'رقم الملف' : 'File #'}</th>
                    <th className="py-3.5 px-4 text-start font-black">{isArabic ? 'اسم العميل والجوال' : 'Client & Phone'}</th>
                    <th className="py-3.5 px-4 text-start font-black">{isArabic ? 'تاريخ التسجيل' : 'Registered'}</th>
                    <th className="py-3.5 px-4 text-start font-black">{isArabic ? 'الحجوزات' : 'Bookings'}</th>
                    <th className="py-3.5 px-4 text-start font-black">{isArabic ? 'الحالة' : 'Status'}</th>
                    <th className="py-3.5 px-4 text-end font-black">{isArabic ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/10">
                  {filteredClients.map((client) => {
                    const linkedCount = getLinkedAppointmentsForClient(client).length;
                    return (
                      <tr
                        key={client.uid}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF]">
                            {client.fileNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 dark:text-white">{client.fullName}</div>
                          <div dir="ltr" className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-start">
                            {client.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {formatDate(client.createdAtISO || client.createdAt)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-black tabular-nums">
                            {linkedCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border ${
                                client.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {client.status === 'active'
                                ? isArabic
                                  ? 'نشط'
                                  : 'Active'
                                : isArabic
                                ? 'موقوف'
                                : 'Suspended'}
                            </span>
                            {client.status === 'suspended' && client.suspensionReason && (
                              <p
                                title={client.suspensionReason}
                                className="text-[10px] font-bold text-rose-600 dark:text-rose-300 max-w-[200px] truncate"
                              >
                                {isArabic ? 'السبب: ' : 'Reason: '}
                                {client.suspensionReason}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-end">
                          <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                            {canToggleStatus && (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => openStatusToggleModal(client)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-colors cursor-pointer border ${
                                  client.status === 'active'
                                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/25'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/25'
                                }`}
                              >
                                {client.status === 'active'
                                  ? isArabic
                                    ? 'إيقاف التنشيط'
                                    : 'Deactivate'
                                  : isArabic
                                  ? 'تنشيط'
                                  : 'Activate'}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openClientDrawer(client)}
                              className="px-3.5 py-1.5 rounded-full bg-[#1463D6]/10 hover:bg-[#1463D6] text-[#1263D6] dark:text-[#60AFFF] hover:text-white text-xs font-black transition-colors cursor-pointer"
                            >
                              {isArabic ? 'فتح الملف' : 'Open File'}
                            </button>
                            {canDeleteClient && (
                              <button
                                type="button"
                                onClick={() => setDeleteModalClient(client)}
                                title={isArabic ? 'حذف الملف (صلاحية الأدمن الرئيسي)' : 'Delete File (Super Admin Only)'}
                                aria-label={isArabic ? 'حذف الملف' : 'Delete File'}
                                className="w-8 h-8 rounded-full bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200/70 dark:divide-white/10">
              {filteredClients.map((client) => {
                const linkedCount = getLinkedAppointmentsForClient(client).length;
                return (
                  <div key={client.uid} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF]">
                        {client.fileNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          client.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {client.status === 'active' ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'موقوف' : 'Suspended'}
                      </span>
                    </div>
                    <div>
                      <div className="font-black text-sm text-slate-900 dark:text-white">{client.fullName}</div>
                      <div dir="ltr" className="text-xs font-mono text-slate-500 dark:text-slate-400 text-start">
                        {client.phone}
                      </div>
                    </div>
                    {client.status === 'suspended' && client.suspensionReason && (
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] font-bold text-rose-700 dark:text-rose-300">
                        {isArabic ? 'سبب الإيقاف: ' : 'Reason: '}
                        {client.suspensionReason}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 text-xs pt-1 flex-wrap">
                      <span className="text-slate-500 dark:text-slate-400">
                        {isArabic ? `الحجوزات: ${linkedCount}` : `Bookings: ${linkedCount}`} ·{' '}
                        {formatDate(client.createdAtISO || client.createdAt)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {canToggleStatus && (
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => openStatusToggleModal(client)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-black border cursor-pointer ${
                              client.status === 'active'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/25'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25'
                            }`}
                          >
                            {client.status === 'active'
                              ? isArabic
                                ? 'إيقاف'
                                : 'Suspend'
                              : isArabic
                              ? 'تنشيط'
                              : 'Activate'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openClientDrawer(client)}
                          className="px-3.5 py-1.5 rounded-full bg-[#1463D6] text-white text-xs font-black cursor-pointer"
                        >
                          {isArabic ? 'فتح الملف' : 'Open File'}
                        </button>
                        {canDeleteClient && (
                          <button
                            type="button"
                            onClick={() => setDeleteModalClient(client)}
                            aria-label={isArabic ? 'حذف الملف' : 'Delete File'}
                            className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Full Client File Modal / Drawer */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-l from-[#1463D6]/10 to-transparent shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#1463D6] text-white flex items-center justify-center shrink-0">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#1463D6]/15 text-[#1263D6] dark:text-[#60AFFF]">
                      {selectedClient.fileNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                        selectedClient.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {selectedClient.status === 'active' ? (isArabic ? 'نشط' : 'Active') : isArabic ? 'موقوف' : 'Suspended'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black truncate mt-1">{selectedClient.fullName}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canToggleStatus && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => openStatusToggleModal(selectedClient)}
                    className={`px-3.5 py-2 rounded-full text-xs font-black inline-flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      selectedClient.status === 'active'
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-600 dark:text-rose-300'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-600 dark:text-emerald-300'
                    }`}
                  >
                    {selectedClient.status === 'active' ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'إيقاف التنشيط' : 'Suspend'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'إعادة تنشيط الملف' : 'Activate'}</span>
                      </>
                    )}
                  </button>
                )}

                {canDeleteClient ? (
                  <button
                    type="button"
                    disabled={isDeletingClient}
                    onClick={() => setDeleteModalClient(selectedClient)}
                    className="px-3.5 py-2 rounded-full text-xs font-black inline-flex items-center gap-1.5 cursor-pointer border bg-rose-600/10 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'حذف الملف' : 'Delete File'}</span>
                  </button>
                ) : (
                  <span
                    title={isArabic ? 'الحذف متاح للأدمن الرئيسي للنظام فقط' : 'Deletion restricted to system super admin'}
                    className="px-3 py-2 rounded-full text-[11px] font-bold inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{isArabic ? 'حذف (للأدمن فقط)' : 'Delete (Admin only)'}</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center cursor-pointer"
                  aria-label={isArabic ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedClient.status === 'suspended' && (
              <div className="mx-5 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-rose-500/12 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5 shrink-0">
                <MessageSquareWarning className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="space-y-1">
                  <div className="font-black">
                    {isArabic ? 'الملف متوقف التنشيط حالياً' : 'Client File Currently Suspended'}
                  </div>
                  {selectedClient.suspensionReason && (
                    <div className="font-bold">
                      {isArabic ? 'سبب إيقاف التنشيط: ' : 'Suspension Reason: '}
                      {selectedClient.suspensionReason}
                    </div>
                  )}
                  {(selectedClient.suspendedBy || selectedClient.suspendedAt) && (
                    <div className="text-[11px] opacity-80">
                      {selectedClient.suspendedBy && (
                        <span>
                          {isArabic ? `بواسطة: ${selectedClient.suspendedBy}` : `By: ${selectedClient.suspendedBy}`}
                        </span>
                      )}
                      {selectedClient.suspendedBy && selectedClient.suspendedAt && ' · '}
                      {selectedClient.suspendedAt && <span>{formatDate(selectedClient.suspendedAt)}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Drawer Navigation Tabs */}
            <div className="px-5 sm:px-6 pt-3 pb-0 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-2 bg-slate-50/70 dark:bg-white/[0.02] shrink-0">
              <button
                type="button"
                onClick={() => setDrawerTab('overview')}
                className={`px-4 py-2.5 text-xs font-black border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  drawerTab === 'overview'
                    ? 'border-[#1463D6] text-[#1263D6] dark:text-[#60AFFF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isArabic ? 'البيانات والأسرة والحجوزات' : 'Profile, Family & Bookings'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('records')}
                className={`px-4 py-2.5 text-xs font-black border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  drawerTab === 'records'
                    ? 'border-[#1463D6] text-[#1263D6] dark:text-[#60AFFF]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تقارير الأطفال والملفات الفرعية' : 'Child Reports & Sub-Files'}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] text-[10px]">
                  {clientMemberRecords.length}
                </span>
              </button>
            </div>

            {toast && (
              <div
                className={`mx-5 sm:mx-6 mt-4 p-3 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{toast.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                  aria-label={isArabic ? 'إغلاق التنبيه' : 'Dismiss'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {drawerTab === 'overview' ? (
              /* TAB 1: Profile + Family + Admin Notes + Linked Bookings */
              <form onSubmit={handleSaveClientDrawer} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Profile + Family + Admin Notes */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#2E86EB]" />
                          <span>{isArabic ? 'البيانات الشخصية' : 'Personal Details'}</span>
                        </h4>
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => setIsEditingDetails((prev) => !prev)}
                            className="text-xs font-black text-[#1463D6] dark:text-[#60AFFF] inline-flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isEditingDetails ? (isArabic ? 'معاينة' : 'View') : (isArabic ? 'تعديل البيانات' : 'Edit Info')}</span>
                          </button>
                        )}
                      </div>

                      {isEditingDetails ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            placeholder={isArabic ? 'الاسم الكامل' : 'Full Name'}
                            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs sm:text-sm outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="tel"
                              dir="ltr"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="05XXXXXXXX"
                              className="h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono text-left outline-none"
                            />
                            <input
                              type="date"
                              value={editDob}
                              onChange={(e) => setEditDob(e.target.value)}
                              className="h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono outline-none"
                            />
                          </div>
                          <input
                            type="email"
                            dir="ltr"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono text-left outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setEditGender('male')}
                              className={`h-9 rounded-xl text-xs font-bold border cursor-pointer ${
                                editGender === 'male'
                                  ? 'bg-[#1463D6] text-white border-transparent'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'
                              }`}
                            >
                              {isArabic ? 'ذكر' : 'Male'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditGender('female')}
                              className={`h-9 rounded-xl text-xs font-bold border cursor-pointer ${
                                editGender === 'female'
                                  ? 'bg-[#1463D6] text-white border-transparent'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'
                              }`}
                            >
                              {isArabic ? 'أنثى' : 'Female'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">{isArabic ? 'الجوال:' : 'Phone:'}</span>
                            <span dir="ltr" className="font-mono font-bold">{selectedClient.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">{isArabic ? 'البريد:' : 'Email:'}</span>
                            <span dir="ltr" className="font-mono font-bold truncate max-w-[200px]">{selectedClient.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">{isArabic ? 'الميلاد:' : 'DOB:'}</span>
                            <span dir="ltr" className="font-mono font-bold">{selectedClient.dob || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">{isArabic ? 'الجنس:' : 'Gender:'}</span>
                            <span className="font-bold">
                              {selectedClient.gender === 'female' ? (isArabic ? 'أنثى' : 'Female') : isArabic ? 'ذكر' : 'Male'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Family Members */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#2E86EB]" />
                          <span>{isArabic ? 'أفراد الأسرة / الأبناء' : 'Family Members'}</span>
                        </h4>
                        {canManage && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditFamilyMembers((prev) => [
                                ...prev,
                                {
                                  id: `fam-${Date.now()}`,
                                  name: '',
                                  relation: isArabic ? 'ابن / ابنة' : 'Child',
                                  dob: '',
                                  gender: 'male',
                                  subFileNumber: `SUB-${String(prev.length + 1).padStart(2, '0')}`,
                                },
                              ])
                            }
                            className="text-xs font-black text-[#1463D6] dark:text-[#60AFFF] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'إضافة' : 'Add'}</span>
                          </button>
                        )}
                      </div>

                      {editFamilyMembers.length === 0 ? (
                        <p className="text-xs text-slate-500">{isArabic ? 'لا يوجد أفراد مسجلون.' : 'No family members registered.'}</p>
                      ) : (
                        <div className="space-y-2">
                          {editFamilyMembers.map((m, idx) => (
                            <div key={m.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] font-bold shrink-0">
                                  {m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`}
                                </span>
                                <input
                                  type="text"
                                  disabled={!canManage}
                                  value={m.name}
                                  onChange={(e) =>
                                    setEditFamilyMembers((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                                    )
                                  }
                                  placeholder={isArabic ? 'الاسم' : 'Name'}
                                  className="flex-1 h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRecordMemberFilter(m.id);
                                    setRecMemberId(m.id);
                                    setDrawerTab('records');
                                  }}
                                  className="px-2 h-8 rounded-lg bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] text-[10px] font-black inline-flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <FolderOpen className="w-3 h-3" />
                                  <span>{isArabic ? 'التقارير' : 'Files'}</span>
                                </button>
                                {canManage &&
                                  (canDeleteClient ||
                                    !selectedClient.familyMembers?.some((orig) => orig.id === m.id)) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditFamilyMembers((prev) => prev.filter((_, i) => i !== idx))
                                      }
                                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                                      aria-label={isArabic ? 'حذف' : 'Delete'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  disabled={!canManage}
                                  value={m.relation}
                                  onChange={(e) =>
                                    setEditFamilyMembers((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, relation: e.target.value } : item))
                                    )
                                  }
                                  placeholder={isArabic ? 'القرابة' : 'Relation'}
                                  className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                                />
                                <select
                                  disabled={!canManage}
                                  value={m.gender || 'male'}
                                  onChange={(e) =>
                                    setEditFamilyMembers((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, gender: e.target.value as 'male' | 'female' } : item
                                      )
                                    )
                                  }
                                  className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                                >
                                  <option value="male">{isArabic ? 'ذكر' : 'Male'}</option>
                                  <option value="female">{isArabic ? 'أنثى' : 'Female'}</option>
                                </select>
                                <input
                                  type="date"
                                  disabled={!canManage}
                                  value={m.dob}
                                  onChange={(e) =>
                                    setEditFamilyMembers((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, dob: e.target.value } : item))
                                    )
                                  }
                                  className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[11px] font-mono outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Admin Internal Notes */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2.5">
                      <label className="block text-xs font-black text-slate-600 dark:text-slate-300">
                        {isArabic ? 'ملاحظات الإدارة الإكلينيكية والداخلية' : 'Internal Admin Notes'}
                      </label>
                      <textarea
                        rows={3}
                        disabled={!canManage}
                        value={editAdminNotes}
                        onChange={(e) => setEditAdminNotes(e.target.value)}
                        placeholder={isArabic ? 'أضف ملاحظات إدارية خاصة بمتابعة الملف...' : 'Add internal admin follow-up notes...'}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none focus:border-[#2E86EB]"
                      />
                    </div>
                  </div>

                  {/* Right Column: Active Packages + Live Linked Bookings */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Active Packages */}
                    {clientLiveAppointments.some((a) => a.requestType === 'package') && (
                      <div className="p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 space-y-2.5">
                        <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          <span>{isArabic ? 'الباقات المرتبطة' : 'Linked Packages'}</span>
                        </h4>
                        <div className="space-y-2">
                          {clientLiveAppointments
                            .filter((a) => a.requestType === 'package')
                            .map((pkg) => (
                              <div
                                key={pkg.id}
                                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs"
                              >
                                <span className="font-bold truncate">{pkg.serviceTitle}</span>
                                <span dir="ltr" className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                                  {pkg.referenceNumber}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Linked Bookings */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#2E86EB]" />
                          <span>{isArabic ? 'سجل الحجوزات المرتبطة (Firestore Live)' : 'Linked Bookings (Firestore Live)'}</span>
                        </h4>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF]">
                          {clientLiveAppointments.length}
                        </span>
                      </div>

                      {isLoadingClientAppointments ? (
                        <div className="py-6 text-center text-xs text-slate-500">
                          {isArabic ? 'جاري جلب حجوزات العميل...' : 'Fetching linked bookings...'}
                        </div>
                      ) : clientLiveAppointments.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500">
                          {isArabic ? 'لا توجد حجوزات مرتبطة بهذا الملف بعد.' : 'No linked bookings yet.'}
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                          {clientLiveAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-black text-[#1263D6] dark:text-[#60AFFF]">
                                  {apt.referenceNumber}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-black">
                                  {apt.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 dark:text-white">{apt.serviceTitle}</span>
                                {(apt.familyMemberName || apt.childName) && (
                                  <span className="px-2 py-0.5 rounded bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] text-[10px] font-bold">
                                    {apt.familyMemberName || apt.childName}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span dir="ltr" className="font-mono">{apt.date || '—'}</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{apt.timeSlot || '—'}</span>
                                </span>
                                {(apt.city || apt.branch) && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{[apt.city, apt.branch].filter(Boolean).join(' - ')}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {canManage && (
                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedClient(null)}
                      className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                    >
                      {isArabic ? 'إغلاق' : 'Close'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-full bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التغييرات في Firestore' : 'Save Changes')}</span>
                    </button>
                  </div>
                )}
              </form>
            ) : (
              /* TAB 2: Per-Member Clinical Reports & Sub-Files */
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Authoring Form Panel */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-[#2E86EB]" />
                        <span>
                          {editingRecordId
                            ? isArabic
                              ? 'تعديل التقرير / الملف الفرعي'
                              : 'Edit Report / Sub-File'
                            : isArabic
                            ? 'إضافة تقرير أو ملف فرعي لفرد'
                            : 'Publish Report or Sub-File'}
                        </span>
                      </h4>
                      {editingRecordId && (
                        <button
                          type="button"
                          onClick={() => resetRecordForm()}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          {isArabic ? 'إلغاء التعديل' : 'Cancel Edit'}
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {isArabic ? 'الفرد / المستفيد:' : 'Member:'}
                      </label>
                      <select
                        disabled={!canManage}
                        value={recMemberId}
                        onChange={(e) => setRecMemberId(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                      >
                        {(selectedClient.familyMembers || []).map((m, idx) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`})
                          </option>
                        ))}
                        <option value={`primary-${selectedClient.uid}`}>
                          {selectedClient.fullName} ({isArabic ? 'الملف الرئيسي' : 'Primary File'})
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'التصنيف:' : 'Category:'}
                        </label>
                        <select
                          disabled={!canManage || Boolean(editingRecordId)}
                          value={recCategory}
                          onChange={(e) => setRecCategory(e.target.value as MemberRecordCategory)}
                          className="w-full h-9 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                        >
                          <option value="report">{isArabic ? 'تقرير إكلينيكي' : 'Clinical Report'}</option>
                          <option value="subfile">{isArabic ? 'ملف فرعي / مرفق' : 'Sub-File'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'النوع:' : 'Type:'}
                        </label>
                        <select
                          disabled={!canManage}
                          value={recType}
                          onChange={(e) => setRecType(e.target.value as MemberReportType)}
                          className="w-full h-9 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                        >
                          {ADMIN_REPORT_TYPES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {isArabic ? opt.labelAr : opt.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {isArabic ? 'عنوان التقرير / الملف:' : 'Title:'} *
                      </label>
                      <input
                        type="text"
                        disabled={!canManage}
                        value={recTitle}
                        onChange={(e) => setRecTitle(e.target.value)}
                        placeholder={isArabic ? 'مثال: تقرير التقييم النمائي المبدئي' : 'Report title'}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'الأخصائي المسؤول:' : 'Specialist:'}
                        </label>
                        <select
                          disabled={!canManage}
                          value={recSpecialistName}
                          onChange={(e) => setRecSpecialistName(e.target.value)}
                          className="w-full h-9 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none cursor-pointer disabled:opacity-60"
                        >
                          <option value="">
                            {isArabic ? '— اختر الأخصائي المسؤول —' : '— Select Specialist —'}
                          </option>
                          {recSpecialistName.trim() &&
                            !activeSpecialists.some(
                              (sp) => sp.name.trim() === recSpecialistName.trim()
                            ) && (
                              <option value={recSpecialistName}>{recSpecialistName}</option>
                            )}
                          {activeSpecialists.map((sp) => {
                            const displayName = isArabic ? sp.name : sp.nameEn || sp.name;
                            const displayTitle = isArabic ? sp.title : sp.titleEn || sp.title;
                            return (
                              <option key={sp.id} value={sp.name.trim()}>
                                {displayTitle ? `${displayName} — ${displayTitle}` : displayName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                          {isArabic ? 'التاريخ:' : 'Date:'}
                        </label>
                        <input
                          type="date"
                          disabled={!canManage}
                          value={recDate}
                          onChange={(e) => setRecDate(e.target.value)}
                          className="w-full h-9 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {isArabic ? 'الملخص الإكلينيكي:' : 'Clinical Summary:'}
                      </label>
                      <textarea
                        rows={3}
                        disabled={!canManage}
                        value={recSummary}
                        onChange={(e) => setRecSummary(e.target.value)}
                        placeholder={isArabic ? 'أدخل نتائج التقييم أو ملاحظات الجلسات...' : 'Clinical findings...'}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {isArabic ? 'التوصيات العلاجية (اختياري):' : 'Recommendations (Optional):'}
                      </label>
                      <textarea
                        rows={2}
                        disabled={!canManage}
                        value={recRecommendations}
                        onChange={(e) => setRecRecommendations(e.target.value)}
                        placeholder={isArabic ? 'التوصيات والبرنامج المقترح...' : 'Therapy recommendations...'}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {isArabic ? 'إرفاق ملف PDF / صورة (اختياري):' : 'Attachment (Optional):'}
                      </label>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-white/15 space-y-1.5">
                        <input
                          type="file"
                          disabled={!canManage || isUploadingRecFile}
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={handleUploadRecordAttachment}
                          className="block w-full text-[11px] file:me-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:bg-[#1463D6]/12 file:text-[#1263D6] dark:file:text-[#60AFFF] file:font-black cursor-pointer"
                        />
                        {isUploadingRecFile && (
                          <div className="text-[11px] text-[#1263D6] font-bold">
                            {isArabic ? 'جاري رفع المرفق...' : 'Uploading...'}
                          </div>
                        )}
                        {recFileUrl && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
                            <span className="truncate">{recFileName || recFileUrl}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setRecFileUrl('');
                                setRecFileName('');
                              }}
                              className="text-rose-500 font-black cursor-pointer"
                            >
                              {isArabic ? 'إزالة' : 'Remove'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {canManage && (
                      <button
                        type="button"
                        disabled={isSavingRecord || isUploadingRecFile}
                        onClick={handleSaveMemberRecord}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#1463D6] hover:bg-[#1152B8] text-white text-xs font-black inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                      >
                        <Upload className="w-4 h-4" />
                        <span>
                          {isSavingRecord
                            ? isArabic
                              ? 'جاري الحفظ...'
                              : 'Saving...'
                            : editingRecordId
                            ? isArabic
                              ? 'حفظ تعديلات التقرير'
                              : 'Update Record'
                            : isArabic
                            ? 'نشر في الملف الفرعي للفرد'
                            : 'Publish to Member Sub-File'}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Published Reports & Sub-Files List */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-[#2E86EB]" />
                        <span>{isArabic ? 'التقارير والملفات الفرعية المسجلة' : 'Recorded Reports & Sub-Files'}</span>
                      </h4>
                      <select
                        value={selectedRecordMemberFilter}
                        onChange={(e) => setSelectedRecordMemberFilter(e.target.value)}
                        className="h-8 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-bold outline-none"
                      >
                        <option value="all">{isArabic ? 'جميع أفراد الأسرة' : 'All Members'}</option>
                        <option value={`primary-${selectedClient.uid}`}>
                          {selectedClient.fullName} ({isArabic ? 'الملف الرئيسي' : 'Primary File'})
                        </option>
                        {(selectedClient.familyMembers || []).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {recordsError && (
                      <div className="p-3 rounded-xl bg-rose-500/12 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{recordsError}</span>
                      </div>
                    )}

                    {recordsLoading ? (
                      <div className="py-10 text-center text-xs text-slate-500">
                        {isArabic ? 'جاري تحميل السجلات...' : 'Loading records...'}
                      </div>
                    ) : clientMemberRecords.filter(
                        (r) => selectedRecordMemberFilter === 'all' || r.familyMemberId === selectedRecordMemberFilter
                      ).length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/15 text-center text-xs text-slate-500 space-y-1">
                        <p className="font-bold">{isArabic ? 'لا توجد تقارير أو ملفات فرعية منشورة بعد.' : 'No reports or sub-files published yet.'}</p>
                        <p>{isArabic ? 'استخدم النموذج المجاور لإضافة تقرير أو ملف فرعي لأي فرد في الأسرة.' : 'Use the form to publish a report or sub-file.'}</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                        {clientMemberRecords
                          .filter(
                            (r) => selectedRecordMemberFilter === 'all' || r.familyMemberId === selectedRecordMemberFilter
                          )
                          .map((rec) => (
                            <div
                              key={rec.id}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-2 text-xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-full bg-[#1463D6]/12 text-[#1263D6] dark:text-[#60AFFF] text-[10px] font-black">
                                    {rec.familyMemberName}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                      rec.recordCategory === 'report'
                                        ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                                    }`}
                                  >
                                    {rec.recordCategory === 'report'
                                      ? isArabic
                                        ? 'تقرير'
                                        : 'Report'
                                      : isArabic
                                      ? 'ملف فرعي'
                                      : 'Sub-File'}
                                  </span>
                                  <span className="text-[10px] text-slate-500">{getReportTypeLabel(rec.reportType)}</span>
                                </div>
                                <span dir="ltr" className="font-mono text-[11px] text-slate-500">
                                  {rec.reportDate}
                                </span>
                              </div>

                              <div className="font-black text-sm text-slate-900 dark:text-white">{rec.title}</div>
                              {rec.specialistName && (
                                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                                  {rec.specialistName}
                                </div>
                              )}
                              {rec.summary && (
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                  {rec.summary}
                                </p>
                              )}

                              <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {rec.fileUrl && (
                                    <a
                                      href={rec.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-black text-[#1263D6] dark:text-[#60AFFF] hover:underline"
                                    >
                                      <Paperclip className="w-3.5 h-3.5" />
                                      <span>{rec.fileName || (isArabic ? 'فتح المرفق' : 'Attachment')}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                  {rec.authorRole === 'client' && (
                                    <span className="text-[10px] font-bold text-slate-500">
                                      ({isArabic ? 'مضاف بواسطة ولي الأمر' : 'Parent upload'})
                                    </span>
                                  )}
                                </div>

                                {canManage && (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled={deletingRecordId === rec.id}
                                      onClick={() => handleEditMemberRecord(rec)}
                                      className="px-2.5 py-1 rounded-lg bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] text-[11px] font-black cursor-pointer disabled:opacity-50"
                                    >
                                      {isArabic ? 'تعديل' : 'Edit'}
                                    </button>
                                    {canDeleteClient && (
                                      <button
                                        type="button"
                                        disabled={deletingRecordId === rec.id}
                                        onClick={() => handleDeleteMemberRecord(rec)}
                                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-black cursor-pointer disabled:opacity-50"
                                      >
                                        {deletingRecordId === rec.id
                                          ? isArabic
                                            ? 'جاري الحذف...'
                                            : 'Deleting...'
                                          : isArabic
                                          ? 'حذف'
                                          : 'Delete'}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Client File Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 bg-gradient-to-l from-emerald-500/10 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    {isArabic ? 'إضافة ملف عميل وأسرة جديد' : 'Add New Client File'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic
                      ? 'سيتم توليد رقم ملف موحد تلقائياً وحفظه مباشرة في قاعدة البيانات السحابية.'
                      : 'A unified FILE number will be generated automatically and saved to Firestore.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClientSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {createError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'الاسم الكامل لولي الأمر / العميل *' : 'Client Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={createFullName}
                    onChange={(e) => setCreateFullName(e.target.value)}
                    placeholder={isArabic ? 'مثال: خالد عبدالله القحطاني' : 'Full Name'}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs sm:text-sm outline-none focus:border-[#2E86EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'رقم الجوال *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono text-left outline-none focus:border-[#2E86EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono text-left outline-none focus:border-[#2E86EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'تاريخ الميلاد *' : 'Date of Birth *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={createDob}
                    onChange={(e) => setCreateDob(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-mono outline-none focus:border-[#2E86EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                    {isArabic ? 'الجنس' : 'Gender'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateGender('male')}
                      className={`h-10 rounded-xl text-xs font-bold border cursor-pointer ${
                        createGender === 'male'
                          ? 'bg-[#1463D6] text-white border-transparent'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/15'
                      }`}
                    >
                      {isArabic ? 'ذكر' : 'Male'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateGender('female')}
                      className={`h-10 rounded-xl text-xs font-bold border cursor-pointer ${
                        createGender === 'female'
                          ? 'bg-[#1463D6] text-white border-transparent'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/15'
                      }`}
                    >
                      {isArabic ? 'أنثى' : 'Female'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Family Members */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#2E86EB]" />
                    <span>{isArabic ? 'الأبناء / أفراد الأسرة المضافين (اختياري)' : 'Family Members / Children (Optional)'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCreateFamilyMembers((prev) => [
                        ...prev,
                        {
                          id: `fam-${Date.now()}-${prev.length + 1}`,
                          name: '',
                          relation: isArabic ? 'ابن / ابنة' : 'Child',
                          dob: '',
                          gender: 'male',
                          subFileNumber: `SUB-${String(prev.length + 1).padStart(2, '0')}`,
                        },
                      ])
                    }
                    className="text-xs font-black text-[#1463D6] dark:text-[#60AFFF] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'إضافة فرد / طفل' : 'Add Member'}</span>
                  </button>
                </div>

                {createFamilyMembers.length === 0 ? (
                  <p className="text-[11px] text-slate-500">
                    {isArabic
                      ? 'يمكنك إضافة الأبناء أو المستفيدين الآن أو لاحقاً من داخل الملف.'
                      : 'You can add children or dependents now or later inside the file.'}
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {createFamilyMembers.map((m, idx) => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1463D6]/10 text-[#1263D6] dark:text-[#60AFFF] font-bold shrink-0">
                            {m.subFileNumber || `SUB-${String(idx + 1).padStart(2, '0')}`}
                          </span>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) =>
                              setCreateFamilyMembers((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                              )
                            }
                            placeholder={isArabic ? 'اسم الطفل / المستفيد' : 'Member name'}
                            className="flex-1 h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setCreateFamilyMembers((prev) => prev.filter((_, i) => i !== idx))}
                            className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                            aria-label={isArabic ? 'حذف' : 'Remove'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={m.relation}
                            onChange={(e) =>
                              setCreateFamilyMembers((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, relation: e.target.value } : item))
                              )
                            }
                            placeholder={isArabic ? 'صلة القرابة' : 'Relation'}
                            className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                          />
                          <select
                            value={m.gender || 'male'}
                            onChange={(e) =>
                              setCreateFamilyMembers((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, gender: e.target.value as 'male' | 'female' } : item
                                )
                              )
                            }
                            className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs outline-none"
                          >
                            <option value="male">{isArabic ? 'ذكر' : 'Male'}</option>
                            <option value="female">{isArabic ? 'أنثى' : 'Female'}</option>
                          </select>
                          <input
                            type="date"
                            value={m.dob}
                            onChange={(e) =>
                              setCreateFamilyMembers((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, dob: e.target.value } : item))
                              )
                            }
                            className="h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[11px] font-mono outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 dark:text-slate-300 mb-1.5">
                  {isArabic ? 'ملاحظات إدارية أولية (اختياري)' : 'Initial Admin Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={createAdminNotes}
                  onChange={(e) => setCreateAdminNotes(e.target.value)}
                  placeholder={isArabic ? 'أضف أي ملاحظات تعريفية بالملف...' : 'Optional notes...'}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none focus:border-[#2E86EB]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClient}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isCreatingClient
                      ? isArabic
                        ? 'جاري الإنشاء...'
                        : 'Creating...'
                      : isArabic
                      ? 'إنشاء وحفظ الملف'
                      : 'Create Client File'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activate / Deactivate (Suspend) Client Modal with Reason Comment */}
      {statusModalClient && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setStatusModalClient(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 ${
                statusModalClient.status === 'active'
                  ? 'bg-gradient-to-l from-rose-500/12 to-transparent'
                  : 'bg-gradient-to-l from-emerald-500/12 to-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0 ${
                    statusModalClient.status === 'active' ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                >
                  {statusModalClient.status === 'active' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {statusModalClient.status === 'active'
                      ? isArabic
                        ? 'إيقاف تنشيط ملف العميل'
                        : 'Deactivate Client File'
                      : isArabic
                      ? 'إعادة تنشيط ملف العميل'
                      : 'Activate Client File'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {statusModalClient.fullName} · <span className="font-mono">{statusModalClient.fileNumber}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalClient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmStatusToggle} className="p-5 space-y-4">
              {statusModalError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-700 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusModalError}</span>
                </div>
              )}

              {statusModalClient.status === 'active' ? (
                <>
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {isArabic ? 'اختيار سريع لسبب الإيقاف:' : 'Quick reason presets:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(isArabic
                        ? [
                            'عدم استكمال البيانات المطلوبة',
                            'تجميد مؤقت بناءً على طلب الأسرة',
                            'مراجعة إدارية / مالية للملف',
                            'انتهاء البرنامج التأهيلي أو المتابعة',
                          ]
                        : [
                            'Incomplete registration documents',
                            'Temporary freeze requested by family',
                            'Administrative / billing review',
                            'Completed rehabilitation program',
                          ]
                      ).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setStatusComment(preset)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-rose-500/15 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                      {isArabic ? 'تعليق يوضح سبب إيقاف التنشيط *' : 'Reason for deactivation *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      placeholder={
                        isArabic
                          ? 'اكتب السبب الواضح لإيقاف تنشيط هذا الملف (سيظهر للإدارة والعميل)...'
                          : 'Write the reason for suspending this client file...'
                      }
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  {statusModalClient.suspensionReason && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs space-y-1">
                      <div className="font-black text-rose-700 dark:text-rose-300">
                        {isArabic ? 'سبب الإيقاف السابق:' : 'Previous suspension reason:'}
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{statusModalClient.suspensionReason}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                      {isArabic ? 'تعليق إعادة التنشيط (اختياري)' : 'Reactivation note (optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      placeholder={
                        isArabic
                          ? 'أضف ملاحظة توضح سبب إعادة التنشيط إن وجدت...'
                          : 'Optional note for reactivating this file...'
                      }
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalClient(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-5 py-2 rounded-full text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                    statusModalClient.status === 'active'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {statusModalClient.status === 'active' ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        {isSaving
                          ? isArabic
                            ? 'جاري الحفظ...'
                            : 'Saving...'
                          : isArabic
                          ? 'تأكيد إيقاف التنشيط'
                          : 'Confirm Suspension'}
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        {isSaving
                          ? isArabic
                            ? 'جاري التفعيل...'
                            : 'Activating...'
                          : isArabic
                          ? 'تأكيد تنشيط الملف'
                          : 'Confirm Activation'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Super-Admin Only Delete Confirmation Modal */}
      {deleteModalClient && canDeleteClient && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => !isDeletingClient && setDeleteModalClient(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#0D1B2A] text-slate-900 dark:text-white border border-rose-500/35 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200/80 dark:border-white/10 bg-rose-500/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-700 dark:text-rose-300">
                  {isArabic ? 'تأكيد حذف ملف العميل نهائياً' : 'Confirm Permanent Deletion'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {deleteModalClient.fullName} · <span className="font-mono">{deleteModalClient.fileNumber}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {isArabic
                  ? 'سيتم حذف ملف العميل وجميع التقارير والملفات الفرعية المرتبطة به نهائياً من النظام السحابي ولا يمكن التراجع عن هذه العملية.'
                  : 'This client file and all attached child reports and sub-files will be permanently deleted from Cloud Firestore. This cannot be undone.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isDeletingClient}
                  onClick={() => setDeleteModalClient(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={isDeletingClient}
                  onClick={handleConfirmDeleteClient}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {isDeletingClient
                      ? isArabic
                        ? 'جاري الحذف النهائي...'
                        : 'Deleting...'
                      : isArabic
                      ? 'حذف نهائي'
                      : 'Delete Permanently'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFilesTab;
