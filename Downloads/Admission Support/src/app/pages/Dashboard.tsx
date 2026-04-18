import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  GraduationCap, FileText, CheckCircle, Clock, Bell, CreditCard,
  BookOpen, User, LayoutDashboard, Settings, LogOut, Upload,
  ChevronRight, Star, Plus, Eye, ArrowLeft, Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const applications = [
  {
    id: "BD2026-0341",
    university: "North South University",
    program: "BSc in Computer Science & Engineering",
    status: "Processing",
    submittedDate: "March 15, 2026",
    lastUpdate: "March 19, 2026",
    progress: 60,
    steps: [
      { name: "Application Submitted", done: true, date: "Mar 15" },
      { name: "Documents Verified", done: true, date: "Mar 17" },
      { name: "Form Filled by Agent", done: true, date: "Mar 19" },
      { name: "Submitted to University", done: false, date: "Pending" },
      { name: "Admission Confirmed", done: false, date: "Pending" },
    ],
  },
  {
    id: "BD2026-0342",
    university: "BRAC University",
    program: "BSc in CSE",
    status: "Pending",
    submittedDate: "March 16, 2026",
    lastUpdate: "March 16, 2026",
    progress: 20,
    steps: [
      { name: "Application Submitted", done: true, date: "Mar 16" },
      { name: "Documents Verified", done: false, date: "Pending" },
      { name: "Form Filled by Agent", done: false, date: "Pending" },
      { name: "Submitted to University", done: false, date: "Pending" },
      { name: "Admission Confirmed", done: false, date: "Pending" },
    ],
  },
  {
    id: "BD2026-0215",
    university: "East West University",
    program: "BBA",
    status: "Approved",
    submittedDate: "February 20, 2026",
    lastUpdate: "March 10, 2026",
    progress: 100,
    steps: [
      { name: "Application Submitted", done: true, date: "Feb 20" },
      { name: "Documents Verified", done: true, date: "Feb 22" },
      { name: "Form Filled by Agent", done: true, date: "Feb 24" },
      { name: "Submitted to University", done: true, date: "Feb 26" },
      { name: "Admission Confirmed", done: true, date: "Mar 10" },
    ],
  },
];

const notifications = [
  { id: 1, text: "Your application BD2026-0341 (NSU) status updated to 'Form Filled by Agent'", time: "2 hours ago", unread: true },
  { id: 2, text: "New notice: JU Admission Test Schedule 2026 published", time: "5 hours ago", unread: true },
  { id: 3, text: "Document verification for BD2026-0342 is pending", time: "1 day ago", unread: false },
  { id: 4, text: "EWU admission confirmed! Congratulations! Download your letter.", time: "15 days ago", unread: false },
];

const savedUniversities = [
  { name: "North South University", city: "Dhaka", type: "Private", fee: "৳25K–45K/sem" },
  { name: "BRAC University", city: "Dhaka", type: "Private", fee: "৳25K–45K/sem" },
  { name: "BUET", city: "Dhaka", type: "Public", fee: "৳1K–4K/sem" },
  { name: "Daffodil Intl. Univ.", city: "Dhaka", type: "Private", fee: "৳18K–35K/sem" },
];

const payments = [
  { desc: "Standard Package — NSU Application", amount: "৳5,000", date: "Mar 15, 2026", method: "bKash", status: "Paid" },
  { desc: "Basic Package — BRAC Application", amount: "৳2,000", date: "Mar 16, 2026", method: "Nagad", status: "Paid" },
  { desc: "Standard Package — EWU Application", amount: "৳5,000", date: "Feb 20, 2026", method: "Card", status: "Paid" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Overview", key: "overview" },
  { icon: FileText, label: "My Applications", key: "applications", badge: 2 },
  { icon: Bell, label: "Notifications", key: "notifications", badge: 2 },
  { icon: BookOpen, label: "Saved Universities", key: "saved" },
  { icon: CreditCard, label: "Payment History", key: "payments" },
  { icon: Upload, label: "Documents", key: "documents" },
  { icon: User, label: "My Profile", key: "profile" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Approved: "bg-green-50 text-green-700 border border-green-200",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
};

export default function Dashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load applications from localStorage
  useEffect(() => {
    if (user) {
      const APPS_KEY = "bd_admission_applications";
      const stored = localStorage.getItem(APPS_KEY);
      const allApps = stored ? JSON.parse(stored) : [];
      // Filter by user email
      const filtered = allApps.filter((app: any) => app.studentEmail === user.email);
      setUserApplications(filtered);
    }
  }, [user]);

  // Guard: redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    { label: "Total Applications", value: userApplications.length.toString(), icon: FileText, color: "#D4A857" },
    { label: "In Progress", value: userApplications.filter(a => a.status === "Processing" || a.status === "Pending").length.toString(), icon: Clock, color: "#3b82f6" },
    { label: "Approved", value: userApplications.filter(a => a.status === "Approved").length.toString(), icon: CheckCircle, color: "#22c55e" },
    { label: "Pending Payments", value: "0", icon: CreditCard, color: "#a855f7" },
  ];

  const SidebarContent = () => (
    <>
      {/* User Info */}
      <div className="px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#1A0A02] text-sm" style={{ fontWeight: 700 }}>{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{user.name}</p>
            <p className="text-[#D4A857]/70 text-xs">{user.studentId}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ icon: Icon, label, key, badge }) => (
          <button
            key={key}
            onClick={() => { setActiveSection(key); setSelectedApp(null); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeSection === key
                ? "bg-[#D4A857]/15 text-[#D4A857]"
                : "text-white/55 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon style={{ width: 16, height: 16 }} />
              <span>{label}</span>
            </div>
            {badge && (
              <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/8 space-y-0.5">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-[#1A0A02] flex-col fixed top-0 left-0 h-screen">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-white/8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-lg flex items-center justify-center">
              <GraduationCap style={{ width: 16, height: 16, color: "#1A0A02" }} />
            </div>
            <div className="leading-none">
              <span className="text-white text-xs block" style={{ fontWeight: 700 }}>BD Admission</span>
              <span className="text-[#D4A857]/70 text-[10px]">Support System</span>
            </div>
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-[#1A0A02] flex flex-col h-full">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <div className="px-4 py-4 border-b border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-lg flex items-center justify-center">
                  <GraduationCap style={{ width: 16, height: 16, color: "#1A0A02" }} />
                </div>
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>BD Admission</span>
              </div>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-60 min-w-0">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="text-[#1A0A02]/60 hover:text-[#1A0A02] transition-colors">
            <Menu style={{ width: 22, height: 22 }} />
          </button>
          <span className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>
            {navItems.find((n) => n.key === activeSection)?.label}
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-full flex items-center justify-center">
            <span className="text-[#1A0A02] text-xs" style={{ fontWeight: 700 }}>{initials}</span>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-5xl">
          {/* ── OVERVIEW ──────────────────────────────────── */}
          {activeSection === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6">
                <h1 className="text-[#1A0A02] mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                  Welcome back, {user.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-[#6B3A1F]/60 text-sm">Here's your admission progress summary.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 border border-[#E8D5B7]/60">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                      <Icon style={{ width: 18, height: 18, color }} />
                    </div>
                    <div className="text-[#1A0A02]" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</div>
                    <div className="text-[#6B3A1F]/55 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl overflow-hidden mb-4">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D5B7]/50">
                  <h2 className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>Recent Applications</h2>
                  <button onClick={() => setActiveSection("applications")} className="text-[#C8860A] text-xs flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
                <div className="divide-y divide-[#E8D5B7]/40">
                  {userApplications.length === 0 ? (
                    <div className="px-5 py-8 text-center text-[#6B3A1F]/50 text-xs italic">No current applications. Click "New Application" to start.</div>
                  ) : (
                    userApplications.slice(0, 3).map((app: any) => (
                      <div key={app.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#FFF8F0] transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1A0A02] text-sm truncate" style={{ fontWeight: 600 }}>{app.university}</p>
                          <p className="text-[#6B3A1F]/50 text-xs truncate">{app.university === 'Not specified' ? app.subject : app.program || app.subject}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                          <div className="w-20 h-1.5 bg-[#E8D5B7]/60 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#D4A857] to-[#C8860A] rounded-full" style={{ width: `${app.progress}%` }} />
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusStyle[app.status]}`}>{app.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D5B7]/50">
                  <h2 className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>Recent Notifications</h2>
                  <button onClick={() => setActiveSection("notifications")} className="text-[#C8860A] text-xs flex items-center gap-1">
                    View All <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
                <div className="divide-y divide-[#E8D5B7]/40">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 ${n.unread ? "bg-[#D4A857]/5" : ""}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${n.unread ? "bg-[#C8860A]" : "bg-[#D4A857]/30"}`} />
                      <div>
                        <p className="text-[#1A0A02] text-xs leading-relaxed">{n.text}</p>
                        <p className="text-[#6B3A1F]/40 text-xs mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── APPLICATIONS ─────────────────────────────── */}
          {activeSection === "applications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-[#1A0A02]" style={{ fontSize: "1.4rem", fontWeight: 700 }}>My Applications</h1>
                <Link
                  to="/admission-bondu"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl text-sm hover:opacity-90 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <Plus style={{ width: 15, height: 15 }} />
                  New Application
                </Link>
              </div>

              {selectedApp ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <button onClick={() => setSelectedApp(null)} className="flex items-center gap-1.5 text-[#C8860A] text-sm mb-4 hover:gap-2.5 transition-all">
                    <ArrowLeft style={{ width: 16, height: 16 }} />
                    Back to Applications
                  </button>
                  <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h2 className="text-[#1A0A02] mb-0.5" style={{ fontWeight: 700 }}>{selectedApp.university}</h2>
                        <p className="text-[#6B3A1F]/70 text-sm">{selectedApp.program || selectedApp.subject}</p>
                        <p className="text-xs text-[#6B3A1F]/40 mt-1">Ref: {selectedApp.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusStyle[selectedApp.status]}`}>{selectedApp.status}</span>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#6B3A1F]/50">Overall Progress</span>
                        <span className="text-[#C8860A]" style={{ fontWeight: 600 }}>{selectedApp.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#E8D5B7]/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D4A857] to-[#C8860A] rounded-full transition-all" style={{ width: `${selectedApp.progress}%` }} />
                      </div>
                    </div>

                    <h3 className="text-[#1A0A02] text-sm mb-4" style={{ fontWeight: 600 }}>Application Timeline</h3>
                    <div className="space-y-3">
                      {selectedApp.steps?.map((s: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-[#C8860A]" : "bg-white border-2 border-[#E8D5B7]"}`}>
                              {s.done
                                ? <CheckCircle style={{ width: 14, height: 14, color: "white" }} />
                                : <Clock style={{ width: 13, height: 13, color: "#C8860A30" }} />}
                            </div>
                            {i < (selectedApp.steps?.length || 0) - 1 && (
                              <div className={`w-px h-5 mt-1 ${s.done ? "bg-[#C8860A]/40" : "bg-[#E8D5B7]"}`} />
                            )}
                          </div>
                          <div className="pb-1">
                            <p className={`text-sm ${s.done ? "text-[#1A0A02]" : "text-[#6B3A1F]/40"}`} style={{ fontWeight: s.done ? 600 : 400 }}>
                              {s.name}
                            </p>
                            <p className="text-xs text-[#6B3A1F]/40">{s.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {userApplications.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#D4A857]/40 rounded-2xl p-12 text-center">
                       <FileText className="w-12 h-12 text-[#D4A857]/30 mx-auto mb-4" />
                       <h3 className="text-[#1A0A02] font-bold">No Applications Found</h3>
                       <p className="text-[#6B3A1F]/50 text-sm mb-6">You haven't submitted any admission applications yet.</p>
                       <Link to="/admission-bondu" className="px-6 py-3 bg-[#1A0A02] text-[#D4A857] rounded-xl text-sm font-bold">Start New Application</Link>
                    </div>
                  ) : (
                    userApplications.map((app: any, i: number) => (
                      <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl p-5 hover:shadow-md hover:border-[#D4A857]/40 transition-all">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{app.university}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${statusStyle[app.status]}`}>{app.status}</span>
                              </div>
                              <p className="text-[#6B3A1F]/60 text-sm">{app.university === 'Not specified' ? app.subject : app.program || app.subject}</p>
                              <p className="text-[#6B3A1F]/40 text-xs mt-0.5">Ref: {app.id} · {app.submittedDate}</p>
                            </div>
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#D4A857]/30 text-[#C8860A] rounded-lg text-xs hover:bg-[#D4A857]/10 transition-all flex-shrink-0"
                            >
                              <Eye style={{ width: 13, height: 13 }} />
                              Track
                            </button>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-[#6B3A1F]/50">Progress</span>
                              <span className="text-[#C8860A]" style={{ fontWeight: 600 }}>{app.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-[#E8D5B7]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#D4A857] to-[#C8860A] rounded-full" style={{ width: `${app.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── NOTIFICATIONS ─────────────────────────────── */}
          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-[#1A0A02] mb-5" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Notifications</h1>
              <div className="space-y-2">
                {notifications.map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className={`bg-white border rounded-2xl p-4 flex items-start gap-3 ${n.unread ? "border-[#D4A857]/40" : "border-[#E8D5B7]/60"}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-[#C8860A]" : "bg-[#D4A857]/30"}`} />
                      <div className="flex-1">
                        <p className="text-[#1A0A02] text-sm leading-relaxed">{n.text}</p>
                        <p className="text-[#6B3A1F]/45 text-xs mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="px-2 py-0.5 bg-[#D4A857]/15 text-[#C8860A] text-xs rounded-full flex-shrink-0" style={{ fontWeight: 600 }}>New</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SAVED UNIVERSITIES ─────────────────────────── */}
          {activeSection === "saved" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-[#1A0A02]" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Saved Universities</h1>
                <Link
                  to="/universities"
                  className="flex items-center gap-1.5 px-3 py-2 border border-[#D4A857]/30 text-[#C8860A] rounded-xl text-sm hover:bg-[#D4A857]/10 transition-all"
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  Find More
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {savedUniversities.map((uni, i) => (
                  <motion.div key={uni.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-[#3B1A0A] to-[#6B3A1F] rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap style={{ width: 18, height: 18, color: "#D4A857" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1A0A02] text-sm truncate" style={{ fontWeight: 600 }}>{uni.name}</p>
                        <p className="text-[#6B3A1F]/55 text-xs">{uni.city} · {uni.type}</p>
                        <p className="text-[#C8860A] text-xs mt-0.5" style={{ fontWeight: 600 }}>{uni.fee}</p>
                      </div>
                      <Link to="/universities" className="text-[#D4A857]/60 hover:text-[#D4A857] transition-colors">
                        <ChevronRight style={{ width: 18, height: 18 }} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PAYMENTS ──────────────────────────────────── */}
          {activeSection === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-[#1A0A02] mb-5" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Payment History</h1>
              <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#FFF8F0] border-b border-[#E8D5B7]/50">
                      <tr>
                        {["Description", "Amount", "Date", "Method", "Status"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-[#6B3A1F]/50 text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D5B7]/30">
                      {payments.map((p, i) => (
                        <tr key={i} className="hover:bg-[#FFF8F0] transition-colors">
                          <td className="px-5 py-4 text-[#1A0A02] text-sm">{p.desc}</td>
                          <td className="px-5 py-4 text-[#C8860A] text-sm" style={{ fontWeight: 600 }}>{p.amount}</td>
                          <td className="px-5 py-4 text-[#6B3A1F]/60 text-sm">{p.date}</td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-0.5 bg-[#D4A857]/10 text-[#C8860A] text-xs rounded-full">{p.method}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full">{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DOCUMENTS ────────────────────────────────── */}
          {activeSection === "documents" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-[#1A0A02]" style={{ fontSize: "1.4rem", fontWeight: 700 }}>My Documents</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl text-sm hover:opacity-90" style={{ fontWeight: 600 }}>
                  <Upload style={{ width: 14, height: 14 }} />
                  Upload
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: "SSC Marksheet", status: "Verified", date: "Mar 15, 2026" },
                  { name: "HSC Marksheet", status: "Verified", date: "Mar 15, 2026" },
                  { name: "SSC Certificate", status: "Verified", date: "Mar 16, 2026" },
                  { name: "HSC Certificate", status: "Pending", date: "Uploaded Mar 16" },
                  { name: "National ID Card", status: "Verified", date: "Mar 15, 2026" },
                  { name: "Testimonial", status: "Missing", date: "Not uploaded" },
                  { name: "Passport Photo (×4)", status: "Verified", date: "Mar 15, 2026" },
                ].map(({ name, status, date }) => (
                  <div key={name} className="bg-white border border-[#E8D5B7]/60 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText style={{ width: 16, height: 16, color: "#C8860A" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1A0A02] text-sm truncate" style={{ fontWeight: 600 }}>{name}</p>
                      <p className="text-[#6B3A1F]/45 text-xs">{date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                      status === "Verified" ? "bg-green-50 text-green-700 border border-green-200"
                      : status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                    }`}>{status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PROFILE ──────────────────────────────────── */}
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-[#1A0A02] mb-5" style={{ fontSize: "1.4rem", fontWeight: 700 }}>My Profile</h1>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl p-5 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#1A0A02] text-2xl" style={{ fontWeight: 700 }}>{initials}</span>
                    </div>
                    <h3 className="text-[#1A0A02] mb-0.5 text-base" style={{ fontWeight: 700 }}>{user.name}</h3>
                    <p className="text-[#6B3A1F]/55 text-xs mb-4">{user.studentId}</p>
                    <div className="flex items-center justify-center gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} style={{ width: 14, height: 14, color: "#D4A857", fill: "#D4A857" }} />
                      ))}
                      <span className="text-[#6B3A1F]/55 text-xs ml-1">Premium</span>
                    </div>
                    <button className="w-full py-2 border border-[#D4A857]/30 text-[#C8860A] rounded-xl text-sm hover:bg-[#D4A857]/10 transition-all">
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl p-5">
                    <h3 className="text-[#1A0A02] text-sm mb-5" style={{ fontWeight: 600 }}>Personal Information</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                      {[
                        { label: "Full Name", value: user.name },
                        { label: "Phone", value: user.phone },
                        { label: "Email", value: user.email },
                        { label: "Student ID", value: user.studentId },
                        { label: "SSC GPA", value: user.sscGpa || "Not added" },
                        { label: "HSC GPA", value: user.hscGpa || "Not added" },
                        { label: "Preferred Subject", value: user.subject || "Not selected" },
                      ].map(({ label, value }) => (
                        <div key={label} className="py-3 border-b border-[#E8D5B7]/30">
                          <p className="text-[#6B3A1F]/45 text-xs mb-0.5">{label}</p>
                          <p className="text-[#1A0A02] text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS ─────────────────────────────────── */}
          {activeSection === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-[#1A0A02] mb-5" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Settings</h1>
              <div className="bg-white border border-[#E8D5B7]/60 rounded-2xl divide-y divide-[#E8D5B7]/40">
                {[
                  { label: "Notification Preferences", desc: "Manage email and SMS notifications" },
                  { label: "Change Password", desc: "Update your account password" },
                  { label: "Language", desc: "Currently set to English" },
                  { label: "Privacy Settings", desc: "Control your data and privacy" },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-4 hover:bg-[#FFF8F0] transition-colors cursor-pointer">
                    <div>
                      <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{label}</p>
                      <p className="text-[#6B3A1F]/50 text-xs">{desc}</p>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: "#C8860A40" }} />
                  </div>
                ))}
                <div className="px-5 py-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm transition-colors"
                  >
                    <LogOut style={{ width: 15, height: 15 }} />
                    Sign Out of Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
