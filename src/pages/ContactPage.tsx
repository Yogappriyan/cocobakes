import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, addContactMessage, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Custom Cake Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Missing Fields', 'Please complete your contact details and message', 'warning');
      return;
    }

    addContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject,
      message: message.trim(),
    });

    setSubmitted(true);
    showToast('Enquiry Received ✨', 'Our pastry concierge will get in touch within 2 business hours.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello ${siteSettings.brandName} Concierge! 🎂\nI would like to discuss a custom bakery order / bulk gifting requirement.`
    );
    const cleanPhone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC8]/50 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#23120B]">
          Connect With Our Confectioners
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-2">
          Have a bespoke celebration cake, dessert table catering, or luxury corporate gifting enquiry? We are delighted to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1810]/10 shadow-xs space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#23120B]">
              Atelier Coordinates
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#C59B27] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#23120B]">Kitchen Location</h4>
                  <p className="text-[#3E2723]/80 mt-0.5 leading-relaxed">
                    {siteSettings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#C59B27] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#23120B]">Concierge Phone</h4>
                  <p className="text-[#3E2723]/80 mt-0.5">{siteSettings.contactNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#C59B27] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#23120B]">Direct Email</h4>
                  <p className="text-[#3E2723]/80 mt-0.5">{siteSettings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#C59B27] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#23120B]">Baking Hours</h4>
                  <p className="text-[#3E2723]/80 mt-0.5">
                    Monday - Sunday: 9:00 AM - 10:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Button */}
            <button
              onClick={handleWhatsAppDirect}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Instant Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1810]/10 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#23120B] mb-1">
              Send a Bespoke Request
            </h3>
            <p className="text-xs text-[#3E2723]/70 mb-6">
              Fill out this form and our culinary team will respond with flavor profiles and quotes.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-emerald-900">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Thank you for reaching out. We have logged your enquiry in our atelier desk and will reply shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-900 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohini Sen"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rohini@example.com"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Occasion / Inquiry *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    >
                      <option>Custom Cake Inquiry</option>
                      <option>Wedding &amp; Engagement Hampers</option>
                      <option>Corporate Gifting (Bulk)</option>
                      <option>Dietary / Allergy Questions</option>
                      <option>Delivery Logistics Inquiry</option>
                      <option>Other Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#23120B] mb-1">
                    Your Requirements &amp; Date *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the desired flavour, guest count, celebration date, and custom design preferences..."
                    className="w-full p-3 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Pâtissier</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
