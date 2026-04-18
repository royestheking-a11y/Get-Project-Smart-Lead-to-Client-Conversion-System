import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Menu, X, GraduationCap, ChevronDown, LogOut,
  User, LayoutDashboard, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { 
    label: "বিশ্ববিদ্যালয়", 
    labelEn: "Universities", 
    path: "/universities",
    children: [
      { label: "সকল বিশ্ববিদ্যালয়", labelEn: "All Universities", path: "/universities" },
      { label: "মেডিকেল", labelEn: "Medical", path: "/medical-admission" },
      { label: "পলিটেকনিক", labelEn: "Polytechnic", path: "/polytechnic-admission" },
    ]
  },
  { label: "অ্যাডমিশন", labelEn: "Admission", path: "/admission-bondu" },
  { label: "আবাসন", labelEn: "Accommodation", path: "/accommodation" },
  { label: "টিউটোরিয়াল", labelEn: "Tutorial", path: "/tutorial" },
  { label: "নোটিশ বোর্ড", labelEn: "Notice", path: "/notice" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [univMobileOpen, setUnivMobileOpen] = useState(false);
  const [univHovered, setUnivHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-50 bg-[#1E0C03] border-b border-[#D4A857]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-[#1A0A02]" style={{ width: 18, height: 18 }} />
            </div>
            <div className="leading-none">
              <span className="text-white text-sm block" style={{ fontWeight: 700, letterSpacing: "-0.3px" }}>Admission</span>
              <span className="text-[#D4A857]/80 text-[10px]">Bondu</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div 
                key={link.labelEn} 
                className="relative"
                onMouseEnter={() => link.children && setUnivHovered(true)}
                onMouseLeave={() => link.children && setUnivHovered(false)}
              >
                {link.children ? (
                  <>
                    <button
                      className={`px-3.5 py-2 rounded-lg text-[13px] flex items-center gap-1.5 transition-all duration-150 ${
                        isActive(link.path) || univHovered
                          ? "text-[#D4A857] bg-[#D4A857]/10"
                          : "text-white/65 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.labelEn}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${univHovered ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {univHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 top-full mt-1 w-48 bg-[#1A0A02] border border-[#D4A857]/20 rounded-xl shadow-2xl py-1 z-[60]"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setUnivHovered(false)}
                              className={`flex items-center px-4 py-2.5 text-xs transition-colors ${
                                isActive(child.path)
                                  ? "text-[#D4A857] bg-[#D4A857]/5"
                                  : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {child.labelEn}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-[13px] transition-all duration-150 block ${
                      isActive(link.path)
                        ? "text-[#D4A857] bg-[#D4A857]/10"
                        : "text-white/65 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.labelEn}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn && user ? (
              <>
                <Link
                  to="/notice"
                  className="relative w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-[#D4A857] hover:bg-white/5 transition-all"
                >
                  <Bell style={{ width: 16, height: 16 }} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-[#D4A857]/20 hover:border-[#D4A857]/40 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4A857] to-[#A8742C] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1A0A02] text-xs" style={{ fontWeight: 700 }}>{initials}</span>
                    </div>
                    <span className="text-white/80 text-xs max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={`text-white/40 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} style={{ width: 12, height: 12 }} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#1A0A02] border border-[#D4A857]/20 rounded-xl shadow-2xl py-1 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-[#D4A857]/10">
                          <p className="text-white text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                          <p className="text-[#D4A857]/70 text-xs mt-0.5">{user.studentId}</p>
                        </div>
                        <Link
                          to={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                          <LayoutDashboard style={{ width: 15, height: 15 }} />
                          {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                        </Link>
                        {user.role !== "admin" && (
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
                          >
                            <User style={{ width: 15, height: 15 }} />
                            My Profile
                          </Link>
                        )}
                        <div className="border-t border-[#D4A857]/10 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm w-full"
                          >
                            <LogOut style={{ width: 15, height: 15 }} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-[#D4A857] to-[#A8742C] text-[#1A0A02] text-sm rounded-lg hover:opacity-90 transition-all"
                style={{ fontWeight: 600 }}
              >
                Login / Register
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white"
          >
            {isOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#1A0A02] border-t border-[#D4A857]/10 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="space-y-0.5 mb-3">
                {navLinks.map((link) => (
                  <div key={link.labelEn}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() => setUnivMobileOpen(!univMobileOpen)}
                          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            univMobileOpen ? "text-[#D4A857] bg-[#D4A857]/10" : "text-white/70"
                          }`}
                        >
                          {link.labelEn}
                          <ChevronDown className={`w-4 h-4 transition-transform ${univMobileOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {univMobileOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4 space-y-0.5 mt-1"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  onClick={() => { setIsOpen(false); setUnivMobileOpen(false); }}
                                  className={`flex items-center px-3 py-2 rounded-lg text-xs transition-colors ${
                                    isActive(child.path) ? "text-[#D4A857]" : "text-white/50"
                                  }`}
                                >
                                  {child.labelEn}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive(link.path)
                            ? "text-[#D4A857] bg-[#D4A857]/10"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.labelEn}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-[#D4A857]/10 pt-3">
                {isLoggedIn && user ? (
                  <div>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A857] to-[#A8742C] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1A0A02] text-sm" style={{ fontWeight: 700 }}>{initials}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                        <p className="text-[#D4A857]/70 text-xs">{user.studentId}</p>
                      </div>
                    </div>
                    <Link
                      to={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors"
                    >
                      <LayoutDashboard style={{ width: 16, height: 16 }} />
                      {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm w-full transition-colors mt-1"
                    >
                      <LogOut style={{ width: 16, height: 16 }} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#D4A857] to-[#A8742C] text-[#1A0A02] rounded-lg text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
