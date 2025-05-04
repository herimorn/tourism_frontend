import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Globe, Users, Map } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Virtual Tours',
      description: 'Experience destinations in immersive VR before you travel',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Guides',
      description: 'Connect with professional local guides for authentic experiences',
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: 'Curated Experiences',
      description: 'Discover handpicked tours and unique adventures',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
            alt="Travel Adventure"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore the World in VR
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Experience destinations before you travel. Book guided tours with local experts 
            and create unforgettable memories.
          </p>
          <div className="mt-10">
            <Link
              to="/tours"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Compass className="h-5 w-5 mr-2" />
              Explore Tours
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Experience Travel Like Never Before
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Immerse yourself in destinations worldwide with our cutting-edge VR technology
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="pt-6"
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        {React.cloneElement(feature.icon, {
                          className: 'h-6 w-6 text-white',
                        })}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}