import { useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Linkedin, Instagram, Send, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Heading + contact */}
            <div>
              <p className="text-lg md:text-xl font-semibold tracking-wider" style={{ color: '#9f532e' }}>
                Moksh Vora
              </p>
              <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-wider leading-tight mt-4 mb-10">
                Work<br />With Me
              </h1>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6" />
                  <span className="text-lg">Mumbai, India</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6" />
                  <a href="tel:+918454871977" className="text-lg hover:opacity-80 transition-opacity">
                    +91 845 487 1977
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6" />
                  <a href="mailto:mokshvora69@gmail.com" className="text-lg hover:opacity-80 transition-opacity">
                    mokshvora69@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex gap-6 mt-10">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="w-7 h-7" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-7 h-7" />
                </a>
              </div>
            </div>
            {/* Right: Collage */}
            <div className="relative">
              <div className="w-full max-w-lg mx-auto">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=800&fit=crop"
                    alt="Hero main"
                    className="w-full h-auto object-cover rounded-md shadow-md"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
                    alt="Secondary"
                    className="absolute -right-6 -bottom-6 w-40 h-40 object-cover rounded-md shadow-md rotate-6"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=500&fit=crop"
                    alt="Secondary"
                    className="absolute -left-6 -top-6 w-36 h-36 object-cover rounded-md shadow-md -rotate-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                  Get In Touch
                </h2>
                <p className="text-lg leading-relaxed text-gray-300 mb-8">
                  Have a project in mind? Whether it's a corporate event, wedding, portrait session,
                  or commercial shoot, I'd love to hear about it. Let's work together to create
                  something amazing.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Phone</h3>
                    <a
                      href="tel:+918454871977"
                      className="text-lg hover:text-[#ff8c42] transition-colors"
                    >
                      +91 845 487 1977
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Email</h3>
                    <a
                      href="mailto:contact@vineetlabdhe.com"
                      className="text-lg hover:text-[#ff8c42] transition-colors"
                    >
                      contact@vineetlabdhe.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Location</h3>
                    <p className="text-lg text-gray-300">Mumbai, Maharashtra, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                      Response Time
                    </h3>
                    <p className="text-lg text-gray-300">Within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-8 border-t border-gray-800">
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">Connect With Me</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="border-2 border-gray-800 p-8">
                <h3 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                  Send a Message
                </h3>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
                    <p className="text-gray-400">Thank you for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm uppercase tracking-wider mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                        placeholder="Project inquiry, booking, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm uppercase tracking-wider mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ff8c42] text-black font-bold uppercase tracking-wider py-4 px-8 hover:bg-white transition-colors flex items-center justify-center gap-3 group"
                    >
                      <span>Send Message</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-16 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: 'What areas do you cover?',
                a: 'I primarily work in Mumbai and surrounding areas, but I\'m available for travel worldwide for destination events and shoots.',
              },
              {
                q: 'How far in advance should I book?',
                a: 'I recommend booking at least 2-3 months in advance for events, especially during peak season. However, I can accommodate last-minute requests based on availability.',
              },
              {
                q: 'Do you provide both photography and videography?',
                a: 'Yes! I offer complete coverage including photography, cinematography, and video editing services.',
              },
              {
                q: 'How long does editing take?',
                a: 'Turnaround time is typically 2-3 weeks for events and 1-2 weeks for portrait sessions. Rush delivery can be arranged for an additional fee.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-l-2 border-[#ff8c42] pl-6">
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
