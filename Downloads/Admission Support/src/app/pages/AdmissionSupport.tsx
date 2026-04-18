import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FileText, CheckCircle, Clock, Upload, CreditCard, Star,
  ChevronRight, Shield, Users, Award, MessageCircle, Phone,
  X, Search
} from "lucide-react";

import { universities as defaultUniversities } from "../data/universities";

const GRAD_IMAGE = "https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZ3JhZHVhdGlvbiUyMHN0dWRlbnR_sJTIwaGFwcHl8ZW58MXx8fHwxNzc0NDk5MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-100 text-blue-700 border-blue-200",
  Submitted: "bg-purple-100 text-purple-700 border-purple-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

const packages = [
  {
    name: "Basic",
    price: "100 BDT",
    popular: false,
    features: [
      "University recommendation",
      "Application form guidance",
      "Document checklist",
      "1 university application",
      "Email support",
    ],
    notIncluded: ["Document upload", "Payment handling", "Tracking dashboard"],
  },
  {
    name: "Standard",
    price: "200 BDT",
    popular: true,
    features: [
      "University recommendation",
      "Full application submission",
      "Document upload & verification",
      "Up to 3 university applications",
      "Payment handling",
      "Real-time tracking",
      "Phone & WhatsApp support",
    ],
    notIncluded: ["Priority processing", "Interview preparation"],
  },
  {
    name: "Premium",
    price: "300 BDT",
    popular: false,
    features: [
      "Everything in Standard",
      "Up to 5 university applications",
      "Priority 48h processing",
      "Interview preparation",
      "SOP/personal statement help",
      "Scholarship assistance",
      "Dedicated agent",
      "Post-admission guidance",
    ],
    notIncluded: [],
  },
];

const applicationSteps = [
  { status: "Application Submitted", done: true, date: "March 15, 2026" },
  { status: "Documents Verified", done: true, date: "March 17, 2026" },
  { status: "Form Filled by Agent", done: true, date: "March 19, 2026" },
  { status: "Submitted to University", done: false, date: "Expected: March 23" },
  { status: "Admission Confirmed", done: false, date: "Expected: April 2026" },
];

export default function AdmissionSupport() {
  const UNIV_KEY = "bd_admission_universities";
  const [availableUniversities] = useState(() => {
    const stored = localStorage.getItem(UNIV_KEY);
    return stored ? JSON.parse(stored) : defaultUniversities;
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gpa: "",
    sscRoll: "",
    hscRoll: "",
    regNumber: "",
    subject: "",
    universities: [] as string[],
    package: "Standard",
    paymentMethod: "bKash",
    transactionId: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState("");
  const [unvSearch, setUnvSearch] = useState("");

  useEffect(() => {
    const limit = getLimit();
    if (formData.universities.length > limit) {
      setFormData(prev => ({ ...prev, universities: prev.universities.slice(0, limit) }));
    }
  }, [formData.package]);

  const getLimit = () => {
    if (formData.package === "Basic") return 1;
    if (formData.package === "Standard") return 3;
    return 5;
  };

  const toggleUniversity = (name: string) => {
    const limit = getLimit();
    setFormData(prev => {
      if (prev.universities.includes(name)) {
        return { ...prev, universities: prev.universities.filter(u => u !== name) };
      }
      if (prev.universities.length < limit) {
        return { ...prev, universities: [...prev.universities, name] };
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.universities.length === 0) {
      alert("Please select at least one university.");
      return;
    }
    const newRef = `BD2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    setAppRef(newRef);

    const newApp = {
      id: newRef,
      studentName: formData.name,
      studentEmail: formData.email,
      phone: formData.phone,
      gpa: formData.gpa,
      sscRoll: formData.sscRoll,
      hscRoll: formData.hscRoll,
      regNumber: formData.regNumber,
      subject: formData.subject,
      universities: formData.universities,
      package: formData.package,
      packagePrice: formData.package === "Basic" ? 100 : formData.package === "Standard" ? 200 : 300,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      status: "Pending",
      progress: 20,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      lastUpdate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      steps: [
        { name: "Application Submitted", done: true, date: "Today" },
        { name: "Payment Verified", done: false, date: "Pending" },
        { name: "Documents Verified", done: false, date: "Pending" },
        { name: "Form Filled by Agent", done: false, date: "Pending" },
        { name: "Admission Confirmed", done: false, date: "Pending" },
      ]
    };

    const APPS_KEY = "bd_admission_applications";
    const existing = localStorage.getItem(APPS_KEY);
    const apps = existing ? JSON.parse(existing) : [];
    localStorage.setItem(APPS_KEY, JSON.stringify([newApp, ...apps]));

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={GRAD_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Admission Bondu</span>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
            Premium <span className="text-[#D4A857]">Admission Bondu</span> Service
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We handle your entire university application process — from document preparation to final submission. You focus on studying, we handle the paperwork.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {[
              { value: "12,000+", label: "Students Helped" },
              { value: "98%", label: "Success Rate" },
              { value: "155+", label: "Universities" },
              { value: "3–7 Days", label: "Processing Time" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center">
                <div className="text-[#D4A857] text-xl font-bold">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Packages */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Choose Your Package</h2>
          <p className="text-[#6B3A1F]/70">Transparent pricing. No hidden fees. Cancel anytime before processing starts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden ${pkg.popular ? "border-2 border-[#D4A857] shadow-2xl shadow-[#D4A857]/20 scale-105" : "border border-[#D4A857]/20"}`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] text-center py-1.5 text-xs" style={{ fontWeight: 600 }}>
                  ⭐ Most Popular
                </div>
              )}
              <div className={`bg-white p-6 ${pkg.popular ? "pt-10" : ""}`}>
                <h3 className="text-[#1A0A02] mb-1" style={{ fontSize: "1.2rem", fontWeight: 700 }}>{pkg.name}</h3>
                <div className="text-[#C8860A] mb-4" style={{ fontSize: "1.8rem", fontWeight: 700 }}>{pkg.price}</div>

                <div className="space-y-2.5 mb-6">
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-[#1A0A02] text-sm">{f}</span>
                    </div>
                  ))}
                  {pkg.notIncluded.map(f => (
                    <div key={f} className="flex items-center gap-2 opacity-40">
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-0.5 bg-gray-400"></div>
                      </div>
                      <span className="text-[#1A0A02] text-sm line-through">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, package: pkg.name }))}
                  className={`w-full py-3 rounded-xl transition-all ${
                    pkg.popular
                      ? "bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02]"
                      : "border border-[#D4A857]/40 text-[#C8860A] hover:bg-[#D4A857]/10"
                  }`}
                >
                  Choose {pkg.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Status Timeline (Demo) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Application Status Tracker</h2>
            <p className="text-[#6B3A1F]/70">Track your application in real-time from submission to admission.</p>
          </div>

          <div className="bg-[#FFF8F0] border border-[#D4A857]/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>Application #BD2026-0341</p>
                <p className="text-[#6B3A1F]/60 text-sm">North South University — BSc CSE</p>
              </div>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm">
                Processing
              </span>
            </div>

            <div className="relative">
              {applicationSteps.map((step, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${
                      step.done ? "bg-[#C8860A]" : "bg-white border-2 border-[#D4A857]/30"
                    }`}>
                      {step.done ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#6B3A1F]/40" />
                      )}
                    </div>
                    {i < applicationSteps.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${step.done ? "bg-[#C8860A]/40" : "bg-[#D4A857]/20"}`} style={{ minHeight: "2rem" }} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={`text-sm ${step.done ? "text-[#1A0A02]" : "text-[#6B3A1F]/50"}`} style={{ fontWeight: step.done ? 600 : 400 }}>
                      {step.status}
                    </p>
                    <p className="text-xs text-[#6B3A1F]/50">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-[#1A0A02] mb-3" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Submit Your Application</h2>
            <p className="text-[#6B3A1F]/70 mb-6 leading-relaxed">
              Fill out this form and our admission agents will contact you within 24 hours to guide you through the process.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: FileText, title: "We Fill the Forms", desc: "Our agents complete your university application forms accurately." },
                { icon: Upload, title: "We Upload Documents", desc: "We handle all document uploads and verification on your behalf." },
                { icon: Clock, title: "3-7 Day Processing", desc: "Fast turnaround. Rush service available for urgent deadlines." },
                { icon: Shield, title: "100% Safe & Secure", desc: "Your documents and data are handled with strict confidentiality." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#D4A857]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#C8860A]" />
                  </div>
                  <div>
                    <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{title}</p>
                    <p className="text-[#6B3A1F]/60 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1A0A02] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-[#D4A857]" />
                <p className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Speak with an Expert</p>
              </div>
              <p className="text-white/60 text-sm mb-3">Get free consultation Mon–Thu, 9 AM – 6 PM</p>
              <a href="tel:+8801700000000" className="text-white text-lg" style={{ fontWeight: 600 }}>+880 1700-000000</a>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-[#D4A857]/30 rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Application Submitted!</h3>
              <p className="text-[#6B3A1F]/70 mb-6">
                Our agent will contact you within 24 hours. Check your email for a confirmation.
              </p>
              <div className="bg-[#FFF8F0] rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-[#6B3A1F]/60 mb-1">Application Reference</p>
                <p className="text-[#1A0A02] font-mono" style={{ fontWeight: 600 }}>{appRef}</p>
              </div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl">
                Track Application
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-6">
              <h3 className="text-[#1A0A02] mb-5" style={{ fontSize: "1rem", fontWeight: 600 }}>Application Form</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Full Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                    />
                  </div>
                  <div>
                    <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Phone Number *</label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+880 1700-000000"
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                  />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>SSC + HSC GPA *</label>
                    <input
                      required
                      value={formData.gpa}
                      onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                      placeholder="e.g., 9.5 (4.75 + 4.75)"
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                    />
                  </div>
                  <div>
                    <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Preferred Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                    >
                      <option value="">Select Subject</option>
                      {["CSE", "EEE", "BBA", "MBBS", "English", "Law", "Pharmacy", "Architecture", "Civil"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[#1A0A02] text-xs" style={{ fontWeight: 600 }}>Specify Universities *</label>
                      <span className="text-[10px] text-[#A8742C]/60 font-bold uppercase tracking-wider">
                         {formData.universities.length} / {getLimit()} Selected
                      </span>
                   </div>
                   
                   {/* Selected Chips */}
                   <div className="flex flex-wrap gap-1.5 mb-3">
                      {formData.universities.map(u => (
                        <button 
                          key={u} 
                          type="button"
                          onClick={() => toggleUniversity(u)}
                          className="px-2.5 py-1 bg-[#1A0A02] text-[#D4A857] text-[10px] font-bold rounded-full flex items-center gap-1.5 hover:bg-red-900 transition-colors"
                        >
                          {u}
                          <X className="w-2.5 h-2.5" />
                        </button>
                      ))}
                      {formData.universities.length === 0 && (
                        <p className="text-[10px] text-[#6B3A1F]/40 italic">No universities selected yet.</p>
                      )}
                   </div>

                   <div className="bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-2 border-b border-[#D4A857]/10 flex items-center gap-2 bg-white/50">
                         <Search className="w-3.5 h-3.5 text-[#6B3A1F]/40" />
                         <input 
                           type="text" 
                           placeholder="Search universities..." 
                           value={unvSearch}
                           onChange={(e) => setUnvSearch(e.target.value)}
                           className="bg-transparent border-none text-xs w-full focus:ring-0 p-0"
                         />
                      </div>
                      <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                         {availableUniversities
                           .filter((u: any) => u.name.toLowerCase().includes(unvSearch.toLowerCase()) || u.shortName.toLowerCase().includes(unvSearch.toLowerCase()))
                           .map((uni: any) => {
                             const isSelected = formData.universities.includes(uni.name);
                             const limitReached = formData.universities.length >= getLimit();
                             return (
                               <button
                                 key={uni.id}
                                 type="button"
                                 disabled={!isSelected && limitReached}
                                 onClick={() => toggleUniversity(uni.name)}
                                 className={`w-full text-left px-3 py-2 rounded-lg mb-0.5 text-xs flex items-center justify-between transition-all ${
                                   isSelected 
                                     ? "bg-[#D4A857] text-[#1A0A02] font-bold" 
                                     : !isSelected && limitReached 
                                       ? "opacity-30 grayscale cursor-not-allowed" 
                                       : "hover:bg-white text-[#6B3A1F]/70"
                                 }`}
                               >
                                 <span>{uni.name} ({uni.shortName})</span>
                                 {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                               </button>
                             );
                           })}
                      </div>
                   </div>
                </div>

                <div className="pt-4 pb-2">
                   <h4 className="text-[#1A0A02] text-xs font-bold uppercase tracking-wider mb-4 border-b border-[#D4A857]/20 pb-2">Academic Credentials</h4>
                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                       <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>SSC Roll Number *</label>
                       <input required value={formData.sscRoll} onChange={(e) => setFormData(prev => ({ ...prev, sscRoll: e.target.value }))} placeholder="6-digit roll" className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]" />
                     </div>
                     <div>
                       <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>HSC Roll Number *</label>
                       <input required value={formData.hscRoll} onChange={(e) => setFormData(prev => ({ ...prev, hscRoll: e.target.value }))} placeholder="6-digit roll" className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]" />
                     </div>
                   </div>
                   <div className="mb-4">
                     <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Registration Number *</label>
                     <input required value={formData.regNumber} onChange={(e) => setFormData(prev => ({ ...prev, regNumber: e.target.value }))} placeholder="10-digit registration" className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]" />
                   </div>
                </div>

                <div className="pt-4 pb-2">
                   <h4 className="text-[#1A0A02] text-xs font-bold uppercase tracking-wider mb-4 border-b border-[#D4A857]/20 pb-2">Payment Verification</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Payment Method *</label>
                        <select value={formData.paymentMethod} onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))} className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]">
                          <option value="bKash">bKash</option>
                          <option value="Nagad">Nagad</option>
                          <option value="Rocket">Rocket</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Transaction ID *</label>
                        <input required value={formData.transactionId} onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))} placeholder="Trx ID from SMS" className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]" />
                      </div>
                   </div>
                   <p className="text-[10px] text-[#6B3A1F]/50 mt-3 italic">Please send the package fee to: 01700-000000 (Personal) and enter TrxID above.</p>
                </div>

                <div>
                  <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Service Package</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Basic", price: 100 },
                      { name: "Standard", price: 200 },
                      { name: "Premium", price: 300 }
                    ].map(pkg => (
                      <button
                        key={pkg.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, package: pkg.name }))}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                          formData.package === pkg.name
                            ? "bg-[#1A0A02] text-[#D4A857] shadow-lg shadow-[#1A0A02]/20"
                            : "bg-[#FFF8F0] border border-[#D4A857]/30 text-[#6B3A1F] hover:border-[#C8860A]"
                        }`}
                      >
                        <span>{pkg.name}</span>
                        <span className={`text-[9px] ${formData.package === pkg.name ? "text-[#D4A857]/60" : "text-[#6B3A1F]/40"}`}>৳{pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Submit Application Request
                </button>

                <p className="text-xs text-[#6B3A1F]/50 text-center">
                  By submitting, you agree to our Terms of Service. Your information is kept strictly confidential.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-[#1A0A02]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CreditCard className="w-8 h-8 text-[#D4A857] mx-auto mb-3" />
          <h3 className="text-white mb-2" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Accepted Payment Methods</h3>
          <p className="text-white/60 text-sm mb-6">Pay service fee securely through any of these methods</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["bKash", "Nagad", "Rocket", "VISA Card", "Mastercard", "Bank Transfer"].map(method => (
              <div key={method} className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white/80 text-sm">
                {method}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}