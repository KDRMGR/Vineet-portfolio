import { Camera, Music, Users, Moon, Briefcase } from 'lucide-react';

const categories = [
  {
    name: 'Fashion & Lifestyle',
    icon: Camera,
    description: 'Editorial shoots and lifestyle photography'
  },
  {
    name: 'Concerts',
    icon: Music,
    description: 'Live music and performance documentation'
  },
  {
    name: 'People & Places',
    icon: Users,
    description: 'Portrait and location photography'
  },
  {
    name: 'Nightlife',
    icon: Moon,
    description: 'Night scene and club photography'
  },
  {
    name: 'Corporate Events',
    icon: Briefcase,
    description: 'Professional event coverage'
  },
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-16 text-center">
          My Projects
        </h2>

        <p className="text-center text-lg mb-12 uppercase tracking-wider">
          Click on respective categories to navigate
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden border-2 border-white rounded-lg p-8 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <IconComponent className="w-16 h-16" />
                  <h3 className="text-2xl font-bold uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <p className="text-sm tracking-wide opacity-80">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
