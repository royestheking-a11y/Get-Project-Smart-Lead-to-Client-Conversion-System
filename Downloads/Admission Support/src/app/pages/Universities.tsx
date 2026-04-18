import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  Search, Filter, MapPin, Star, GraduationCap, ChevronRight,
  SlidersHorizontal, X, BookOpen, Users, Award, ArrowRight
} from "lucide-react";
import { universities, subjects, cities } from "../data/universities";

const UNIV_IMAGE = "https://images.unsplash.com/photo-1682161473727-402b497251b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBtb2Rlcm58ZW58MXx8fHwxNzc0NDk5MDU2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function Universities() {
  const UNIV_KEY = "bd_admission_universities";
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [budgetMax, setBudgetMax] = useState(800000);
  const [gpaMin, setGpaMin] = useState(0);
  const [selectedScholarship, setSelectedScholarship] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [activeTab, setActiveTab] = useState(searchParams.get("category") || "all");

  const [allUniversities] = useState<any[]>(() => {
    const stored = localStorage.getItem(UNIV_KEY);
    return stored ? JSON.parse(stored) : universities;
  });

  const filtered = useMemo(() => {
    let list = [...allUniversities];

    if (activeTab === "Engineering") list = list.filter(u => u.category === "Engineering");
    else if (activeTab === "public") list = list.filter(u => u.type === "public");
    else if (activeTab === "private") list = list.filter(u => u.type === "private");

    if (selectedType !== "all") list = list.filter(u => u.type === selectedType);
    if (selectedSubject) list = list.filter(u => u.subjects.includes(selectedSubject));
    if (selectedCity) list = list.filter(u => u.city === selectedCity || u.division === selectedCity);
    if (searchQuery) list = list.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.shortName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedScholarship) list = list.filter(u => u.hasScholarship);
    list = list.filter(u => u.totalCostMax <= budgetMax);
    list = list.filter(u => u.gpaMin <= gpaMin || gpaMin === 0);

    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "fee-low") return a.tuitionMin - b.tuitionMin;
      if (sortBy === "fee-high") return b.tuitionMax - a.tuitionMax;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [searchQuery, selectedType, selectedSubject, selectedCity, budgetMax, gpaMin, selectedScholarship, sortBy, activeTab]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedSubject("");
    setSelectedCity("");
    setBudgetMax(800000);
    setGpaMin(0);
    setSelectedScholarship(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Page Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={UNIV_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-3">
              <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#D4A857]">Universities</span>
            </div>
            <h1 className="text-white mb-3" style={{ fontSize: "2.2rem", fontWeight: 700 }}>University Finder</h1>
            <p className="text-white/60 text-lg">Discover and compare 155+ universities across Bangladesh. Filter by budget, GPA, subject & location.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#D4A857]/20 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { key: "all", label: "All Universities" },
              { key: "public", label: "Public" },
              { key: "private", label: "Private" },
              { key: "Engineering", label: "Engineering" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-[#C8860A] text-[#C8860A]"
                    : "border-transparent text-[#6B3A1F]/70 hover:text-[#C8860A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}>
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden sticky top-32">
              <div className="bg-[#1A0A02] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#D4A857]">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter Universities</span>
                </div>
                <button onClick={clearFilters} className="text-white/50 hover:text-white text-xs transition-colors">Clear All</button>
              </div>

              <div className="p-5 space-y-5">
                {/* Search */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B3A1F]/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="University name..."
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#1A0A02] placeholder-[#6B3A1F]/40 focus:outline-none focus:border-[#C8860A]"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>University Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["all", "public", "private"].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`py-2 rounded-lg text-xs capitalize transition-all ${
                          selectedType === t
                            ? "bg-[#C8860A] text-white"
                            : "bg-[#FFF8F0] border border-[#D4A857]/30 text-[#6B3A1F] hover:border-[#C8860A]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>City / Division</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-lg px-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                  >
                    <option value="">All Locations</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>
                    Max Total Cost: <span className="text-[#C8860A]">{(budgetMax / 1000).toFixed(0)}K BDT</span>
                  </label>
                  <input
                    type="range"
                    min={50000}
                    max={800000}
                    step={10000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full accent-[#C8860A]"
                  />
                  <div className="flex justify-between text-xs text-[#6B3A1F]/50 mt-1">
                    <span>50K</span><span>800K BDT</span>
                  </div>
                </div>

                {/* GPA */}
                <div>
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-2 block" style={{ fontWeight: 600 }}>
                    My GPA: <span className="text-[#C8860A]">{gpaMin || "Any"}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={gpaMin}
                    onChange={(e) => setGpaMin(Number(e.target.value))}
                    className="w-full accent-[#C8860A]"
                  />
                  <div className="flex justify-between text-xs text-[#6B3A1F]/50 mt-1">
                    <span>0.00</span><span>5.00</span>
                  </div>
                </div>

                {/* Scholarship */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedScholarship(!selectedScholarship)}
                    className={`w-10 h-5 rounded-full transition-all ${selectedScholarship ? "bg-[#C8860A]" : "bg-[#D4A857]/30"} relative`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${selectedScholarship ? "left-5" : "left-0.5"}`} />
                  </button>
                  <label className="text-[#1A0A02] text-sm">Scholarship Available</label>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 border border-[#D4A857]/40 rounded-lg text-[#C8860A] text-sm hover:bg-[#D4A857]/10 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#1A0A02] text-[#D4A857] rounded-lg text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-[#6B3A1F]/70 text-sm">
                  <span className="text-[#1A0A02] font-medium">{filtered.length}</span> universities found
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D4A857]/30 rounded-lg px-3 py-2 text-sm text-[#1A0A02] focus:outline-none"
              >
                <option value="rating">Sort: Top Rated</option>
                <option value="fee-low">Sort: Fee Low-High</option>
                <option value="fee-high">Sort: Fee High-Low</option>
                <option value="name">Sort: A-Z</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#D4A857]/20">
                <GraduationCap className="w-12 h-12 text-[#D4A857]/50 mx-auto mb-3" />
                <h3 className="text-[#1A0A02] mb-2" style={{ fontWeight: 600 }}>No Universities Found</h3>
                <p className="text-[#6B3A1F]/60 text-sm mb-4">Try adjusting your filters to see more results.</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-[#C8860A] text-white rounded-xl text-sm">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filtered.map((uni, i) => (
                  <motion.div
                    key={uni.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/universities/${uni.id}`} className="block group">
                      <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-5 hover:shadow-xl hover:shadow-[#D4A857]/10 hover:border-[#D4A857]/40 transition-all h-full">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#3B1A0A] to-[#6B3A1F] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-[#D4A857] text-xs font-bold">{uni.shortName}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[#1A0A02] group-hover:text-[#C8860A] transition-colors pr-2" style={{ fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.3 }}>
                                {uni.name}
                              </h3>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Star className="w-3.5 h-3.5 text-[#D4A857] fill-[#D4A857]" />
                                <span className="text-[#1A0A02] text-xs">{uni.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-xs text-[#6B3A1F]/60">
                                <MapPin className="w-3 h-3" />
                                {uni.city}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${uni.type === "public" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                                {uni.type === "public" ? "Public" : "Private"}
                              </span>
                              {uni.category === "Engineering" && (
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">Engineering</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-[#FFF8F0] rounded-lg p-2 text-center">
                            <span className="text-[#C8860A] mx-auto mb-0.5 block" style={{ fontSize: "0.85rem", fontWeight: 700 }}>৳</span>
                            <div className="text-[#1A0A02] text-xs" style={{ fontWeight: 600 }}>{(uni.tuitionMin / 1000).toFixed(0)}K–{(uni.tuitionMax / 1000).toFixed(0)}K</div>
                            <div className="text-[#6B3A1F]/50 text-xs">Per Sem</div>
                          </div>
                          <div className="bg-[#FFF8F0] rounded-lg p-2 text-center">
                            <Users className="w-3.5 h-3.5 text-[#C8860A] mx-auto mb-0.5" />
                            <div className="text-[#1A0A02] text-xs" style={{ fontWeight: 600 }}>{uni.seats.toLocaleString()}</div>
                            <div className="text-[#6B3A1F]/50 text-xs">Total Seats</div>
                          </div>
                          <div className="bg-[#FFF8F0] rounded-lg p-2 text-center">
                            <Award className="w-3.5 h-3.5 text-[#C8860A] mx-auto mb-0.5" />
                            <div className="text-[#1A0A02] text-xs" style={{ fontWeight: 600 }}>{uni.gpaMin.toFixed(1)}</div>
                            <div className="text-[#6B3A1F]/50 text-xs">Min GPA</div>
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {uni.subjects.slice(0, 4).map((sub: string) => (
                            <span key={sub} className="px-2 py-0.5 bg-[#D4A857]/10 text-[#C8860A] rounded-full text-xs">{sub}</span>
                          ))}
                          {uni.subjects.length > 4 && (
                            <span className="px-2 py-0.5 bg-[#D4A857]/10 text-[#C8860A] rounded-full text-xs">+{uni.subjects.length - 4} more</span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#D4A857]/10">
                          <div className="flex items-center gap-3 text-xs text-[#6B3A1F]/60">
                            {uni.hasScholarship && (
                              <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">✓ Scholarship</span>
                            )}
                            {uni.hasFFQuota && (
                              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">FF Quota</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[#C8860A] text-xs">
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="bg-[#1A0A02] py-10 mt-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white mb-1" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Need Help Choosing?</h3>
            <p className="text-white/60 text-sm">Our expert agents can help you pick the perfect university based on your profile.</p>
          </div>
          <Link to="/admission-bondu" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl whitespace-nowrap">
            <BookOpen className="w-4 h-4" />
            Get Admission Help
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}