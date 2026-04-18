import React, { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight,
  Info,
  CheckCircle,
  Calendar,
  AlertCircle,
  ChevronRight,
  Award,
  FileText,
  Star,
  Users
} from "lucide-react";
import { universities } from "../data/universities";

const TECH_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHN0dWRlbnRzfGVufDF8fHx8MTc3NDQ5OTA1OEww&ixlib=rb-4.1.0&q=80&w=1080";

const eligibilityCriteria = [
  "Diploma in Engineering from any recognized Polytechnic Institute/BTEB",
  "Minimum CGPA 2.50 to 3.00 (varies by university)",
  "Completion of 4-year diploma sequence",
  "Must have a valid BTEB registration/passing certificate",
  "Evening programs often require experience or specific engineering branch matching",
  "Public universities (DUET) require clearing a highly competitive admission test",
];

const examInfo = [
  { label: "Target Institution", value: "DUET (Public), Private Universities (Daffodil, UIU, BUBT)" },
  { label: "Admission Type", value: "Lateral Entry / Evening / BSc in Technical Education" },
  { label: "Duration", value: "3.5 to 4 Years (depending on credit waivers)" },
  { label: "Majors", value: "CSE, EEE, Civil, Mechanical, Textile, Architecture, etc." },
  { label: "Registration fee", value: "200 - 1,000 BDT (varies per institution)" },
];

const PolytechnicAdmission = () => {
  const UNIV_KEY = "bd_admission_universities";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [allUniversities] = useState<any[]>(() => {
    const stored = localStorage.getItem(UNIV_KEY);
    return stored ? JSON.parse(stored) : universities;
  });

  const polytechnicUnis = allUniversities.filter(uni => 
    uni.diplomaFriendly === true || 
    uni.shortName === "DUET" ||
    uni.name.toLowerCase().includes("engineering")
  );

  const filteredUnis = polytechnicUnis.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || uni.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={TECH_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Polytechnic Admission</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-[#1A0A02]" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
                Polytechnic Admission <span className="text-[#D4A857]">Support</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl">
                Empowering Diploma-in-Engineering students to pursue their BSc goals. Find the best public and private universities that value your technical expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#D4A857] text-[#1A0A02] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-bold">DUET 2025-26 Admission: Circular expected soon — Keep your diploma transcripts ready.</p>
          <a href="https://duet.ac.bd" target="_blank" rel="noopener noreferrer" className="underline text-xs hover:opacity-80">Official Portal →</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Admission Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1A0A02] to-[#3B1A0A] px-6 py-4">
                <h2 className="text-[#D4A857]" style={{ fontSize: "1rem", fontWeight: 600 }}>Diploma Admission Eligibility</h2>
              </div>
              <div className="p-6 space-y-3">
                {eligibilityCriteria.map((crit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[#1A0A02] text-sm">{crit}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1A0A02] to-[#3B1A0A] px-6 py-4">
                <h2 className="text-[#D4A857]" style={{ fontSize: "1rem", fontWeight: 600 }}>Admission Process & Expectations</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {examInfo.map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-2.5 border-b border-[#D4A857]/10 last:border-0">
                      <span className="text-[#6B3A1F]/60 text-sm w-40 flex-shrink-0">{label}</span>
                      <span className="text-[#1A0A02] text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* University List */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-[#1A0A02] font-black text-xl flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#D4A857]" />
                  Diploma Friendly Universities ({filteredUnis.length})
                </h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-[#D4A857]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-[#D4A857]/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-1">
                    {["all", "public", "private"].map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all ${
                          filterType === t 
                            ? "bg-[#1A0A02] text-[#D4A857] shadow-lg shadow-[#1A0A02]/10" 
                            : "bg-white border border-[#D4A857]/20 text-[#6B3A1F] hover:bg-[#D4A857]/5"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredUnis.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#D4A857]/30"
                    >
                      <AlertCircle className="w-12 h-12 text-[#D4A857]/30 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-[#1A0A02] mb-1">No Universities Found</h3>
                      <p className="text-[#6B3A1F]/50 text-sm">Try searching with a different term.</p>
                    </motion.div>
                  ) : (
                    filteredUnis.map((uni, idx) => (
                      <motion.div
                        key={uni.shortName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-[2.5rem] border border-[#D4A857]/10 shadow-sm hover:shadow-xl hover:shadow-[#D4A857]/5 transition-all overflow-hidden"
                      >
                         <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-[#1A0A02]/10 relative overflow-hidden">
                               <div className="absolute inset-0 bg-[#D4A857]/5" />
                               <span className="text-[#D4A857] text-2xl font-black relative z-10">{uni.logo}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                               <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${uni.type === 'public' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-[#FFF8F0] text-[#A8742C] border border-[#D4A857]/20'}`}>
                                     {uni.type}
                                  </span>
                                  <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 rounded-lg text-[9px] font-black uppercase tracking-widest">Diploma Friendly</span>
                               </div>
                               <h3 className="text-xl font-black text-[#1A0A02] group-hover:text-[#A8742C] transition-colors line-clamp-1">{uni.name} ({uni.shortName})</h3>
                               <div className="flex flex-wrap items-center gap-4 mt-3 text-[#6B3A1F]/60">
                                  <div className="flex items-center gap-1.5 text-xs">
                                     <MapPin className="w-3.5 h-3.5 text-[#D4A857]" /> {uni.city}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs">
                                     <Star className="w-3.5 h-3.5 text-[#D4A857] fill-[#D4A857]" /> {uni.rating || "4.5"}/5
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs">
                                     <BookOpen className="w-3.5 h-3.5 text-[#D4A857]" /> {uni.subjects.length}+ Courses
                                  </div>
                               </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-[#D4A857]/5 gap-4">
                               <div className="text-left md:text-right">
                                  <p className="text-[10px] text-[#6B3A1F]/40 font-bold uppercase tracking-widest mb-0.5">Est. Semester Fee</p>
                                  <p className="text-lg font-black text-[#1A0A02]">৳{(uni.tuitionMin/1000).toFixed(0)}K-{(uni.tuitionMax/1000).toFixed(0)}K</p>
                               </div>
                               <Link to={`/universities/${uni.id}`} className="w-12 h-12 bg-[#1A0A02] text-[#D4A857] rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#1A0A02]/20 group/btn">
                                  <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                         </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Stats */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Diploma Stats at a Glance</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "DUET Intake (Annual)", value: "~600", icon: Users, color: "text-[#D4A857]" },
                  { label: "Private Uni Intake", value: "Thousands", icon: Users, color: "text-[#D4A857]" },
                  { label: "Total Diploma Holders", value: "50k+", icon: Award, color: "text-[#D4A857]" },
                  { label: "BSc Duration (Evening)", value: "4 Years", icon: Clock, color: "text-[#D4A857]" },
                  { label: "Min Requirements", value: "GPA 2.50+", icon: BookOpen, color: "text-[#D4A857]" },
                  { label: "Engineering Branches", value: "15+", icon: Building2, color: "text-[#D4A857]" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#D4A857]/10 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-[#6B3A1F]/70">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-xs">{label}</span>
                    </div>
                    <span className="text-[#1A0A02] text-xs font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Diploma Admission Flow</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { event: "Diploma Final Results", date: "Varies by BTEB" },
                  { event: "Industrial Training Comp.", date: "Semester 8" },
                  { event: "DUET Admission Test", date: "Once a year" },
                  { event: "Private Uni Intake (Spring)", date: "Jan - Feb" },
                  { event: "Private Uni Intake (Summer)", date: "May - June" },
                  { event: "Private Uni Intake (Fall)", date: "Sept - Oct" },
                ].map(({ event, date }) => (
                  <div key={event} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D4A857] rounded-full flex-shrink-0 shadow-sm" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-[#1A0A02] text-[11px] font-medium">{event}</span>
                      <span className="text-[#6B3A1F]/60 text-[10px]">{date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-2xl p-5 text-white text-center shadow-xl border border-[#D4A857]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A857]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-[#D4A857]" />
              <h3 className="mb-2 relative z-10 text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>Need Career Counseling?</h3>
              <p className="text-white/70 text-xs mb-4 relative z-10 leading-relaxed">Confused between DUET or Private? Our experts specialize in diploma engineering career paths.</p>
              <Link
                to="/admission-bondu"
                className="relative z-10 block w-full py-3 bg-[#D4A857] text-[#1A0A02] rounded-xl text-xs flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all font-black uppercase tracking-wider"
              >
                <FileText className="w-4 h-4" />
                GET COUNSELING SUPPORT
              </Link>
            </div>

            {/* Official Links */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-5 shadow-sm">
              <h3 className="text-[#1A0A02] mb-3 text-sm font-bold uppercase tracking-wider" style={{ fontSize: "0.8rem" }}>Official Technical Links</h3>
              <div className="space-y-1">
                {[
                  { name: "BTEB Official Site", url: "bteb.gov.bd" },
                  { name: "DUET Admission Portal", url: "duet.ac.bd" },
                  { name: "Technical Edu. Board", url: "techedu.gov.bd" },
                  { name: "IEB Bangladesh", url: "iebbd.org" },
                ].map(({ name, url }) => (
                  <a
                    key={name}
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2.5 text-xs text-[#C8860A] hover:text-[#D4A857] transition-colors border-b border-[#D4A857]/10 last:border-0 font-medium"
                  >
                    {name}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolytechnicAdmission;
