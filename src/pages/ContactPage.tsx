import { useEffect, useState, FormEvent } from 'react';
import { Phone, Mail, MapPin, Linkedin, Instagram, Send, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
  const [displayName, setDisplayName] = useState('Vineet Labdhe');
  const [location, setLocation] = useState('Mumbai, India');
  const [phone, setPhone] = useState('+91 845 487 1977');
  const [email, setEmail] = useState('contact@vineetlabdhe.com');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');
  const [heroMainImage, setHeroMainImage] = useState('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=800&fit=crop');
  const [heroSecondary1, setHeroSecondary1] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop');
  const [heroSecondary2, setHeroSecondary2] = useState('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=500&fit=crop');

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

  useEffect(() => {
    const load = async () => {
      const { data: heroContent } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'hero')
        .in('key', ['name']);

      if (heroContent?.[0]?.value) setDisplayName(heroContent[0].value);

      const { data: contactContent } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'contact')
        .in('key', ['email', 'phone', 'location', 'instagram', 'linkedin']);

      for (const row of contactContent || []) {
        if (row.key === 'email') setEmail(row.value);
        if (row.key === 'phone') setPhone(row.value);
        if (row.key === 'location') setLocation(row.value);
        if (row.key === 'instagram') setInstagram(row.value);
        if (row.key === 'linkedin') setLinkedin(row.value);
      }

      const { data: media } = await supabase
        .from('gallery_images')
        .select('*')
        .in('category', ['contact-hero-main', 'contact-hero-secondary-1', 'contact-hero-secondary-2'])
        .order('order_index', { ascending: true });

      const main = (media || []).find((m) => m.category === 'contact-hero-main');
      const s1 = (media || []).find((m) => m.category === 'contact-hero-secondary-1');
      const s2 = (media || []).find((m) => m.category === 'contact-hero-secondary-2');

      if (main?.image_url) setHeroMainImage(main.image_url);
      if (s1?.image_url) setHeroSecondary1(s1.image_url);
      if (s2?.image_url) setHeroSecondary2(s2.image_url);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Heading + contact */}
            <div>
              <p className="text-lg md:text-xl font-semibold tracking-wider" style={{ color: '#9f532e' }}>
                {displayName}
              </p>
              <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-wider leading-tight mt-4 mb-10 text-white">
                Work<br />With Me
              </h1>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-white" />
                  <span className="text-lg text-gray-300">{location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-white" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-lg text-gray-300 hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-white" />
                  <a href={`mailto:${email}`} className="text-lg text-gray-300 hover:text-white transition-colors">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex gap-6 mt-10">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-7 h-7" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                    src={heroMainImage}
                    alt="Hero main"
                    className="w-full h-auto object-cover rounded-md shadow-md"
                  />
                  <img
                    src={heroSecondary1}
                    alt="Secondary"
                    className="absolute -right-6 -bottom-6 w-40 h-40 object-cover rounded-md shadow-md rotate-6"
                  />
                  <img
                    src={heroSecondary2}
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
      <section className="py-20 px-4 md:px-8 bg-black text-white border-t border-gray-900">
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
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Phone</h3>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-lg text-gray-300 hover:text-[#ff8c42] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Email</h3>
                    <a
                      href={`mailto:${email}`}
                      className="text-lg text-gray-300 hover:text-[#ff8c42] transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Location</h3>
                    <p className="text-lg text-gray-300">{location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff8c42] transition-all">
                    <Clock className="w-6 h-6 text-white" />
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
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>

                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Instagram className="w-6 h-6 text-white" />
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
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors text-white"
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
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors text-white"
                        placeholder="Your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors text-white"
                        placeholder="Project type or inquiry"
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
                        rows={5}
                        className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 focus:border-[#ff8c42] outline-none transition-colors text-white"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ff8c42] text-white font-bold uppercase tracking-wider py-4 hover:bg-[#e67e3a] transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}