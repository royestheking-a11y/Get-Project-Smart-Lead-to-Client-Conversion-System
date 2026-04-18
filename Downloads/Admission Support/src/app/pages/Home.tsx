import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Search, GraduationCap, BookOpen, MapPin, Star, ArrowRight,
  CheckCircle, Users, Award, TrendingUp, FileText, Home as HomeIcon,
  Clock, ChevronRight, Play, Shield, Zap, Heart, MessageCircle
} from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1726390415278-3c9bf426c0d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwQmFuZ2xhZGVzaCUyMHN0dWRlbnRzfGVufDF8fHx8MTc3NDQ5OTA1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZ3JhZHVhdGlvbiUyMHN0dWRlbnRzJTIwaGFwcHl8ZW58MXx8fHwxNzc0NDk5MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1595315343110-9b445a960442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsaWJyYXJ5JTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDQ5OTA1NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDF8fHx8MTc3NDUwMjk0MXww&ixlib=rb-4.1.0&q=80&w=1080"
];

const topUniversities = [
  { name: "North South University", shortName: "NSU", city: "Dhaka", type: "Private", rating: 4.8, fee: "25K–45K BDT/sem", badge: "Top Ranked" },
  { name: "BRAC University", shortName: "BRACU", city: "Dhaka", type: "Private", rating: 4.7, fee: "25K–45K BDT/sem", badge: "Research Hub" },
  { name: "University of Dhaka", shortName: "DU", city: "Dhaka", type: "Public", rating: 4.9, fee: "1K–5K BDT/sem", badge: "Prestigious" },
  { name: "BUET", shortName: "BUET", city: "Dhaka", type: "Public", rating: 5.0, fee: "1K–4K BDT/sem", badge: "#1 Engineering" },
  { name: "AIUB", shortName: "AIUB", city: "Dhaka", type: "Private", rating: 4.6, fee: "22K–40K BDT/sem", badge: "US Style" },
  { name: "Daffodil Intl. Univ.", shortName: "DIU", city: "Dhaka", type: "Private", rating: 4.3, fee: "18K–35K BDT/sem", badge: "Largest Campus" },
];

const notices = [
  { date: "25 Mar 2026", title: "GST Cluster Admission 2025-26 Application Deadline Extended", category: "Deadline", urgent: true },
  { date: "22 Mar 2026", title: "NSU Spring 2026 Admission Result Published", category: "Result", urgent: false },
  { date: "20 Mar 2026", title: "BUET 2025-26 Engineering Admission Circular Released", category: "Circular", urgent: true },
  { date: "18 Mar 2026", title: "Medical Admission (MBBS) Seat Plan 2025-26 Announced", category: "Medical", urgent: false },
  { date: "15 Mar 2026", title: "DIU Scholarship 2026 Applications Now Open", category: "Scholarship", urgent: false },
];

const reviews = [
  { name: "Rahel Islam", university: "North South University", text: "Admission Bondu helped me get into NSU with 50% scholarship. The entire process was smooth and stress-free!", avatar: "RI", rating: 5 },
  { name: "Fatema Akhter", university: "BRAC University", text: "I had no idea how to apply. The team guided me through everything — from documents to deadline tracking. Got my dream university!", avatar: "FA", rating: 5 },
  { name: "Arif Hossain", university: "CUET", text: "The university finder tool is amazing. I found CUET matching my GPA and budget perfectly. Highly recommend!", avatar: "AH", rating: 5 },
  { name: "Sumaiya Begum", university: "Daffodil Intl. Univ.", text: "As a first-generation college student, I was overwhelmed. This platform made everything so clear. Thank you!", avatar: "SB", rating: 4 },
];

const faqs = [
  {
    q: "How does the University Finder work?",
    a: "Enter your budget, GPA, preferred subject, and location. Our system instantly shows matching universities ranked by compatibility."
  },
  {
    q: "What does the Admission Bondu Service include?",
    a: "Our agents handle the entire application process — form filling, document upload, fee payment, and tracking until you get your admission letter."
  },
  {
    q: "How much does the service fee cost?",
    a: "Service fees vary by package. Basic package starts at 2,000 BDT. Full-service packages with document handling start at 5,000 BDT."
  },
  {
    q: "Can I apply to multiple universities?",
    a: "Yes! You can apply to up to 5 universities in one service package. Each additional university is available at a discounted rate."
  },
  {
    q: "How long does the application process take?",
    a: "Typically 3-7 business days from document submission to application completion. Rush services are available for urgent deadlines."
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchSubject, setSearchSubject] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic Data
  const [displayUniversities] = useState<any[]>(() => {
    const stored = localStorage.getItem("bd_admission_universities");
    const all = stored ? JSON.parse(stored) : topUniversities;
    return all.slice(0, 6); // Just show top 6
  });

  const [displayNotices] = useState<any[]>(() => {
    const stored = localStorage.getItem("bd_admission_notices");
    return stored ? JSON.parse(stored) : notices;
  });

  const handleSearch = () => {
    navigate(`/universities?subject=${searchSubject}&city=${searchCity}`);
  };

  return (
    <div className="bg-white">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#1A0A02]">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGES[0]}
            alt="University Background"
            className="w-full h-full object-cover blur-md brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A02]/60 via-transparent to-[#1A0A02]/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4A857]/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C8860A]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A857]/20 border border-[#D4A857]/40 rounded-full mb-8 backdrop-blur-md">
              <span className="w-2 h-2 bg-[#D4A857] rounded-full animate-pulse"></span>
              <span className="text-[#D4A857] text-sm font-medium tracking-wide uppercase">Admission 2025 Now Open!</span>
            </div>

            <h1 className="text-white mb-6 tracking-tight leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800 }}>
              Admission Made{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A857] to-[#F3D190]">
                Simple
              </span>{" "}
              for Every Student
            </h1>

            <p className="text-white/80 text-xl leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
              Find the right university, apply easily, and track everything in one place. Guiding HSC students to their dream universities across Bangladesh.
            </p>

            {/* Redesigned Search Box / Filters */}
            <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden mb-12">
              <div className="flex flex-col md:flex-row items-stretch gap-2">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A857]/60 group-focus-within:text-[#D4A857] transition-colors" />
                    <select
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      className="w-full bg-white/10 hover:bg-white/15 border border-white/10 group-focus-within:border-[#D4A857]/40 rounded-2xl pl-12 pr-4 py-4 text-white text-base appearance-none focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="" className="bg-[#1A0A02]">Any Subject</option>
                      {["CSE", "EEE", "BBA", "English", "Pharmacy", "Architecture", "Law", "MBBS", "Civil"].map(s => (
                        <option key={s} value={s} className="bg-[#1A0A02]">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A857]/60 group-focus-within:text-[#D4A857] transition-colors" />
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-white/10 hover:bg-white/15 border border-white/10 group-focus-within:border-[#D4A857]/40 rounded-2xl pl-12 pr-4 py-4 text-white text-base appearance-none focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="" className="bg-[#1A0A02]">Any City</option>
                      {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"].map(c => (
                        <option key={c} value={c} className="bg-[#1A0A02]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#D4A857]/40 active:translate-y-[0] transition-all m-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="whitespace-nowrap">Find University</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { label: "155+ Universities", icon: GraduationCap },
                { label: "15,000+ Students", icon: Users },
                { label: "98% Success Rate", icon: Award },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-white/60">
                  <Icon className="w-5 h-5 text-[#D4A857]" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A857]/15 rounded-full mb-4">
              <Zap className="w-4 h-4 text-[#D4A857]" />
              <span className="text-[#C8860A] text-sm">Simple Process</span>
            </div>
            <h2 className="text-[#1A0A02] mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>How It Works</h2>
            <p className="text-[#6B3A1F]/70 max-w-xl mx-auto">From search to admission in 4 simple steps. We guide you at every stage.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Search, title: "Find University", desc: "Search by budget, GPA, subject & location to find your best-fit university.", color: "#D4A857" },
              { step: "02", icon: FileText, title: "Submit Application", desc: "Fill out your application form. Upload documents. Our team handles the rest.", color: "#C8860A" },
              { step: "03", icon: TrendingUp, title: "Track Progress", desc: "Monitor your application status in real-time from your student dashboard.", color: "#B8750A" },
              { step: "04", icon: GraduationCap, title: "Get Admitted", desc: "Receive your admission confirmation and start your university journey!", color: "#A86A05" },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-[#D4A857]/30 z-10" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }} />
                )}
                <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-[#D4A857]/10 transition-all group">
                  <div className="relative mx-auto mb-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                      style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}
                    >
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs text-[#1A0A02]"
                      style={{ background: color }}
                    >
                      {step}
                    </div>
                  </div>
                  <h3 className="text-[#1A0A02] mb-2" style={{ fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
                  <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Universities ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A857]/15 rounded-full mb-4">
                <Star className="w-4 h-4 text-[#D4A857]" />
                <span className="text-[#C8860A] text-sm">Top Ranked</span>
              </div>
              <h2 className="text-[#1A0A02]" style={{ fontSize: "2rem", fontWeight: 700 }}>Top Universities</h2>
            </div>
            <Link to="/universities" className="hidden md:flex items-center gap-1 text-[#C8860A] hover:text-[#D4A857] text-sm transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayUniversities.map((uni, i) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to="/universities" className="block group">
                  <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-5 hover:shadow-xl hover:shadow-[#D4A857]/10 hover:border-[#D4A857]/40 transition-all h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#3B1A0A] to-[#6B3A1F] rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-[#D4A857] text-xs font-bold">{uni.shortName}</span>
                      </div>
                      <div className="px-2 py-1 bg-[#D4A857]/10 rounded-lg">
                        <span className="text-[#C8860A] text-xs">{uni.badge}</span>
                      </div>
                    </div>

                    <h3 className="text-[#1A0A02] mb-1 group-hover:text-[#C8860A] transition-colors" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      {uni.name}
                    </h3>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs text-[#6B3A1F]/70">
                        <MapPin className="w-3 h-3" />
                        {uni.city}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${uni.type === "Public" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                        {uni.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#6B3A1F]/60 mb-0.5">Tuition Fee</p>
                        <p className="text-[#C8860A] text-sm">{uni.fee}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#D4A857] fill-[#D4A857]" />
                        <span className="text-[#1A0A02] text-sm">{uni.rating}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#D4A857]/10 flex items-center gap-1 text-[#C8860A] text-xs">
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="py-20 bg-[#1A0A02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-white mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>Our <span className="text-[#D4A857]">Premium</span> Services</h2>
            <p className="text-white/60 max-w-xl mx-auto">Everything you need for a successful university admission — in one place.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, title: "University Finder", desc: "Smart search with 7+ filters to find your perfect university match.", link: "/universities", color: "#D4A857" },
              { icon: FileText, title: "Admission Bondu", desc: "We handle your entire application process from documents to submission.", link: "/admission-bondu", color: "#C8860A" },
              { icon: Heart, title: "Medical Admission", desc: "Specialized support for MBBS and medical college admissions.", link: "/medical-admission", color: "#B8750A" },
              { icon: GraduationCap, title: "Polytechnic Admission", desc: "Specialized support for Diploma-in-Engineering students.", link: "/polytechnic-admission", color: "#D4A857" },
              { icon: HomeIcon, title: "Accommodation Guide", desc: "Living cost estimator with hostel & apartment options near universities.", link: "/accommodation", color: "#D4A857" },
              { icon: Play, title: "Video Tutorials", desc: "Step-by-step video guides on every aspect of university admission.", link: "/tutorial", color: "#C8860A" },
              { icon: MessageCircle, title: "Notice Board", desc: "Real-time admission notices, deadlines, results and circulars.", link: "/notice", color: "#B8750A" },
            ].map(({ icon: Icon, title, desc, link, color }) => (
              <Link key={title} to={link}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#D4A857]/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="text-white mb-2 group-hover:text-[#D4A857] transition-colors" style={{ fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-3">{desc}</p>
                  <div className="flex items-center gap-1 text-sm" style={{ color }}>
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A857]/15 rounded-full mb-5">
                <Shield className="w-4 h-4 text-[#D4A857]" />
                <span className="text-[#C8860A] text-sm">Why Choose Us</span>
              </div>
              <h2 className="text-[#1A0A02] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Bangladesh's Most Trusted Admission Platform</h2>
              <p className="text-[#6B3A1F]/70 mb-8 leading-relaxed">
                We combine technology with expert guidance to make university admission in Bangladesh simple, transparent, and stress-free for every student.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Expert Admission Agents", desc: "10+ years experience, 12,000+ successful admissions" },
                  { title: "Real-Time Application Tracking", desc: "Monitor every step from your personal dashboard" },
                  { title: "100% Transparent Fees", desc: "No hidden charges. Fixed service fees disclosed upfront" },
                  { title: "Scholarship Discovery", desc: "Find merit, need-based & FF quota scholarships easily" },
                  { title: "Multi-Payment Support", desc: "bKash, Nagad, Rocket, Card — all payment methods accepted" },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#D4A857]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-[#C8860A]" />
                    </div>
                    <div>
                      <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{title}</p>
                      <p className="text-[#6B3A1F]/60 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img src="https://images.unsplash.com/photo-1595315343110-9b445a960442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsaWJyYXJ5JTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDQ5OTA1NHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Student studying" className="rounded-2xl w-full h-[450px] object-cover shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-[#D4A857]/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-[#1A0A02]" />
                  </div>
                  <div>
                    <p className="text-[#1A0A02] text-2xl font-bold">98%</p>
                    <p className="text-[#6B3A1F]/70 text-sm">Admission Success Rate</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#1A0A02] text-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#D4A857]" />
                  <div>
                    <p className="text-white text-lg font-bold">12,000+</p>
                    <p className="text-white/60 text-xs">Students Helped</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Latest Notices ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A857]/15 rounded-full mb-4">
                <Clock className="w-4 h-4 text-[#D4A857]" />
                <span className="text-[#C8860A] text-sm">Stay Updated</span>
              </div>
              <h2 className="text-[#1A0A02]" style={{ fontSize: "2rem", fontWeight: 700 }}>Latest Notices</h2>
            </div>
            <Link to="/notice" className="hidden md:flex items-center gap-1 text-[#C8860A] hover:text-[#D4A857] text-sm transition-colors">
              View All Notices <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {displayNotices.slice(0, 5).map((notice, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to="/notice" className="block group">
                  <div className={`bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all ${notice.urgent ? "border-red-200 bg-red-50/30" : "border-[#D4A857]/20"}`}>
                    <div className="flex items-center gap-4">
                      {notice.urgent && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></span>}
                      <div className="text-[#6B3A1F]/50 text-xs flex-shrink-0">{notice.date}</div>
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${
                          notice.category === "Deadline" ? "bg-red-100 text-red-700" :
                          notice.category === "Result" ? "bg-green-100 text-green-700" :
                          notice.category === "Medical" ? "bg-blue-100 text-blue-700" :
                          notice.category === "Scholarship" ? "bg-purple-100 text-purple-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {notice.category}
                        </span>
                        <span className="text-[#1A0A02] text-sm group-hover:text-[#C8860A] transition-colors">{notice.title}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6B3A1F]/40 group-hover:text-[#C8860A] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Student Reviews ─── */}
      <section className="py-20 bg-[#1A0A02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-white mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>What <span className="text-[#D4A857]">Students</span> Say</h2>
            <p className="text-white/60">Real stories from students who achieved their dream admissions with our help.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#D4A857] fill-[#D4A857]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-full flex items-center justify-center text-[#1A0A02] text-xs font-bold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{review.name}</p>
                    <p className="text-[#D4A857] text-xs">{review.university}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#1A0A02] mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>Frequently Asked Questions</h2>
            <p className="text-[#6B3A1F]/70">Everything you need to know about our Admission Bondu services.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${openFaq === i ? "border-[#D4A857]/50 shadow-md" : "border-[#D4A857]/20"}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between"
                >
                  <span className="text-[#1A0A02] text-sm pr-4" style={{ fontWeight: 600 }}>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-[#C8860A] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-[#6B3A1F]/80 text-sm leading-relaxed border-t border-[#D4A857]/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-gradient-to-br from-[#3B1A0A] to-[#1A0A02]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
            Ready to Start Your University Journey?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join 12,000+ students who've found their dream universities through Admission Bondu.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/universities"
              className="px-8 py-4 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl flex items-center gap-2 hover:shadow-2xl hover:shadow-[#D4A857]/30 transition-all"
            >
              <GraduationCap className="w-5 h-5" />
              Find University Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/30 text-white rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}