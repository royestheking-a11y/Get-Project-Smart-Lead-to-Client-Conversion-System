import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Heart, MapPin, Star, ChevronRight, Users, Clock,
  BookOpen, Award, CheckCircle, AlertCircle, FileText
} from "lucide-react";
import { medicalColleges } from "../data/universities";

const MED_IMAGE = "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3R1ZGVudHMlMjBob3NwaXRhbCUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzQ0OTkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

const eligibilityCriteria = [
  "SSC + HSC combined GPA minimum 9.00 (without 4th subject)",
  "Minimum GPA 3.50 in each (SSC and HSC separately)",
  "Biology and Chemistry must be studied in HSC",
  "Must be a Bangladeshi citizen",
  "Age not more than 30 years on 1st January of admission year",
  "MBBS entrance test score above cutoff (DGHS centralized)",
];

const examInfo = [
  { label: "Test Authority", value: "DGME (Directorate General of Medical Education)" },
  { label: "Test Type", value: "MCQ — Biology, Chemistry, Physics, English, General Knowledge" },
  { label: "Total Marks", value: "100 marks (Biology 30 + Chemistry 25 + Physics 20 + English 15 + GK 10)" },
  { label: "Negative Marking", value: "0.25 per wrong answer" },
  { label: "Test Duration", value: "1 hour" },
  { label: "Application Fee", value: "1,200 BDT (via Teletalk/DGME portal)" },
  { label: "Apply At", value: "dgme.teletalk.com.bd" },
  { label: "Admission Year", value: "2025-2026" },
];

export default function MedicalAdmission() {
  const MED_KEY = "bd_admission_medical";
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("");
  const [colleges] = useState<any[]>(() => {
    const stored = localStorage.getItem(MED_KEY);
    return stored ? JSON.parse(stored) : medicalColleges;
  });

  const filtered = colleges.filter(c => {
    if (filterType !== "all" && c.type !== filterType) return false;
    if (filterCity && c.city !== filterCity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={MED_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Medical Admission</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
                Medical Admission <span className="text-[#D4A857]">2025-26</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl">
                Complete guide to MBBS and BDS admissions in Bangladesh. Government medical colleges, private colleges, eligibility, process and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">Medical Admission Test 2025-26: Application deadline — Check DGME portal for latest dates</p>
          <a href="#" className="underline text-xs text-white/80 hover:text-white">dgme.teletalk.com.bd →</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1A0A02] to-[#3B1A0A] px-6 py-4">
                <h2 className="text-[#D4A857]" style={{ fontSize: "1rem", fontWeight: 600 }}>Eligibility Criteria</h2>
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

            {/* Exam Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#1A0A02] to-[#3B1A0A] px-6 py-4">
                <h2 className="text-[#D4A857]" style={{ fontSize: "1rem", fontWeight: 600 }}>MBBS Admission Exam Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {examInfo.map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-2.5 border-b border-[#D4A857]/10 last:border-0">
                      <span className="text-[#6B3A1F]/60 text-sm w-40 flex-shrink-0">{label}</span>
                      <span className="text-[#1A0A02] text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Medical Colleges */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1A0A02]" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Medical Colleges</h2>
                <div className="flex gap-2">
                  {["all", "public", "private"].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                        filterType === t ? "bg-[#C8860A] text-white" : "bg-white border border-[#D4A857]/30 text-[#6B3A1F]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filtered.map((college, i) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-[#D4A857]/20 rounded-2xl p-5 hover:shadow-lg hover:border-[#D4A857]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Heart className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[#1A0A02]" style={{ fontSize: "0.95rem", fontWeight: 600 }}>{college.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${college.type === "public" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                              {college.type === "public" ? "Govt." : "Private"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B3A1F]/60">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {college.city}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {college.seats} seats
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {college.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-[#D4A857] fill-[#D4A857]" />
                              {college.rating}
                            </div>
                          </div>
                          <p className="text-[#6B3A1F]/60 text-sm mt-2">{college.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-[#6B3A1F]/50">Admission Fee</p>
                        <p className="text-[#C8860A] text-sm" style={{ fontWeight: 600 }}>{college.admissionFee.toLocaleString()} BDT</p>
                        <p className="text-xs text-[#6B3A1F]/50 mt-1">Min GPA</p>
                        <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{college.gpaMin}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Facts */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Medical Admission at a Glance</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "Govt. Medical Colleges", value: "37", icon: Award },
                  { label: "Private Medical Colleges", value: "72+", icon: Award },
                  { label: "Total MBBS Seats", value: "~10,000", icon: Users },
                  { label: "BDS Seats", value: "~1,000", icon: Users },
                  { label: "Min Combined GPA", value: "9.00", icon: BookOpen },
                  { label: "Test Duration", value: "1 Hour", icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#D4A857]/10 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-[#6B3A1F]/70">
                      <Icon className="w-4 h-4 text-red-500" />
                      {label}
                    </div>
                    <span className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Application Timeline 2025-26</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { event: "HSC Result Publication", date: "October 2025" },
                  { event: "Online Application Opens", date: "October 2025" },
                  { event: "Application Deadline", date: "November 2025" },
                  { event: "Admit Card Download", date: "November 2025" },
                  { event: "MBBS Entrance Test", date: "November 2025" },
                  { event: "Result Publication", date: "December 2025" },
                  { event: "Enrollment", date: "January 2026" },
                ].map(({ event, date }) => (
                  <div key={event} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D4A857] rounded-full flex-shrink-0" />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-[#1A0A02] text-xs">{event}</span>
                      <span className="text-[#6B3A1F]/60 text-xs">{date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-5 text-white text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-white/80" />
              <h3 className="mb-2" style={{ fontSize: "1rem", fontWeight: 600 }}>Need Medical Admission Help?</h3>
              <p className="text-white/70 text-sm mb-4">Our medical admission experts can guide your application process.</p>
              <Link
                to="/admission-bondu"
                className="block w-full py-3 bg-white text-red-700 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                style={{ fontWeight: 600 }}
              >
                <FileText className="w-4 h-4" />
                Get Medical Admission Bondu Support
              </Link>
            </div>

            {/* Important Links */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-5">
              <h3 className="text-[#1A0A02] mb-3 text-sm" style={{ fontWeight: 600 }}>Important Official Links</h3>
              <div className="space-y-2">
                {[
                  { name: "DGME Portal", url: "dgme.teletalk.com.bd" },
                  { name: "Medical Admission Portal", url: "medicaladmission.dgme.gov.bd" },
                  { name: "UGC Bangladesh", url: "ugc.gov.bd" },
                  { name: "Ministry of Health", url: "mohfw.gov.bd" },
                ].map(({ name, url }) => (
                  <a
                    key={name}
                    href={`https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 text-sm text-[#C8860A] hover:text-[#D4A857] transition-colors border-b border-[#D4A857]/10 last:border-0"
                  >
                    {name}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
