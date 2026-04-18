import { Link } from "react-router";
import { GraduationCap, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A0A02] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-[#1A0A02]" />
              </div>
              <div>
                <span className="text-white font-semibold text-base leading-none block">Admission</span>
                <span className="text-[#D4A857] text-xs leading-none">Bondu</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Admission Bondu is Bangladesh's most comprehensive university admission platform. Guiding students from HSC to university success.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/5 hover:bg-[#D4A857]/20 border border-white/10 hover:border-[#D4A857]/40 rounded-full flex items-center justify-center text-white/60 hover:text-[#D4A857] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#D4A857] text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "University Finder", path: "/universities" },
                { label: "Admission Bondu", path: "/admission-bondu" },
                { label: "Medical Admission", path: "/medical-admission" },
                { label: "Accommodation Guide", path: "/accommodation" },
                { label: "Tutorials", path: "/tutorial" },
                { label: "Notice Board", path: "/notice" },
                { label: "Student Dashboard", path: "/dashboard" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#D4A857] text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#D4A857]/50 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-[#D4A857] text-sm mb-5 uppercase tracking-wider">Top Universities</h4>
            <ul className="space-y-2.5">
              {[
                "North South University",
                "BRAC University",
                "AIUB",
                "Daffodil International University",
                "University of Dhaka",
                "BUET",
                "East West University",
              ].map((uni) => (
                <li key={uni}>
                  <Link
                    to="/universities"
                    className="text-white/60 hover:text-[#D4A857] text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#D4A857]/50 rounded-full"></span>
                    {uni}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#D4A857] text-sm mb-5 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#D4A857]" />
                </div>
                <span className="text-white/60 text-sm">House 15, Road 4, Dhanmondi, Dhaka-1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#D4A857]" />
                </div>
                <div>
                  <a href="tel:+8801700000000" className="text-white/60 hover:text-[#D4A857] text-sm transition-colors block">+880 1700-000000</a>
                  <a href="tel:+8801800000000" className="text-white/60 hover:text-[#D4A857] text-sm transition-colors block">+880 1800-000000</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#D4A857]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#D4A857]" />
                </div>
                <a href="mailto:info@admissionbondu.com" className="text-white/60 hover:text-[#D4A857] text-sm transition-colors">info@admissionbondu.com</a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-[#D4A857]/10 border border-[#D4A857]/20 rounded-xl">
              <p className="text-[#D4A857] text-xs mb-1">Support Hours</p>
              <p className="text-white/70 text-sm">Sat – Thu: 9:00 AM – 9:00 PM</p>
              <p className="text-white/70 text-sm">Friday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © 2026 Admission Bondu. All rights reserved by{" "}
            <a 
              href="https://rsiclub.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#D4A857] transition-colors font-medium"
            >
              Rizqara science & innovation club
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-white/40 hover:text-[#D4A857] text-xs transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-white/40 hover:text-[#D4A857] text-xs transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-white/40 hover:text-[#D4A857] text-xs transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
