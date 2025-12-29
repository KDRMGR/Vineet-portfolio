import { Phone, Mail, MapPin, Linkedin, Instagram, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="min-h-screen bg-black text-white py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-20 text-center">
          Contact
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Get In Touch
              </h3>
              <p className="text-lg leading-relaxed text-gray-300 mb-8">
                Have a project in mind? Let's work together to create something amazing.
                Feel free to reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <Phone className="w-8 h-8 mt-1 text-[#ff8c42]" />
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-wider mb-2">Phone</h4>
                  <a href="tel:+918454871977" className="text-lg hover:text-[#ff8c42] transition-colors">
                    +91 845 487 1977
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <Mail className="w-8 h-8 mt-1 text-[#ff8c42]" />
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-wider mb-2">Email</h4>
                  <a href="mailto:contact@vineetlabdhe.com" className="text-lg hover:text-[#ff8c42] transition-colors">
                    contact@vineetlabdhe.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <MapPin className="w-8 h-8 mt-1 text-[#ff8c42]" />
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-wider mb-2">Location</h4>
                  <p className="text-lg text-gray-300">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="text-2xl font-bold uppercase tracking-wider mb-6">
                Connect With Me
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 border-2 border-[#ff8c42] rounded-full hover:bg-[#ff8c42] transition-all"
                >
                  <Linkedin className="w-6 h-6" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 border-2 border-[#ff8c42] rounded-full hover:bg-[#ff8c42] transition-all"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors resize-none"
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
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            © 2024 Vineet Labdhe. Visual Storyteller.
          </p>
        </div>
      </div>
    </section>
  );
}
