import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const technicalSkills = [
  { name: 'Photoshop', level: 90 },
  { name: 'Illustrator', level: 72 },
  { name: 'Canva', level: 88 },
  { name: 'Photography', level: 95 },
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
];

const education = [
  { institution: "Children's Academy", years: '2011-2021' },
  { institution: 'PACE Jr. Science College', years: '2021-2023' },
  { institution: 'Jai Hind College', years: '2023-2026' },
];

export default function Resume() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="resume" className="min-h-screen bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em]">
            Resume
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            <span className="uppercase tracking-wider">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-16 animate-fadeIn">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-8">
                Technical Skills
              </h3>
              <div className="space-y-6">
                {technicalSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">{skill.name}</span>
                      <span className="text-lg" style={{ color: '#9f532e' }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: '#9f532e'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-8">
                Visual Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {visualSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="border-2 border-white p-4 rounded-lg text-center hover:bg-white hover:text-black transition-colors"
                  >
                    <span className="text-lg font-semibold uppercase tracking-wider">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-8">
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {softSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="border-2 border-black p-4 rounded-lg text-center hover:bg-black hover:text-white transition-colors"
                  >
                    <span className="text-lg font-semibold uppercase tracking-wider">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-8">
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-4 pl-6"
                    style={{ borderColor: '#9f532e' }}
                  >
                    <h4 className="text-2xl font-bold">{edu.institution}</h4>
                    <p className="text-lg text-gray-600">{edu.years}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
