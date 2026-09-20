import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Phone, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { contactMessages, updateMessageStatus, showToast } = useStore();

  const handleToggleStatus = (id: string, current: string) => {
    const next = current === 'replied' ? 'unread' : 'replied';
    updateMessageStatus(id, next);
    showToast('Status Updated', `Marked enquiry as ${next}`);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${name}, this is the Head Pâtissier from Velvet Cocoa Atelier regarding your custom inquiry.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Patron Inquiries &amp; Bespoke Requests ({contactMessages.length})
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Messages sent through the atelier concierge contact form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-3xl p-6 border border-[#2D1810]/10 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EADBC8]/40 text-[#23120B]">
                  {msg.subject}
                </span>

                <button
                  onClick={() => handleToggleStatus(msg.id, msg.status)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    msg.status === 'replied'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800 animate-pulse'
                  }`}
                >
                  {msg.status === 'replied' ? 'Responded' : 'Action Required'}
                </button>
              </div>

              <p className="text-xs text-[#3E2723] bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#2D1810]/5 leading-relaxed">
                "{msg.message}"
              </p>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#23120B] text-sm">{msg.name}</p>
                <div className="flex flex-wrap gap-4 text-[11px] text-[#3E2723]/70">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>{msg.phone}</span>
                  </span>
                  {msg.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{msg.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2D1810]/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#3E2723]/50">
                {new Date(msg.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsApp(msg.phone, msg.name)}
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
