import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Play, BookOpen, Download, ChevronRight, Clock, Star, Users, Search } from "lucide-react";

const STUDY_IMAGE = "https://images.unsplash.com/photo-1595315343110-9b445a960442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsaWJyYXJ5JTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NDQ5OTA1NHww&ixlib=rb-4.1.0&q=80&w=1080";

const tutorials = [
  {
    id: 1,
    title: "How to Apply for Private University Admission in Bangladesh",
    description: "Complete step-by-step guide to applying for private universities including form filling, document upload, and payment.",
    category: "Application Process",
    duration: "15:30",
    views: "45,200",
    rating: 4.9,
    steps: ["Create account on university portal", "Fill application form", "Upload required documents", "Pay admission fee online", "Download admit card"],
    thumbnailColor: "#D4A857",
    featured: true,
  },
  {
    id: 2,
    title: "University Finder Tool — Complete Guide",
    description: "Learn how to use our smart university finder to match the best university to your GPA, budget, subject, and location.",
    category: "Platform Guide",
    duration: "08:45",
    views: "38,700",
    rating: 4.8,
    steps: ["Set your GPA filters", "Choose your preferred subject", "Set budget range", "Compare matching universities", "Save your shortlist"],
    thumbnailColor: "#C8860A",
    featured: true,
  },
  {
    id: 3,
    title: "How to Choose the Right University — 5 Key Factors",
    description: "Understand the 5 most important factors to consider when choosing a university: location, cost, reputation, programs, and job prospects.",
    category: "Decision Making",
    duration: "12:20",
    views: "61,500",
    rating: 4.9,
    steps: ["Check university ranking & reputation", "Calculate total cost (tuition + living)", "Evaluate program quality", "Check industry connections", "Visit campus if possible"],
    thumbnailColor: "#B8750A",
    featured: true,
  },
  {
    id: 4,
    title: "MBBS Admission Process in Bangladesh — Full Guide",
    description: "Complete guide to MBBS admission including eligibility, DGME test, medical college selection, and enrollment process.",
    category: "Medical Admission",
    duration: "22:15",
    views: "29,800",
    rating: 4.7,
    steps: ["Check eligibility (GPA ≥ 9.0)", "Apply on DGME portal", "Download admit card", "Appear in entrance test", "Choose medical college by merit"],
    thumbnailColor: "#D4A857",
    featured: false,
  },
  {
    id: 5,
    title: "How to Apply for Government University (GST Cluster)",
    description: "Step-by-step tutorial for GST cluster admission — one test for 19 universities. Learn how to navigate gstadmission.ac.bd.",
    category: "Public University",
    duration: "18:40",
    views: "53,200",
    rating: 4.8,
    steps: ["Check eligibility (GPA ≥ 7.0 for Science)", "Apply at gstadmission.ac.bd", "Pay 1,500 BDT via Teletalk", "Download admit card", "Appear in test"],
    thumbnailColor: "#A86A05",
    featured: false,
  },
  {
    id: 6,
    title: "Document Checklist for University Admission Bangladesh",
    description: "Know exactly which documents you need for university admission — originals, photocopies, attestation requirements.",
    category: "Documents",
    duration: "10:05",
    views: "42,100",
    rating: 4.6,
    steps: ["SSC & HSC original certificates", "SSC & HSC marksheets (3 copies)", "NID or birth certificate", "4 passport-size photos", "Testimonial from institution head"],
    thumbnailColor: "#C8860A",
    featured: false,
  },
  {
    id: 7,
    title: "How to Pay University Admission Fee Online (bKash/Nagad)",
    description: "Complete tutorial on paying university admission fees using bKash, Nagad, Rocket, or bank card. Includes common error fixes.",
    category: "Payment",
    duration: "07:30",
    views: "31,400",
    rating: 4.7,
    steps: ["Open bKash / Nagad app", "Go to 'Education Payment'", "Enter university's Merchant ID", "Enter application/form number", "Confirm and save receipt"],
    thumbnailColor: "#B8750A",
    featured: false,
  },
  {
    id: 8,
    title: "Scholarship Guide — How to Get 50-100% Tuition Waiver",
    description: "Discover merit, need-based, FF quota and other scholarships available at private universities in Bangladesh.",
    category: "Scholarship",
    duration: "14:55",
    views: "37,600",
    rating: 4.9,
    steps: ["Know your GPA waiver eligibility", "Check university scholarship policy", "Apply within the deadline", "Submit income/other proof if needed", "Maintain CGPA to renew"],
    thumbnailColor: "#D4A857",
    featured: false,
  },
];

const categories = ["All", "Application Process", "Platform Guide", "Decision Making", "Medical Admission", "Public University", "Documents", "Payment", "Scholarship"];

export default function Tutorial() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTutorial, setSelectedTutorial] = useState<typeof tutorials[0] | null>(null);

  const filtered = tutorials.filter(t => {
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featured = tutorials.filter(t => t.featured);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={STUDY_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Tutorials</span>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
            Admission <span className="text-[#D4A857]">Tutorial Center</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Step-by-step video tutorials on every aspect of university admission in Bangladesh. Learn at your own pace.
          </p>
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#D4A857]/60"
            />
          </div>
        </div>
      </div>

      {/* Featured Videos */}
      {!searchQuery && selectedCategory === "All" && (
        <section className="py-12 max-w-7xl mx-auto px-4">
          <h2 className="text-[#1A0A02] mb-6" style={{ fontSize: "1.4rem", fontWeight: 700 }}>⭐ Featured Tutorials</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((tut, i) => (
              <motion.div
                key={tut.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#D4A857]/10 transition-all cursor-pointer group"
                  onClick={() => setSelectedTutorial(tut)}
                >
                  {/* Video Thumbnail */}
                  <div
                    className="relative h-44 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${tut.thumbnailColor}30, ${tut.thumbnailColor}10)` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 ml-1" style={{ color: tut.thumbnailColor }} />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tut.duration}
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-1 bg-[#D4A857] text-[#1A0A02] text-xs rounded-lg" style={{ fontWeight: 600 }}>
                      Featured
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-xs text-[#C8860A] bg-[#D4A857]/10 px-2 py-0.5 rounded-full">{tut.category}</span>
                    <h3 className="text-[#1A0A02] mt-2 mb-2 group-hover:text-[#C8860A] transition-colors leading-snug" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {tut.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#6B3A1F]/60">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#D4A857] fill-[#D4A857]" />
                        {tut.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {tut.views} views
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#C8860A] text-white shadow-md"
                  : "bg-white border border-[#D4A857]/20 text-[#6B3A1F] hover:border-[#C8860A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tutorial List */}
        {selectedTutorial ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden mb-8"
          >
            {/* Video Player Placeholder */}
            <div
              className="relative h-72 md:h-96 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${selectedTutorial.thumbnailColor}20, ${selectedTutorial.thumbnailColor}05)` }}
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Play className="w-12 h-12 ml-2" style={{ color: selectedTutorial.thumbnailColor }} />
                </div>
                <p className="text-[#1A0A02]/60 text-sm">Click to play tutorial</p>
                <p className="text-[#1A0A02]/40 text-xs mt-1">Duration: {selectedTutorial.duration}</p>
              </div>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-[#1A0A02] hover:bg-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <span className="text-xs text-[#C8860A] bg-[#D4A857]/10 px-2 py-0.5 rounded-full">{selectedTutorial.category}</span>
              <h2 className="text-[#1A0A02] mt-3 mb-2" style={{ fontSize: "1.2rem", fontWeight: 700 }}>{selectedTutorial.title}</h2>
              <p className="text-[#6B3A1F]/70 text-sm mb-5">{selectedTutorial.description}</p>

              <div className="bg-[#FFF8F0] rounded-xl p-5">
                <h3 className="text-[#1A0A02] mb-3 text-sm" style={{ fontWeight: 600 }}>📋 Steps Covered in This Tutorial</h3>
                <div className="space-y-2">
                  {selectedTutorial.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#C8860A] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[#1A0A02] text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl text-sm">
                  <Download className="w-4 h-4" />
                  Download Guide PDF
                </button>
                <Link to="/admission-bondu" className="flex items-center gap-2 px-4 py-2.5 border border-[#D4A857]/40 text-[#C8860A] rounded-xl text-sm hover:bg-[#D4A857]/10 transition-all">
                  <BookOpen className="w-4 h-4" />
                  Need Help? Apply with Us
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tut, i) => (
            <motion.div
              key={tut.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#D4A857]/40 transition-all cursor-pointer group"
                onClick={() => setSelectedTutorial(tut)}
              >
                <div
                  className="relative h-40 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${tut.thumbnailColor}20, ${tut.thumbnailColor}08)` }}
                >
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1" style={{ color: tut.thumbnailColor }} />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tut.duration}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#C8860A] bg-[#D4A857]/10 px-2 py-0.5 rounded-full">{tut.category}</span>
                  <h3 className="text-[#1A0A02] mt-2 mb-1.5 group-hover:text-[#C8860A] transition-colors leading-snug" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {tut.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#6B3A1F]/60">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#D4A857] fill-[#D4A857]" />
                      {tut.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {tut.views}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D4A857]/20">
            <Play className="w-10 h-10 text-[#D4A857]/50 mx-auto mb-3" />
            <h3 className="text-[#1A0A02] mb-1" style={{ fontWeight: 600 }}>No Tutorials Found</h3>
            <p className="text-[#6B3A1F]/60 text-sm">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
