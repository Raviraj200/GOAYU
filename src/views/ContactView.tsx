import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronRight, CheckSquare } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: string) => void;
}

export default function ContactView({ onNavigate }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && msg.trim()) {
      try {
        await fetch('/api/queries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            query: msg.trim(),
            subject: 'Therapeutic Inquiry'
          })
        });
      } catch (err) {
        console.error('Failed to submit inquiry', err);
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMsg('');
      setTimeout(() => setSubmitted(false), 8000);
    }
  };

  return (
    <div id="goayu-contact-root" className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb row */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 mb-8 border-b border-light-beige/20 pb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700 cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 stroke-[3px]" />
          <span className="text-emerald-950 font-bold">Ayurvedic Support Center</span>
        </div>

        {/* Content layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left panel - Info coords */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-amber-700 text-xs font-mono font-bold uppercase tracking-widest block">Continuous Consultation Support</span>
              <h1 className="text-3xl font-serif font-black text-emerald-950 tracking-tight leading-tight">Get in Touch with GoAyu Research</h1>
              <p className="text-xs text-stone-605 leading-relaxed">
                Whether you have deep questions about specific ingredients (e.g., swarna bhasma, kumkumadi, bhringraj) or you represent a healthcare practitioner, our Haridwar compounding pharmacists are ready to help.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="bg-white border text-xs p-4 rounded-xl flex gap-3.5 items-start">
                <MapPin className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-950">Address</h4>
                  <p className="text-stone-500 mt-0.5">Banda, Sagar, Madhya Pradesh - 470335</p>
                </div>
              </div>

              <div className="bg-white border text-xs p-4 rounded-xl flex gap-3.5 items-start">
                <Phone className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-950">Helpline (WhatsApp Active)</h4>
                  <p className="text-stone-500 mt-0.5">+91-9644985389 (Mon - Sat, 9:00 AM - 6:00 PM IST)</p>
                </div>
              </div>

              <div className="bg-white border text-xs p-4 rounded-xl flex gap-3.5 items-start">
                <Mail className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-950">Support E-mail</h4>
                  <p className="text-stone-500 mt-0.5">research@goayu.com • support@goayu.co.in</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 border text-white p-5 rounded-2xl">
              <p className="text-xs leading-relaxed text-emerald-200">
                ✦ Immediate support for existing order delivery issues can also be requested via our interactive **AyuBot Chat System** located at the bottom corner of your screen!
              </p>
            </div>
          </div>

          {/* Right panel - Input intake Form */}
          <div className="lg:col-span-7 bg-white border border-stone-200 p-8 rounded-2xl shadow-sm">
            <h2 className="text-base font-serif font-bold text-emerald-950 tracking-wide pb-4 border-b border-stone-105 mb-6 uppercase">
              Inquire From Our Research Pharmacist
            </h2>

            {submitted ? (
              <div className="bg-emerald-100/50 border border-emerald-300 text-emerald-900 text-xs p-6 rounded-xl text-center space-y-3">
                <CheckSquare className="w-8 h-8 text-emerald-800 mx-auto" />
                <h4 className="font-bold text-sm">Pranam! Query Deposited</h4>
                <p className="text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Your biochemical profile inquiry has been securely stored inside our research database queue. An active in-house clinical Vaidya from Haridwar will reach out to you via email within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Aniket Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-605 font-semibold mb-1">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-605 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="aniket.sharma@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                  />
                </div>

                <div>
                  <label className="block text-stone-605 font-semibold mb-1">Detailed Inquiry Description (Dosha imbalance symptomatology etc.) *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe textures of skin rashes, gastric sensitivities, daily sleep struggles, or specific formulation compound queries..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    className="w-full bg-emerald-850 hover:bg-emerald-900 border border-emerald-950 text-white font-bold py-3.5 rounded-lg text-center cursor-pointer transition-colors uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
