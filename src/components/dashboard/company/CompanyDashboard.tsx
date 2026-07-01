"use client";

import { useState, useEffect } from "react";
import styles from "./CompanyDashboard.module.css";
import type { SessionUser } from "@/types/user";
import { useDashboard } from "@/contexts/DashboardContext";

type CompanyDashboardProps = {
  user: SessionUser;
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
  };
  recentUsers: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }[];
};

type CompanyTab = "overview" | "manage-users";

type CreatedCredentials = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

const roleColors: Record<string, string> = {
  STUDENT: "#6366f1",
  TEACHER: "#a855f7",
  ADMIN: "#f59e0b",
};

const roleLabels: Record<string, string> = {
  STUDENT: "Öğrenci",
  TEACHER: "Eğitmen",
  ADMIN: "Yönetici",
};

export default function CompanyDashboard({
  user,
  stats,
  recentUsers,
}: CompanyDashboardProps) {
  const { activeNav, setActiveNav } = useDashboard();

  const activeTab: CompanyTab =
    activeNav === "home" ? "overview" : "manage-users";

  const setActiveTab = (tab: CompanyTab) => {
    setActiveNav(tab === "overview" ? "home" : "classes");
  };

  // Kullanıcı yönetimi state'leri
  const [institutionUsers, setInstitutionUsers] = useState<typeof recentUsers>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Kurum kullanıcılarını yükle
  const fetchInstitutionUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setInstitutionUsers(data.users);
      }
    } catch {
      // silent
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "manage-users") {
      fetchInstitutionUsers();
    }
  }, [activeTab]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddingUser(true);
    setCreatedCredentials(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newUserFirstName.trim(),
          lastName: newUserLastName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddUserError(data.error ?? "Kullanıcı eklenirken bir hata oluştu.");
        return;
      }

      // Başarılı — ön kayıt bildirimini modal'da göster
      setCreatedCredentials({
        email: newUserEmail.trim(),
        firstName: newUserFirstName.trim(),
        lastName: newUserLastName.trim(),
        role: newUserRole,
      });

      // Formu temizle
      setNewUserFirstName("");
      setNewUserLastName("");
      setNewUserEmail("");
      setNewUserRole("STUDENT");

      // Listeyi güncelle
      setInstitutionUsers((prev) => [data.user, ...prev]);
    } catch {
      setAddUserError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string, permanent: boolean = false) => {
    setDeletingUserId(userId);
    try {
      const url = permanent
        ? `/api/admin/users/${userId}?permanent=true`
        : `/api/admin/users/${userId}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        setInstitutionUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch {
      // silent
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Kurum Yönetim Paneli</h2>
          <p className={styles.subtitle}>
            Hoş geldiniz, {user.firstName}. <strong>{user.institutionName}</strong> bünyesindeki eğitmen ve öğrencileri yönetin.
          </p>
        </div>
        <div className={styles.adminBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Kurum Yöneticisi
          {user.institutionName && (
            <span className={styles.institutionBadge}>
              {user.institutionName}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        {(["overview", "manage-users"] as CompanyTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
            id={`company-tab-${tab}`}
          >
            {tab === "overview" && "Genel Bakış"}
            {tab === "manage-users" && "👥 Kişi Yönetimi"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className={styles.tabContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalUsers}</span>
                <span className={styles.statLabel}>Toplam Kurum Üyesi</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalStudents}</span>
                <span className={styles.statLabel}>Öğrenci</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalTeachers}</span>
                <span className={styles.statLabel}>Eğitmen</span>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Son Eklenen Üyeler</h3>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>İsim</span>
                <span>E-posta</span>
                <span>Rol</span>
                <span>Tarih</span>
              </div>
              {recentUsers.length === 0 && (
                <div className={styles.emptyState}>Henüz kullanıcı yok.</div>
              )}
              {recentUsers.map((u) => (
                <div key={u.id} className={styles.tableRow}>
                  <span className={styles.userName}>
                    {u.firstName} {u.lastName}
                  </span>
                  <span className={styles.userEmail}>{u.email}</span>
                  <span
                    className={styles.roleBadge}
                    style={{
                      background: `${roleColors[u.role] ?? "#6b7280"}18`,
                      color: roleColors[u.role] ?? "#6b7280",
                      borderColor: `${roleColors[u.role] ?? "#6b7280"}30`,
                    }}
                  >
                    {roleLabels[u.role] ?? u.role}
                  </span>
                  <span className={styles.userDate}>
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manage Users Tab */}
      {activeTab === "manage-users" && (
        <div className={styles.tabContent}>
          {/* Kullanıcı Ekleme Formu */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🆕 Yeni Öğrenci / Eğitmen Ekle</h3>
            <p className={styles.sectionDesc}>
              Kurumunuza bağlı yeni bir öğrenci veya eğitmen ekleyin. Bu kişi kişisel e-posta adresini (örn: gmail, hotmail) kullansa dahi kurumunuza bağlanacaktır.
            </p>

            <form onSubmit={handleAddUser} className={styles.addForm} id="add-user-form">
              <div className={styles.addFormFields}>
                <div className={styles.nameRow}>
                  <div className={styles.inputGroup}>
                    <label className="input-label" htmlFor="user-firstname">Ad</label>
                    <input
                      id="user-firstname"
                      type="text"
                      className="input-field"
                      placeholder="Adı"
                      value={newUserFirstName}
                      onChange={(e) => setNewUserFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className="input-label" htmlFor="user-lastname">Soyad</label>
                    <input
                      id="user-lastname"
                      type="text"
                      className="input-field"
                      placeholder="Soyadı"
                      value={newUserLastName}
                      onChange={(e) => setNewUserLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="user-email">E-posta</label>
                  <input
                    id="user-email"
                    type="email"
                    className="input-field"
                    placeholder="kullanici@email.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="user-role">Rol</label>
                  <select
                    id="user-role"
                    className="input-field"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as "STUDENT" | "TEACHER")}
                  >
                    <option value="STUDENT">🎓 Öğrenci</option>
                    <option value="TEACHER">👨‍🏫 Eğitmen</option>
                  </select>
                </div>
              </div>

              {addUserError && (
                <div className={styles.formError} role="alert">{addUserError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={addingUser}
                id="add-user-submit"
              >
                {addingUser ? "Ekleniyor..." : "+ Kullanıcı Ekle"}
              </button>
            </form>
          </div>

          {/* Oluşturulan Kullanıcı Bilgileri Modal */}
          {createdCredentials && (
            <div className={styles.credentialsCard}>
              <div className={styles.credentialsHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h4>Kullanıcı Başarıyla Oluşturuldu!</h4>
              </div>
              <div className={styles.credentialsBody}>
                <p className={styles.credentialsNote}>
                  📋 Kurum ön kaydı oluşturuldu. Kullanıcı kendi şifresini <strong>/register</strong> sayfasından belirleyecektir.
                </p>
                <div className={styles.credentialsDivider} />
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>İsim:</span>
                  <span className={styles.credentialValue}>
                    {createdCredentials.firstName} {createdCredentials.lastName}
                  </span>
                </div>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>Rol:</span>
                  <span
                    className={styles.roleBadge}
                    style={{
                      background: `${roleColors[createdCredentials.role] ?? "#6b7280"}18`,
                      color: roleColors[createdCredentials.role] ?? "#6b7280",
                      borderColor: `${roleColors[createdCredentials.role] ?? "#6b7280"}30`,
                    }}
                  >
                    {roleLabels[createdCredentials.role] ?? createdCredentials.role}
                  </span>
                </div>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialLabel}>E-posta:</span>
                  <code className={styles.credentialCode}>{createdCredentials.email}</code>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCreatedCredentials(null)}
                id="close-credentials"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Kurum Kullanıcı Listesi */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Kurum Öğrenci ve Eğitmenleri</h3>
            {loadingUsers ? (
              <div className={styles.emptyState}>Yükleniyor...</div>
            ) : institutionUsers.length === 0 ? (
              <div className={styles.emptyState}>
                Kurumunuza henüz kayıtlı kullanıcı yok. Yukarıdan ekleyin.
              </div>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>İsim</span>
                  <span>E-posta</span>
                  <span>Rol</span>
                  <span>Durum</span>
                  <span>Tarih</span>
                  <span>İşlem</span>
                </div>
                {institutionUsers.map((u) => (
                  <div key={u.id} className={styles.tableRow}>
                    <span className={styles.userName}>
                      {u.firstName} {u.lastName}
                    </span>
                    <span className={styles.userEmail}>{u.email}</span>
                    <span
                      className={styles.roleBadge}
                      style={{
                        background: `${roleColors[u.role] ?? "#6b7280"}18`,
                        color: roleColors[u.role] ?? "#6b7280",
                        borderColor: `${roleColors[u.role] ?? "#6b7280"}30`,
                      }}
                    >
                      {roleLabels[u.role] ?? u.role}
                    </span>
                    <span>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: u.status === "PENDING" ? "rgba(245, 158, 11, 0.12)" : "rgba(34, 197, 94, 0.12)",
                          color: u.status === "PENDING" ? "#f59e0b" : "#22c55e",
                          border: u.status === "PENDING" ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid rgba(34, 197, 94, 0.25)",
                        }}
                      >
                        {u.status === "PENDING" ? "Aktivasyon Bekliyor" : "Aktif"}
                      </span>
                    </span>
                    <span className={styles.userDate}>
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                    <span className={styles.actionButtons}>
                      {u.id !== user.id && (
                        <>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemoveUser(u.id, false)}
                            disabled={deletingUserId === u.id}
                            title="Kurumdan Çıkar"
                            id={`remove-user-${u.id}`}
                          >
                            {deletingUserId === u.id ? "..." : "Kurumdan Çıkar"}
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => {
                              if (confirm(`${u.firstName} ${u.lastName} kullanıcısını tamamen silmek istediğinize emin misiniz?`)) {
                                handleRemoveUser(u.id, true);
                              }
                            }}
                            disabled={deletingUserId === u.id}
                            title="Tamamen Sil"
                            id={`delete-user-${u.id}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
