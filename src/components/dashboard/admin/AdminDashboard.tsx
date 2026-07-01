"use client";

import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import type { SessionUser } from "@/types/user";
import { useDashboard } from "@/contexts/DashboardContext";

type AdminDashboardProps = {
  user: SessionUser;
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalInstitutions: number;
    totalCourses: number;
  };
  institutions: { id: string; name: string; domain: string; createdAt: string }[];
  recentUsers: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    createdAt: string;
  }[];
};

type AdminTab = "overview" | "users" | "institutions";

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

export default function AdminDashboard({
  user,
  stats,
  institutions,
  recentUsers,
}: AdminDashboardProps) {
  const { activeNav, setActiveNav } = useDashboard();

  const activeTab: AdminTab =
    activeNav === "home"
      ? "overview"
      : activeNav === "classes"
      ? "users"
      : "institutions";

  const setActiveTab = (tab: AdminTab) => {
    const nav = tab === "overview" ? "home" : tab === "users" ? "classes" : "ai-room";
    setActiveNav(nav);
  };
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [newInstitutionDomain, setNewInstitutionDomain] = useState("");
  const [addingInstitution, setAddingInstitution] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [localInstitutions, setLocalInstitutions] = useState(institutions);

  const [expandedInstId, setExpandedInstId] = useState<string | null>(null);
  const [instUsers, setInstUsers] = useState<Record<string, any[]>>({});
  const [loadingInstId, setLoadingInstId] = useState<string | null>(null);

  const handleToggleInstitution = async (instId: string) => {
    if (expandedInstId === instId) {
      setExpandedInstId(null);
      return;
    }
    setExpandedInstId(instId);

    if (!instUsers[instId]) {
      setLoadingInstId(instId);
      try {
        const res = await fetch(`/api/admin/institutions/${instId}/users`);
        if (res.ok) {
          const data = await res.json();
          setInstUsers((prev) => ({ ...prev, [instId]: data.users }));
        }
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoadingInstId(null);
      }
    }
  };


  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddingInstitution(true);
    try {
      const res = await fetch("/api/admin/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newInstitutionName,
          domain: newInstitutionDomain.toLowerCase().trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error ?? "Bir hata oluştu.");
        return;
      }
      const data = await res.json();
      setLocalInstitutions((prev) => [data.institution, ...prev]);
      setNewInstitutionName("");
      setNewInstitutionDomain("");
    } catch {
      setAddError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setAddingInstitution(false);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/institutions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLocalInstitutions((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      // silent
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Sistem Yöneticisi Paneli</h2>
          <p className={styles.subtitle}>
            Hoş geldiniz, {user.firstName}. Tüm sistem genelini ve kurumları buradan yönetin.
          </p>
        </div>
        <div className={styles.adminBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Süper Admin
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        {(["overview", "users", "institutions"] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
            id={`admin-tab-${tab}`}
          >
            {tab === "overview" && "Genel Bakış"}
            {tab === "users" && "Kullanıcılar"}
            {tab === "institutions" && "Kurumlar"}
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
                <span className={styles.statLabel}>Kurum Kullanıcısı</span>
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

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalInstitutions}</span>
                <span className={styles.statLabel}>Kayıtlı Kurum</span>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Son Kayıt Olan Kullanıcılar</h3>
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



      {/* Users Tab */}
      {activeTab === "users" && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tüm Kullanıcılar</h3>
            <div className={styles.roleBreakdown}>
              {[
                { label: "Öğrenci", count: stats.totalStudents, color: "#6366f1" },
                { label: "Eğitmen", count: stats.totalTeachers, color: "#a855f7" },
                { label: "Yönetici", count: stats.totalAdmins, color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} className={styles.roleBreakdownItem}>
                  <div className={styles.roleBreakdownLabel}>
                    <span className={styles.roleDot} style={{ background: item.color }} />
                    {item.label}
                  </div>
                  <div className={styles.roleBreakdownBar}>
                    <div
                      className={styles.roleBreakdownFill}
                      style={{
                        width: `${stats.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <span className={styles.roleBreakdownCount}>{item.count}</span>
                </div>
              ))}
            </div>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>İsim</span>
                <span>E-posta</span>
                <span>Rol</span>
                <span>Tarih</span>
              </div>
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

      {/* Institutions Tab */}
      {activeTab === "institutions" && (
        <div className={styles.tabContent}>
          {/* Add Institution Form */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Yeni Kurum Ekle</h3>
            <p className={styles.sectionDesc}>
              Eklenen kurumların e-posta domain&apos;iyle kaydolan kullanıcılar otomatik
              olarak <strong>Kurum Yöneticisi</strong> rolü alır.
            </p>
            <form onSubmit={handleAddInstitution} className={styles.addForm} id="add-institution-form">
              <div className={styles.addFormFields}>
                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="inst-name">Kurum Adı</label>
                  <input
                    id="inst-name"
                    type="text"
                    className="input-field"
                    placeholder="Örn: Ankara Üniversitesi"
                    value={newInstitutionName}
                    onChange={(e) => setNewInstitutionName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="inst-domain">E-posta Domain&apos;i</label>
                  <input
                    id="inst-domain"
                    type="text"
                    className="input-field"
                    placeholder="Örn: ankara.edu.tr"
                    value={newInstitutionDomain}
                    onChange={(e) => setNewInstitutionDomain(e.target.value)}
                    required
                  />
                </div>
              </div>
              {addError && (
                <div className={styles.formError} role="alert">{addError}</div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addingInstitution}
                id="add-institution-submit"
              >
                {addingInstitution ? "Ekleniyor..." : "+ Kurum Ekle"}
              </button>
            </form>
          </div>

          {/* Institution List */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Kayıtlı Kurumlar</h3>
            {localInstitutions.length === 0 && (
              <div className={styles.emptyState}>
                Henüz kayıtlı kurum yok. Yukarıdan ekleyin.
              </div>
            )}
            <div className={styles.institutionList}>
              {localInstitutions.map((inst) => {
                const isExpanded = expandedInstId === inst.id;
                const isLoading = loadingInstId === inst.id;
                const users = instUsers[inst.id] ?? [];
                const teachers = users.filter((u) => u.role === "TEACHER");
                const students = users.filter((u) => u.role === "STUDENT");

                return (
                  <div key={inst.id} className={styles.institutionWrapper}>
                    <div
                      className={`${styles.institutionHeaderCard} ${isExpanded ? styles.expandedHeader : ""}`}
                      onClick={() => handleToggleInstitution(inst.id)}
                    >
                      <div className={styles.institutionIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className={styles.institutionInfo}>
                        <span className={styles.institutionName}>{inst.name}</span>
                        <span className={styles.institutionDomain}>{inst.domain}</span>
                      </div>
                      <span className={styles.institutionDate}>
                        {new Date(inst.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`${inst.name} kurumunu silmek istediğinize emin misiniz?`)) {
                            handleDeleteInstitution(inst.id);
                          }
                        }}
                        aria-label={`${inst.name} kurumunu sil`}
                        id={`delete-inst-${inst.id}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className={styles.institutionAccordionBody}>
                        {isLoading ? (
                          <div className={styles.accordionLoading}>Kullanıcılar yükleniyor...</div>
                        ) : users.length === 0 ? (
                          <div className={styles.accordionEmpty}>Kurumda henüz kayıtlı öğretmen veya öğrenci yok.</div>
                        ) : (
                          <div className={styles.accordionGrid}>
                            {/* Eğitmenler Sütunu */}
                            <div className={styles.accordionCol}>
                              <h4 className={styles.accordionColTitle}>👨‍🏫 Eğitmenler ({teachers.length})</h4>
                              {teachers.length === 0 ? (
                                <p className={styles.noUsersText}>Eğitmen kayıtlı değil.</p>
                              ) : (
                                <ul className={styles.userList}>
                                  {teachers.map((t) => (
                                    <li key={t.id} className={styles.userListItem}>
                                      <div className={styles.userListTextName}>{t.firstName} {t.lastName}</div>
                                      <div className={styles.userListTextEmail}>{t.email}</div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {/* Öğrenciler Sütunu */}
                            <div className={styles.accordionCol}>
                              <h4 className={styles.accordionColTitle}>🎓 Öğrenciler ({students.length})</h4>
                              {students.length === 0 ? (
                                <p className={styles.noUsersText}>Öğrenci kayıtlı değil.</p>
                              ) : (
                                <ul className={styles.userList}>
                                  {students.map((s) => (
                                    <li key={s.id} className={styles.userListItem}>
                                      <div className={styles.userListTextName}>{s.firstName} {s.lastName}</div>
                                      <div className={styles.userListTextEmail}>{s.email}</div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
