import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Star, GraduationCap, ChevronRight, Calendar, Users,
  Banknote, Clock, Award, BookOpen, Globe, CheckCircle, ArrowRight, Home,
  Info, Calculator, Receipt, ShieldCheck
} from "lucide-react";
import { universities } from "../data/universities";

const CAMPUS_IMAGE = "https://images.unsplash.com/photo-1682161473727-402b497251b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBtb2Rlcm58ZW58MXx8fHwxNzc0NDk5MDU2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function UniversityDetail() {
  const UNIV_KEY = "bd_admission_universities";
  const { id } = useParams();
  const [allUniversities] = useState<any[]>(() => {
    const stored = localStorage.getItem(UNIV_KEY);
    return stored ? JSON.parse(stored) : universities;
  });
  const university = allUniversities.find(u => u.id === Number(id));
  const [selectedProgramName, setSelectedProgramName] = useState<string | null>(null);

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-[#D4A857]/50 mx-auto mb-4" />
          <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>University Not Found</h2>
          <Link to="/universities" className="px-5 py-2.5 bg-[#C8860A] text-white rounded-xl text-sm">Back to Universities</Link>
        </div>
      </div>
    );
  }

  const u = university;
  const selectedProgram = u.programs?.find((p: any) => p.name === selectedProgramName);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CAMPUS_IMAGE} alt="Campus" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-5">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/universities" className="hover:text-[#D4A857] transition-colors">Universities</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">{u.shortName}</span>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
              <span className="text-[#1A0A02] text-sm font-bold">{u.shortName}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-white" style={{ fontSize: "1.8rem", fontWeight: 700 }}>{u.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs ${u.type === "public" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                  {u.type === "public" ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {u.city}, Bangladesh
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#D4A857] fill-[#D4A857]" />
                  <span>{u.rating}/5.0 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Est. {u.established}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${u.website}`} target="_blank" rel="noopener noreferrer" className="text-[#D4A857] hover:underline">{u.website}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl p-6"
            >
              <h2 className="text-[#1A0A02] mb-3" style={{ fontSize: "1.1rem", fontWeight: 600 }}>About {u.shortName}</h2>
              <p className="text-[#6B3A1F]/70 leading-relaxed">{u.description}</p>
            </motion.div>

            {/* Programs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1A0A02]" style={{ fontSize: "1.1rem", fontWeight: 600 }}>Available Programs</h2>
                <span className="text-xs text-[#6B3A1F]/50">Click a program to see details</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {u.subjects.map((sub: string) => {
                  const isActive = selectedProgramName === sub;
                  const hasDetails = u.programs?.some((p: any) => p.name === sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedProgramName(isActive ? null : sub)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-2 border ${
                        isActive 
                          ? "bg-[#C8860A] text-white border-[#C8860A] shadow-md shadow-[#C8860A]/20" 
                          : "bg-white text-[#C8860A] border-[#D4A857]/30 hover:bg-[#D4A857]/5"
                      }`}
                    >
                       {sub}
                       {hasDetails && <Info className={`w-3 h-3 ${isActive ? "text-white" : "text-[#D4A857]"}`} />}
                    </button>
                  );
                })}
              </div>

              {/* Program Fee Details */}
              <AnimatePresence mode="wait">
                {selectedProgram ? (
                  <motion.div
                    key={selectedProgram.name}
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-gradient-to-br from-[#FFF8F0] to-[#FDF1E3] border border-[#D4A857]/30 rounded-2xl">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-[#C8860A] rounded-xl flex items-center justify-center text-white">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-[#1A0A02] text-sm font-bold">{selectedProgram.name}</h3>
                          <p className="text-[#6B3A1F]/60 text-xs">{selectedProgram.degree} • Full-time</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-[#D4A857]/10">
                            <span className="text-sm text-[#6B3A1F]/70">Tuition Per Credit</span>
                            <span className="text-sm font-bold text-[#1A0A02]">৳{selectedProgram.tuitionPerCredit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-[#D4A857]/10">
                            <span className="text-sm text-[#6B3A1F]/70">Total Credits</span>
                            <span className="text-sm font-bold text-[#1A0A02]">{selectedProgram.totalCredits}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-[#D4A857]/10">
                            <span className="text-sm text-[#6B3A1F]/70">Admission Fee</span>
                            <span className="text-sm font-bold text-[#1A0A02]">৳{selectedProgram.admissionFee.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="bg-white/50 p-4 rounded-xl border border-[#D4A857]/20">
                          <div className="flex items-center gap-2 mb-3 text-[#C8860A]">
                            <Receipt className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Estimated Total Cost</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] text-[#6B3A1F]/50 uppercase">Base Fee (0% Waiver)</p>
                              <p className="text-xl font-bold text-[#1A0A02]">৳{selectedProgram.totalFee0Waiver.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 text-green-700 mb-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase">With 25% Merit Waiver</span>
                              </div>
                              <p className="text-lg font-bold text-green-800">৳{selectedProgram.totalFee25Waiver.toLocaleString()}</p>
                              <p className="text-[10px] text-green-600 mt-0.5">Savings: ৳{(selectedProgram.totalFee0Waiver - selectedProgram.totalFee25Waiver).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : selectedProgramName && !selectedProgram ? (
                  <motion.div
                    initial={{ opacity: 0, marginTop: 0 }}
                    animate={{ opacity: 1, marginTop: 24 }}
                    className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3"
                  >
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Detailed info for {selectedProgramName} is being updated.</p>
                      <p className="text-xs text-blue-600 mt-0.5">Contact our support team for the exact fee structure of this program.</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>

            {/* Admission Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl p-6"
            >
              <h2 className="text-[#1A0A02] mb-4" style={{ fontSize: "1.1rem", fontWeight: 600 }}>Admission Requirements</h2>
              <div className="space-y-3">
                {[
                  { label: "Minimum GPA", value: `SSC + HSC combined ≥ ${u.gpaMin} (each separately ≥ ${Math.max(2, u.gpaMin - 1)})` },
                  { label: "Required Documents", value: "SSC & HSC Marksheet, NID/Birth Certificate, Recent Photograph (2 copies), Testimonial" },
                  { label: "Admission Test", value: u.type === "public" ? "Individual entrance test or GST cluster test required" : "Online MCQ test at university center" },
                  { label: "Application Fee", value: `${u.admissionFee.toLocaleString()} BDT (one-time, non-refundable)` },
                  { label: "Application Deadline", value: u.deadline },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 py-2 border-b border-[#D4A857]/10 last:border-0">
                    <span className="text-[#6B3A1F]/60 text-sm w-36 flex-shrink-0">{label}</span>
                    <span className="text-[#1A0A02] text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Departments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl p-6"
            >
              <h2 className="text-[#1A0A02] mb-4" style={{ fontSize: "1.1rem", fontWeight: 600 }}>Departments & Faculties</h2>
              <div className="space-y-2">
                {u.departments.map((dept: string) => (
                  <div key={dept} className="flex items-center gap-3 p-3 bg-[#FFF8F0] rounded-xl">
                    <CheckCircle className="w-4 h-4 text-[#C8860A] flex-shrink-0" />
                    <span className="text-[#1A0A02] text-sm">{dept}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Stats */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>University Overview</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { icon: Banknote, label: "Tuition / Semester", value: `৳${u.tuitionMin.toLocaleString()} – ৳${u.tuitionMax.toLocaleString()}` },
                  { icon: Banknote, label: "Admission Fee", value: `৳${u.admissionFee.toLocaleString()}` },
                  { icon: Clock, label: "Duration", value: u.duration },
                  { icon: Users, label: "Total Seats", value: u.seats.toLocaleString() },
                  { icon: Award, label: "Min GPA", value: u.gpaMin.toFixed(1) },
                  { icon: Home, label: "Hostel Cost/Month", value: `${u.hostelMin.toLocaleString()} – ${u.hostelMax.toLocaleString()} BDT` },
                  { icon: Calendar, label: "Application Deadline", value: u.deadline },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-2 border-b border-[#D4A857]/10 last:border-0">
                    <div className="w-8 h-8 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#C8860A]" />
                    </div>
                    <div>
                      <p className="text-[#6B3A1F]/60 text-xs">{label}</p>
                      <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Cost Summary (Dynamic based on selection) */}
            <div className="bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-2xl p-5 shadow-xl shadow-[#1A0A02]/20">
              <h3 className="text-[#D4A857] text-sm mb-4" style={{ fontWeight: 600 }}>
                {selectedProgram ? `Summary for ${selectedProgram.name}` : "Estimated Total Cost"}
              </h3>
              <div className="space-y-3 mb-6">
                {[
                  { 
                    label: "Tuition Fees", 
                    value: selectedProgram 
                      ? `৳${selectedProgram.totalFee0Waiver.toLocaleString()}`
                      : `৳${(u.tuitionMin * 8).toLocaleString()} – ৳${(u.tuitionMax * 8).toLocaleString()}` 
                  },
                  { label: "Admission Fee", value: `৳${u.admissionFee.toLocaleString()}` },
                  { 
                    label: "Hostel (4 years)", 
                    value: `৳${(u.hostelMin * 48).toLocaleString()} – ৳${(u.hostelMax * 48).toLocaleString()}` 
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                
                <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                  <div>
                    <span className="text-[#D4A857] text-xs block opacity-60">Estimated Total</span>
                    <span className="text-[#D4A857] text-lg font-bold">
                      {selectedProgram 
                        ? `৳${(selectedProgram.totalFee0Waiver + u.admissionFee + (u.hostelMin * 48)).toLocaleString()}`
                        : `৳${u.totalCostMin.toLocaleString()} – ৳${u.totalCostMax.toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/admission-bondu"
                className="w-full py-3 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all font-bold text-sm"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visit Website */}
            <div className="bg-white border border-[#D4A857]/30 rounded-2xl p-5">
              <p className="text-[#6B3A1F]/60 text-xs mb-3">Official Resources</p>
              <a
                href={`https://${u.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 border border-[#D4A857]/40 text-[#C8860A] rounded-lg flex items-center justify-center gap-2 hover:bg-[#D4A857]/5 transition-all text-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                University Website
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
