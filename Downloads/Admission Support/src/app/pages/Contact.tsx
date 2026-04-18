import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, ChevronRight } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Contact</span>
          </div>
          <h1 className="text-white mb-3" style={{ fontSize: "2.2rem", fontWeight: 700 }}>Get in <span className="text-[#D4A857]">Touch</span></h1>
          <p className="text-white/60 max-w-xl mx-auto">Have questions about admission? Our expert team is ready to help you every step of the way.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              { icon: Phone, title: "Phone Support", info: ["+880 1700-000000", "+880 1800-000000"], sub: "Sat–Thu, 9 AM – 9 PM", color: "#D4A857" },
              { icon: Mail, title: "Email Support", info: ["info@admissionbondu.com", "support@admissionbondu.com"], sub: "Reply within 24 hours", color: "#C8860A" },
              { icon: MapPin, title: "Office Address", info: ["House 15, Road 4", "Dhanmondi, Dhaka-1205"], sub: "Bangladesh", color: "#B8750A" },
              { icon: Clock, title: "Working Hours", info: ["Saturday – Thursday", "9:00 AM – 9:00 PM"], sub: "Friday: Closed", color: "#D4A857" },
            ].map(({ icon: Icon, title, info, sub, color }) => (
              <div key={title} className="bg-white border border-[#D4A857]/20 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-[#1A0A02] text-sm mb-1" style={{ fontWeight: 600 }}>{title}</h3>
                  {info.map((line, i) => (
                    <p key={i} className="text-[#6B3A1F] text-sm">{line}</p>
                  ))}
                  <p className="text-[#6B3A1F]/50 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6" />
                <h3 className="text-sm" style={{ fontWeight: 600 }}>WhatsApp Support</h3>
              </div>
              <p className="text-white/80 text-sm mb-3">Get instant help via WhatsApp. Send your query and get a reply within minutes.</p>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 bg-white text-green-700 rounded-xl text-center text-sm hover:bg-white/90 transition-all"
                style={{ fontWeight: 600 }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#D4A857]/20 rounded-2xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Message Sent Successfully!</h3>
                <p className="text-[#6B3A1F]/70 mb-6">
                  Thank you for contacting us. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl text-sm"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-8">
                <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.4rem", fontWeight: 700 }}>Send Us a Message</h2>
                <p className="text-[#6B3A1F]/60 mb-6 text-sm">Fill out the form below and we'll respond within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Full Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl px-4 py-3 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl px-4 py-3 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Phone Number</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+880 1700-000000"
                        className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl px-4 py-3 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                      />
                    </div>
                    <div>
                      <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Subject *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                        className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl px-4 py-3 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                      >
                        <option value="">Select a subject</option>
                        <option>University Admission Query</option>
                        <option>Medical Admission Help</option>
                        <option>Application Status</option>
                        <option>Payment Issue</option>
                        <option>Scholarship Information</option>
                        <option>Technical Support</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#1A0A02] text-xs mb-1.5 block" style={{ fontWeight: 600 }}>Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                      placeholder="Describe your query in detail. Include your GPA, preferred subject, and city if relevant."
                      className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl px-4 py-3 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4A857]/30 transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            )}

            {/* FAQ Shortcut */}
            <div className="mt-6 bg-[#1A0A02] rounded-2xl p-6">
              <h3 className="text-[#D4A857] mb-3 text-sm" style={{ fontWeight: 600 }}>Common Questions</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  "How do I track my application?",
                  "What documents do I need?",
                  "How long does processing take?",
                  "Can I apply to multiple universities?",
                ].map(q => (
                  <Link key={q} to="/#faq" className="flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white text-xs transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4A857]" />
                    {q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
