import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const technicalSkills = [
    { name: 'Photoshop', level: 88 },
    { name: 'Lightroom', level: 90 },
    { name: 'Premiere Pro', level: 85 },
    { name: 'Photography', level: 92 },
  ];

  const education = [
    { institution: 'Jai Hind College', location: 'Mumbai', years: '2023-2026' },
    { institution: 'PACE Jr. Science College', location: 'Mumbai', years: '2021-2023' },
    { institution: 'Children\'s Academy', location: 'Mumbai', years: '2011-2021' },
  ];

  const visualSkills = [
    'Cinematography',
    'Photography',
    'Photo Editing',
    'Video Editing',
    'Social Media',
    'Photo Manipulation',
  ];

  const softSkills = [
    'Attention to Detail',
    'Communication',
    'Collaboration',
    'Problem Solving',
    'Adaptability',
    'Time Management',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-8">
            Vineet Labdhe
          </h1>
          <p className="text-3xl md:text-4xl uppercase tracking-[0.4em] mb-12 text-[#bfdd75]">
            Visual Storyteller
          </p>

          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg md:text-xl leading-relaxed text-justify mb-6">
              The course of my journey has led me to discover my ability to capture moments and
              create enticing visuals. As a commercial event photographer and videographer with a
              strong foundation in mass media, I bring hands-on experience across corporate events,
              conferences, concerts, and live shows.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              Each project adds productive, on-ground experience to my journey, cultivating
              dedication, precision, and professionalism while delivering visuals that meet industry
              standards and resonate with audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Skills and Education Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Technical Skills */}
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Technical Skills
              </h2>
              <div className="space-y-6">
                {technicalSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold">{skill.name}</span>
                      <span className="text-[#ff8c42]">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ff8c42] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-[#ff8c42] pl-4">
                    <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>
                    <p className="text-gray-400">{edu.location}</p>
                    <p className="text-sm text-[#ff8c42] mt-1">{edu.years}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Contact
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#ff8c42]" />
                  <a href="tel:+918454871977" className="hover:text-[#ff8c42] transition-colors">
                    +91 845 487 1977
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#ff8c42]" />
                  <a
                    href="mailto:contact@vineetlabdhe.com"
                    className="hover:text-[#ff8c42] transition-colors"
                  >
                    contact@vineetlabdhe.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#ff8c42]" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Connect</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border-2 border-[#ff8c42] rounded-full flex items-center justify-center hover:bg-[#ff8c42] transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual & Soft Skills Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Visual Skills */}
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Visual Skills
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {visualSkills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ff8c42] rounded-full" />
                    <span className="text-lg">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider mb-8 text-[#ff8c42]">
                Soft Skills
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {softSkills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ff8c42] rounded-full" />
                    <span className="text-lg">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8">
            Explore My Work
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/cinematography"
              className="px-8 py-4 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-all"
            >
              Cinematography
            </Link>
            <Link
              to="/photography"
              className="px-8 py-4 border-2 border-[#ff8c42] text-[#ff8c42] font-bold uppercase tracking-wider hover:bg-[#ff8c42] hover:text-black transition-all"
            >
              Photography
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-[#ff8c42] text-black font-bold uppercase tracking-wider hover:bg-white transition-all"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
