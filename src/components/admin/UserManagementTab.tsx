import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  Lock, 
  Unlock, 
  UserCheck, 
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminUser, PermissionId, UserRole } from '../../types';
import { SYSTEM_PERMISSIONS, ROLE_PRESETS } from '../../data/adminData';
import { useLanguage } from '../../context/LanguageContext';

interface UserManagementTabProps {
  users: AdminUser[];
  currentUser: AdminUser;
  onUpdateUsers: (updated: AdminUser[]) => void;
  onSwitchUser: (user: AdminUser) => void;
  hasPermission: (perm: PermissionId) => boolean;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  currentUser,
  onUpdateUsers,
  onSwitchUser,
  hasPermission
}) => {
  const { isArabic } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDepartment, setFormDepartment] = useState('إدارة العمليات');
  const [formRole, setFormRole] = useState<UserRole>('receptionist');
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [formPermissions, setFormPermissions] = useState<PermissionId[]>([]);
  const [formError, setFormError] = useState('');

  const canManageUsers = hasPermission('manage_users');

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roleTitleAr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormEmail('');
    setFormPhone('');
    setFormDepartment('إدارة العمليات');
    setFormRole('receptionist');
    const preset = ROLE_PRESETS.find(r => r.role === 'receptionist');
    setFormPermissions(preset ? [...preset.defaultPermissions] : ['manage_appointments']);
    setFormStatus('active');
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword('');
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormDepartment(user.department);
    setFormRole(user.role);
    setFormPermissions([...user.permissions]);
    setFormStatus(user.status);
    setFormError('');
    setIsAddModalOpen(true);
  };

  // When role changes, optionally autofill default permissions
  const handleRoleChange = (newRole: UserRole) => {
    setFormRole(newRole);
    const preset = ROLE_PRESETS.find(r => r.role === newRole);
    if (preset) {
      setFormPermissions([...preset.defaultPermissions]);
    }
  };

  // Toggle single permission
  const handleTogglePermission = (permId: PermissionId) => {
    setFormPermissions((prev) => {
      if (prev.includes(permId)) {
        return prev.filter(p => p !== permId);
      } else {
        return [...prev, permId];
      }
    });
  };

  // Select all or deselect all permissions
  const handleSelectAllPermissions = () => {
    if (formPermissions.length === SYSTEM_PERMISSIONS.length) {
      setFormPermissions([]);
    } else {
      setFormPermissions(SYSTEM_PERMISSIONS.map(p => p.id));
    }
  };

  // Submit User
  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formUsername.trim()) {
      setFormError(isArabic ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const preset = ROLE_PRESETS.find(r => r.role === formRole);
    const roleTitleAr = preset ? preset.titleAr : 'دور مخصص';
    const roleTitleEn = preset ? preset.titleEn : 'Custom Role';

    if (editingUser) {
      // Update existing
      const updatedList = users.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: formName.trim(),
            username: formUsername.trim(),
            email: formEmail.trim(),
            phone: formPhone.trim() || u.phone,
            department: formDepartment.trim(),
            role: formRole,
            roleTitleAr,
            roleTitleEn,
            status: formStatus,
            password: formPassword.trim() ? formPassword.trim() : (u.password || 'raba'),
            permissions: formPermissions
          };
        }
        return u;
      });

      onUpdateUsers(updatedList);
      // If editing current user, update session as well
      if (currentUser.id === editingUser.id) {
        const myUpdated = updatedList.find(u => u.id === editingUser.id);
        if (myUpdated) onSwitchUser(myUpdated);
      }
    } else {
      // Create new user
      const newUser: AdminUser = {
        id: 'usr-' + Date.now(),
        name: formName.trim(),
        nameEn: formName.trim(),
        username: formUsername.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || '+966 50 000 0000',
        role: formRole,
        roleTitleAr,
        roleTitleEn,
        department: formDepartment.trim(),
        status: formStatus,
        password: formPassword.trim() || 'raba',
        permissions: formPermissions,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: isArabic ? 'لم يسجل دخول بعد' : 'Never'
      };

      onUpdateUsers([newUser, ...users]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    setIsAddModalOpen(false);
  };

  // Toggle user status active/suspended
  const handleToggleStatus = (user: AdminUser) => {
    if (!canManageUsers) return;
    if (user.id === currentUser.id) {
      showToast(isArabic ? 'لا يمكنك تجميد حسابك الحالي النشط!' : 'You cannot suspend your own active account!', 'error');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated = users.map(u => u.id === user.id ? { ...u, status: newStatus as 'active' | 'suspended' } : u);
    onUpdateUsers(updated);
    showToast(isArabic ? 'تم تحديث حالة المستخدم بنجاح' : 'User status updated');
  };

  // Delete user
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      showToast(isArabic ? 'لا يمكنك حذف حسابك الحالي الذي تستخدمه لتسجيل الدخول!' : 'Cannot delete the logged-in user!', 'error');
      setUserToDelete(null);
      return;
    }
    const updated = users.filter(u => u.id !== userToDelete.id);
    onUpdateUsers(updated);
    setUserToDelete(null);
    showToast(isArabic ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-[#0B3B36] via-[#0E5246] to-[#0A2E2A] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isArabic ? 'نظام التحكم بالصلاحيات RBAC' : 'Role-Based Access Control'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isArabic ? 'إدارة المستخدمين، الكوادر الإدارية والصلاحيات' : 'User Management & Permissions Matrix'}
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {isArabic 
                ? 'إمكانية إضافة حسابات للموظفين والأخصائيين وتعيين صلاحيات دقيقة للتحكم في المواعيد، الخدمات، العروض، والتقارير المالية.'
                : 'Create accounts for administrative staff and specialists, assign granular permissions, and control clinic access.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {canManageUsers && (
              <button
                onClick={handleOpenAdd}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00E5BE] to-[#0284C7] hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isArabic ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Current User Pill Indicator */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-200/90">{isArabic ? 'المستخدم الحالي قيد الاستخدام:' : 'Current Active User:'}</span>
            <span className="font-bold bg-white/10 px-3 py-1 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {currentUser.name} ({currentUser.roleTitleAr})
            </span>
          </div>
          <div className="text-emerald-300/80 text-[11px]">
            {isArabic 
              ? `يمتلك (${currentUser.permissions.length}) من أصل (${SYSTEM_PERMISSIONS.length}) صلاحيات نظام`
              : `Has (${currentUser.permissions.length}/${SYSTEM_PERMISSIONS.length}) system permissions`}
          </div>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {toastMsg && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-lg animate-in fade-in ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Permissions Warning Notice if no permission */}
      {!canManageUsers && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
          <div>
            <span className="font-bold block">{isArabic ? 'وضع القراءة فقط' : 'Read-Only Mode'}</span>
            <span>{isArabic ? 'حسابك الحالي لا يمتلك صلاحية تعديل أو إضافة المستخدمين. قم بالتبديل إلى حساب "المدير العام" في الأعلى للتجربة وتعديل الصلاحيات.' : 'Your account does not have user management permissions. Switch to Super Admin to modify users.'}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث بالاسم، البريد، أو القسم...' : 'Search by name, email, department...'}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <Search className={`w-4 h-4 text-slate-500 dark:text-slate-400 absolute ${isArabic ? 'left-3' : 'right-3'} top-3`} />
        </div>

        {/* Role & Status Filter dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isArabic ? 'تصفية:' : 'Filter:'}</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">{isArabic ? 'كافة الأدوار' : 'All Roles'}</option>
            {ROLE_PRESETS.map((preset) => (
              <option key={preset.role} value={preset.role}>
                {isArabic ? preset.titleAr : preset.titleEn}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">{isArabic ? 'كافة الحالات' : 'All Statuses'}</option>
            <option value="active">{isArabic ? 'نشط فقط' : 'Active Only'}</option>
            <option value="suspended">{isArabic ? 'موقوف فقط' : 'Suspended Only'}</option>
          </select>
        </div>

      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const isMe = user.id === currentUser.id;
          const preset = ROLE_PRESETS.find(p => p.role === user.role);

          return (
            <div
              key={user.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                isMe
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-white/10 shadow-xs hover:shadow-lg'
              } ${user.status === 'suspended' ? 'opacity-70 bg-slate-50 dark:bg-slate-900/50' : ''}`}
            >
              <div>
                
                {/* Top User Row: Status + Role Tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    user.role === 'super_admin'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                      : user.role === 'operations_manager'
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20'
                      : user.role === 'clinical_supervisor'
                      ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                      : user.role === 'accountant'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                      : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                  }`}>
                    {isArabic ? user.roleTitleAr : user.roleTitleEn}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {isArabic ? 'نشط' : 'Active'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {isArabic ? 'موقوف' : 'Suspended'}
                      </span>
                    )}

                    {isMe && (
                      <span className="bg-[#0B3B36] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {isArabic ? 'حسابك' : 'You'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || ''}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-inner">
                      {(user?.name || (user as any)?.username || 'م').slice(0, 2)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'مستخدم'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {user.department}
                    </p>
                  </div>
                </div>

                {/* Permissions Badges Summary */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isArabic ? 'الصلاحيات الممنوحة:' : 'Granted Permissions:'}</span>
                    </span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-[11px]">
                      {user.permissions.length} / {SYSTEM_PERMISSIONS.length}
                    </span>
                  </div>

                  {/* Pills of granted permissions */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar pt-1">
                    {user.permissions.map((permId) => {
                      const def = SYSTEM_PERMISSIONS.find(p => p.id === permId);
                      return (
                        <span
                          key={permId}
                          className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-md text-[10px] font-medium"
                        >
                          {def ? (isArabic ? def.titleAr : def.titleEn) : permId}
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                
                {/* Switch User Button (Impersonate / Experience) */}
                <button
                  onClick={() => onSwitchUser(user)}
                  disabled={isMe || user.status === 'suspended'}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMe
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 cursor-default'
                      : user.status === 'suspended'
                      ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-300'
                  }`}
                  title={isArabic ? 'تبديل الحساب وتجربة المنظومة بهذه الصلاحيات' : 'Switch active user to test permissions'}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isMe ? (isArabic ? 'المستخدم الحالي' : 'Active') : (isArabic ? 'دخول بحسابه' : 'Switch')}</span>
                </button>

                {/* Edit & Suspend & Delete controls */}
                <div className="flex items-center gap-1">
                  {canManageUsers && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={isArabic ? 'تعديل البيانات والصلاحيات' : 'Edit User & Permissions'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={isMe}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          user.status === 'active'
                            ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        } ${isMe ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title={user.status === 'active' ? (isArabic ? 'تجميد الحساب' : 'Suspend Account') : (isArabic ? 'تنشيط الحساب' : 'Activate Account')}
                      >
                        {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setUserToDelete(user)}
                        disabled={isMe}
                        className={`p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer ${
                          isMe ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title={isArabic ? 'حذف المستخدم' : 'Delete User'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* ADD / EDIT USER MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="bg-[#0B3B36] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  {editingUser 
                    ? (isArabic ? 'تعديل بيانات المستخدم والصلاحيات' : 'Edit User & Permissions') 
                    : (isArabic ? 'إضافة مستخدم إداري جديد' : 'Add New Administrative User')}
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1">
                  {isArabic 
                    ? 'قم بتعيين بيانات الموظف واختيار الصلاحيات المناسبة لمهامه بدقة' 
                    : 'Configure staff credentials and assign exact task permissions'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitUser} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {formError && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'الاسم الكامل:' : 'Full Name:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={isArabic ? 'مثال: سارة محمد السبيعي' : 'e.g. Sarah Al-Subaie'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'اسم المستخدم للدخول:' : 'Username:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="sarah.ops"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {editingUser 
                      ? (isArabic ? 'كلمة المرور (اتركه فارغاً للإبقاء):' : 'Password (leave blank to keep):')
                      : (isArabic ? 'كلمة المرور للدخول:' : 'Login Password:')}
                  </label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? (isArabic ? '•••••••• (غير معدل)' : 'Unchanged') : (isArabic ? 'كلمة المرور الجديدة' : 'New password')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'البريد الإلكتروني المهني:' : 'Work Email:'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="sarah@raba.sa"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'رقم جوال التواصل:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'القسم / الإدارة:' : 'Department:'}
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder={isArabic ? 'إدارة العمليات والتشغيل' : 'Operations Department'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isArabic ? 'حالة الحساب:' : 'Account Status:'}
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="active">{isArabic ? 'نشط (مفعل بالكامل)' : 'Active'}</option>
                    <option value="suspended">{isArabic ? 'موقوف مؤقتاً' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Role Preset Selector */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isArabic ? 'الدور الوظيفي والنموذج المعتمد:' : 'Role Preset & Template:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLE_PRESETS.map((preset) => {
                    const isSelected = formRole === preset.role;
                    return (
                      <button
                        type="button"
                        key={preset.role}
                        onClick={() => handleRoleChange(preset.role)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B3B36] text-white border-[#0B3B36] shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-slate-300'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <span className="text-xs font-bold block">{isArabic ? preset.titleAr : preset.titleEn}</span>
                        <span className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-emerald-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {preset.defaultPermissions.length} {isArabic ? 'صلاحيات' : 'permissions'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permissions Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isArabic ? 'تخصيص الصلاحيات التفصيلية للمستخدم:' : 'Custom Permissions Matrix:'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isArabic ? 'يمكنك تحديد أو استثناء أي صلاحية بحرية تامة' : 'Toggle individual permissions to grant or restrict capabilities'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllPermissions}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {formPermissions.length === SYSTEM_PERMISSIONS.length 
                      ? (isArabic ? 'إلغاء تحديد الكل' : 'Deselect All') 
                      : (isArabic ? 'تحديد كافة الصلاحيات' : 'Select All')}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYSTEM_PERMISSIONS.map((perm) => {
                    const isChecked = formPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/50'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className={`text-xs font-bold block ${isChecked ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>
                            {isArabic ? perm.titleAr : perm.titleEn}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                            {isArabic ? perm.descriptionAr : perm.descriptionEn}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5BE] to-[#0284C7] text-slate-950 font-black text-xs shadow-md hover:brightness-110 cursor-pointer"
                >
                  {editingUser 
                    ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') 
                    : (isArabic ? 'إنشاء وتفعيل الحساب' : 'Create Account')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {userToDelete && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setUserToDelete(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-white/15 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'تأكيد حذف المستخدم؟' : 'Confirm User Deletion?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isArabic 
                ? `هل أنت متأكد من رغبتك في حذف حساب "${userToDelete.name}"؟ لن يتمكن الموظف من تسجيل الدخول للنظام بعد الآن.` 
                : `Are you sure you want to permanently remove "${userToDelete.name}"?`}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isArabic ? 'تراجع' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm"
              >
                {isArabic ? 'نعم، حذف الحساب' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagementTab;
