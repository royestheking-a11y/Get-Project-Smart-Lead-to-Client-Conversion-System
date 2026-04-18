import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Home, MapPin, ChevronRight, Banknote, Utensils, Bus, Zap, Calculator, Info } from "lucide-react";

const ACCOM_IMAGE = "https://images.unsplash.com/photo-1767884162402-683fdd430046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwYWNjb21tb2RhdGlvbiUyMGRvcm1pdG9yeXxlbnwxfHx8fDE3NzQ0OTkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080";

interface CityData {
  name: string;
  lifestyle: {
    budget: { rent: number; food: number; transport: number; utilities: number };
    standard: { rent: number; food: number; transport: number; utilities: number };
    premium: { rent: number; food: number; transport: number; utilities: number };
  };
  hostelRent: { min: number; max: number };
  privateRent: { min: number; max: number };
  description: string;
}

export const initialCityData: Record<string, CityData> = {
  Dhaka: {
    name: "Dhaka",
    lifestyle: {
      budget: { rent: 4500, food: 4000, transport: 1200, utilities: 800 },
      standard: { rent: 7000, food: 6000, transport: 2000, utilities: 1200 },
      premium: { rent: 12000, food: 10000, transport: 3500, utilities: 2000 },
    },
    hostelRent: { min: 4000, max: 8000 },
    privateRent: { min: 6000, max: 15000 },
    description: "Capital city with highest cost of living but most opportunities.",
  },
  Chittagong: {
    name: "Chittagong",
    lifestyle: {
      budget: { rent: 3500, food: 3500, transport: 1000, utilities: 700 },
      standard: { rent: 5500, food: 5000, transport: 1500, utilities: 1000 },
      premium: { rent: 9000, food: 8000, transport: 2500, utilities: 1500 },
    },
    hostelRent: { min: 3500, max: 7000 },
    privateRent: { min: 5000, max: 12000 },
    description: "Port city with moderate living costs and growing opportunities.",
  },
  Sylhet: {
    name: "Sylhet",
    lifestyle: {
      budget: { rent: 3000, food: 3000, transport: 800, utilities: 600 },
      standard: { rent: 4500, food: 4500, transport: 1200, utilities: 900 },
      premium: { rent: 7000, food: 7000, transport: 2000, utilities: 1300 },
    },
    hostelRent: { min: 3000, max: 6000 },
    privateRent: { min: 4000, max: 9000 },
    description: "Tea capital with lower costs and beautiful surroundings.",
  },
  Rajshahi: {
    name: "Rajshahi",
    lifestyle: {
      budget: { rent: 2500, food: 2800, transport: 700, utilities: 500 },
      standard: { rent: 4000, food: 4000, transport: 1000, utilities: 700 },
      premium: { rent: 6500, food: 6000, transport: 1800, utilities: 1100 },
    },
    hostelRent: { min: 2500, max: 5000 },
    privateRent: { min: 3500, max: 8000 },
    description: "Silk city with very affordable living costs.",
  },
  Khulna: {
    name: "Khulna",
    lifestyle: {
      budget: { rent: 2500, food: 2800, transport: 700, utilities: 500 },
      standard: { rent: 4000, food: 4000, transport: 1000, utilities: 700 },
      premium: { rent: 6000, food: 6000, transport: 1800, utilities: 1100 },
    },
    hostelRent: { min: 2500, max: 5000 },
    privateRent: { min: 3500, max: 7000 },
    description: "Industrial city near the Sundarbans with affordable costs.",
  },
  Barisal: {
    name: "Barisal",
    lifestyle: {
      budget: { rent: 2000, food: 2500, transport: 600, utilities: 450 },
      standard: { rent: 3500, food: 3800, transport: 900, utilities: 650 },
      premium: { rent: 6000, food: 5500, transport: 1600, utilities: 1000 },
    },
    hostelRent: { min: 2000, max: 4500 },
    privateRent: { min: 3000, max: 7000 },
    description: "Venice of the East with very affordable living costs and riverine beauty.",
  },
  Rangpur: {
    name: "Rangpur",
    lifestyle: {
      budget: { rent: 2000, food: 2500, transport: 600, utilities: 450 },
      standard: { rent: 3500, food: 3800, transport: 800, utilities: 600 },
      premium: { rent: 5500, food: 5500, transport: 1500, utilities: 900 },
    },
    hostelRent: { min: 2000, max: 4000 },
    privateRent: { min: 3000, max: 6500 },
    description: "Northern divisional city with one of the lowest living costs in Bangladesh.",
  },
  Mymensingh: {
    name: "Mymensingh",
    lifestyle: {
      budget: { rent: 2200, food: 2700, transport: 700, utilities: 500 },
      standard: { rent: 3800, food: 4000, transport: 1000, utilities: 750 },
      premium: { rent: 6500, food: 6000, transport: 1800, utilities: 1200 },
    },
    hostelRent: { min: 2200, max: 5000 },
    privateRent: { min: 3500, max: 8000 },
    description: "Educational hub with moderate living costs and proximity to Dhaka.",
  },
};

export const initialAccomTypes = [
  {
    title: "University Hostel",
    pros: ["Cheapest option", "Campus proximity", "Safe environment", "Meal facilities"],
    cons: ["Limited availability", "Fixed rules", "Less privacy", "Waitlist possible"],
    cost: "2,500–8,000 BDT/month",
    icon: "🏛️",
  },
  {
    title: "Mess / Shared Room",
    pros: ["Affordable", "Flexible", "Shared bills", "Social environment"],
    cons: ["Less privacy", "Shared facilities", "May lack amenities"],
    cost: "3,000–7,000 BDT/month",
    icon: "🏠",
  },
  {
    title: "Private Apartment",
    pros: ["Full privacy", "Own space", "More freedom", "Modern amenities"],
    cons: ["Most expensive", "Utility bills separate", "Security deposit required"],
    cost: "6,000–20,000 BDT/month",
    icon: "🏢",
  },
  {
    title: "Sublet Room",
    pros: ["Furnished options", "Bills included", "Flexible terms"],
    cons: ["Limited control", "Owner on premises", "May be cramped"],
    cost: "4,000–10,000 BDT/month",
    icon: "🛋️",
  },
];

export default function Accommodation() {
  const ACCOM_KEY = "bd_admission_accommodation";
  const [cityData, setCityData] = useState<Record<string, CityData>>(() => {
    const stored = localStorage.getItem(ACCOM_KEY);
    return stored ? JSON.parse(stored) : initialCityData;
  });
  const [selectedCity, setSelectedCity] = useState("Dhaka");
  const [lifestyle, setLifestyle] = useState<"budget" | "standard" | "premium">("standard");
  const [accommodationType, setAccommodationType] = useState<"hostel" | "private">("hostel");

  const [accomTypes] = useState(() => {
    const stored = localStorage.getItem("bd_admission_accom_types");
    return stored ? JSON.parse(stored) : initialAccomTypes;
  });

  const city = cityData[selectedCity];
  const costs = city.lifestyle[lifestyle];
  const rentCost = accommodationType === "hostel"
    ? Math.round((city.hostelRent.min + city.hostelRent.max) / 2)
    : Math.round((city.privateRent.min + city.privateRent.max) / 2);

  const total = rentCost + costs.food + costs.transport + costs.utilities;
  const yearlyTotal = total * 12;
  const semesterTotal = total * 6;

  const tips = [
    { icon: Info, title: "Book Early", desc: "University hostels fill up fast. Apply at the beginning of admission." },
    { icon: MapPin, title: "Check Distance", desc: "Choose accommodation within 3km of your campus to save on transport." },
    { icon: Banknote, title: "Split Bills", desc: "Share a flat with 2-3 coursemates to reduce costs by 40-50%." },
    { icon: Home, title: "Visit in Person", desc: "Always inspect the room/flat before paying advance or security deposit." },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* ... (rest of header) */}

      {/* Header */}
      <div className="bg-[#1A0A02] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ACCOM_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A02] to-[#1A0A02]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Accommodation</span>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
            Accommodation & <span className="text-[#D4A857]">Living Cost</span> Estimator
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Plan your monthly budget accurately. Calculate rent, food, transport and utilities for any city in Bangladesh.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-[#1A0A02] to-[#3B1A0A] px-6 py-4 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#D4A857]" />
                <h2 className="text-[#D4A857]" style={{ fontSize: "1rem", fontWeight: 600 }}>Living Cost Calculator</h2>
              </div>
              <div className="p-6">
                {/* City Selection */}
                <div className="mb-5">
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-3 block" style={{ fontWeight: 600 }}>Select City</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {Object.keys(cityData).map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedCity(c)}
                        className={`py-2.5 rounded-xl text-sm transition-all ${
                          selectedCity === c
                            ? "bg-[#C8860A] text-white shadow-md"
                            : "bg-[#FFF8F0] border border-[#D4A857]/30 text-[#6B3A1F] hover:border-[#C8860A]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="mb-5">
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-3 block" style={{ fontWeight: 600 }}>Lifestyle Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "budget", label: "Budget", emoji: "💰", desc: "Minimal expenses" },
                      { key: "standard", label: "Standard", emoji: "⚖️", desc: "Comfortable living" },
                      { key: "premium", label: "Premium", emoji: "✨", desc: "Above average" },
                    ].map(({ key, label, emoji, desc }) => (
                      <button
                        key={key}
                        onClick={() => setLifestyle(key as typeof lifestyle)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          lifestyle === key
                            ? "bg-[#C8860A] text-white border-2 border-[#C8860A]"
                            : "bg-[#FFF8F0] border-2 border-[#D4A857]/20 hover:border-[#C8860A]/50"
                        }`}
                      >
                        <div className="text-lg mb-0.5">{emoji}</div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{label}</div>
                        <div className={`text-xs ${lifestyle === key ? "text-white/80" : "text-[#6B3A1F]/60"}`}>{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accommodation Type */}
                <div className="mb-6">
                  <label className="text-[#1A0A02] text-xs uppercase tracking-wider mb-3 block" style={{ fontWeight: 600 }}>Accommodation Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAccommodationType("hostel")}
                      className={`p-4 rounded-xl text-left transition-all ${
                        accommodationType === "hostel"
                          ? "bg-[#C8860A] text-white"
                          : "bg-[#FFF8F0] border border-[#D4A857]/30"
                      }`}
                    >
                      <div className="text-lg mb-1">🏛️</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>University Hostel</div>
                      <div className={`text-xs ${accommodationType === "hostel" ? "text-white/80" : "text-[#6B3A1F]/60"}`}>
                        {city.hostelRent.min.toLocaleString()}–{city.hostelRent.max.toLocaleString()} BDT/mo
                      </div>
                    </button>
                    <button
                      onClick={() => setAccommodationType("private")}
                      className={`p-4 rounded-xl text-left transition-all ${
                        accommodationType === "private"
                          ? "bg-[#C8860A] text-white"
                          : "bg-[#FFF8F0] border border-[#D4A857]/30"
                      }`}
                    >
                      <div className="text-lg mb-1">🏠</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>Private Room/Flat</div>
                      <div className={`text-xs ${accommodationType === "private" ? "text-white/80" : "text-[#6B3A1F]/60"}`}>
                        {city.privateRent.min.toLocaleString()}–{city.privateRent.max.toLocaleString()} BDT/mo
                      </div>
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-2xl p-6">
                  <h3 className="text-[#D4A857] mb-4 text-sm" style={{ fontWeight: 600 }}>
                    💡 Estimated Monthly Cost — {city.name} ({lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1)} Lifestyle)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Home, label: `${accommodationType === "hostel" ? "University Hostel" : "Private Room"} Rent`, value: rentCost, color: "#D4A857" },
                      { icon: Utensils, label: "Food & Groceries", value: costs.food, color: "#E8A87C" },
                      { icon: Bus, label: "Transport", value: costs.transport, color: "#7EB8D4" },
                      { icon: Zap, label: "Utilities (Electric, Water, Internet)", value: costs.utilities, color: "#A8D47E" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color }} />
                          <span className="text-white/70 text-sm">{label}</span>
                        </div>
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>{value.toLocaleString()} BDT</span>
                      </div>
                    ))}
                    <div className="border-t border-white/20 pt-3 mt-3 flex items-center justify-between">
                      <span className="text-[#D4A857]" style={{ fontWeight: 600 }}>Total Monthly Cost</span>
                      <span className="text-[#D4A857] text-xl" style={{ fontWeight: 700 }}>{total.toLocaleString()} BDT</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white/50 text-xs mb-1">Per Semester (6 months)</p>
                      <p className="text-white" style={{ fontWeight: 700 }}>{semesterTotal.toLocaleString()} BDT</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white/50 text-xs mb-1">Per Year (12 months)</p>
                      <p className="text-white" style={{ fontWeight: 700 }}>{yearlyTotal.toLocaleString()} BDT</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B3A1F]/50 mt-3">
                  * Estimates based on 2025-26 market rates. Actual costs may vary. Does not include tuition fees.
                </p>
              </div>
            </motion.div>

            {/* Accommodation Types */}
            <div>
              <h2 className="text-[#1A0A02] mb-5" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Types of Student Accommodation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {accomTypes.map((type: any, i: number) => (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="bg-white border border-[#D4A857]/20 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <h3 className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>{type.title}</h3>
                        <p className="text-[#C8860A] text-xs">{type.cost}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-green-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>✅ Pros</p>
                        {type.pros.map((p: any) => (
                          <p key={p} className="text-[#1A0A02]/70 text-xs mb-1">• {p}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-red-600 text-xs mb-1.5" style={{ fontWeight: 600 }}>❌ Cons</p>
                        {type.cons.map((c: any) => (
                          <p key={c} className="text-[#1A0A02]/70 text-xs mb-1">• {c}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* City Overview */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden">
              <div className="bg-[#1A0A02] px-5 py-4">
                <h3 className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>{selectedCity} — Cost Overview</h3>
              </div>
              <div className="p-5">
                <p className="text-[#6B3A1F]/70 text-sm mb-4">{city.description}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#6B3A1F]/60 mb-1">University Hostel Range</p>
                    <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>
                      {city.hostelRent.min.toLocaleString()} – {city.hostelRent.max.toLocaleString()} BDT/month
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B3A1F]/60 mb-1">Private Room/Flat Range</p>
                    <p className="text-[#1A0A02] text-sm" style={{ fontWeight: 600 }}>
                      {city.privateRent.min.toLocaleString()} – {city.privateRent.max.toLocaleString()} BDT/month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-5">
              <h3 className="text-[#1A0A02] mb-4 text-sm" style={{ fontWeight: 600 }}>💡 Smart Living Tips</h3>
              <div className="space-y-4">
                {tips.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#C8860A]" />
                    </div>
                    <div>
                      <p className="text-[#1A0A02] text-xs" style={{ fontWeight: 600 }}>{title}</p>
                      <p className="text-[#6B3A1F]/60 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Comparison */}
            <div className="bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-2xl p-5">
              <h3 className="text-[#D4A857] text-sm mb-4" style={{ fontWeight: 600 }}>City Cost Comparison</h3>
              <div className="space-y-3">
                {Object.entries(cityData).map(([cityName, data]) => {
                  const monthlyStd = data.lifestyle.standard;
                  const avgRent = Math.round((data.hostelRent.min + data.hostelRent.max) / 2);
                  const cityTotal = avgRent + monthlyStd.food + monthlyStd.transport + monthlyStd.utilities;
                  const maxTotal = 21000;
                  const pct = Math.round((cityTotal / maxTotal) * 100);

                  return (
                    <div key={cityName}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">{cityName}</span>
                        <span className="text-[#D4A857]">{cityTotal.toLocaleString()} BDT</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4A857] to-[#C8860A] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-white/40 text-xs mt-3">*Standard lifestyle + hostel average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}