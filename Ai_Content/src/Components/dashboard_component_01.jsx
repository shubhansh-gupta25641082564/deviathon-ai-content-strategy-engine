import React, { useEffect, useState } from 'react';

const DashboardComponent = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setLoaded(true);
  }, []);

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      {/* Divs aligned right, left, right */}
      <div className={`flex justify-end mb-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
        <div className="bg-yellow-500 text-white p-8 rounded-xl w-2/3 h-96 text-center text-2xl relative overflow-hidden group hover:shadow-lg transition-all">
          <img 
            src="https://img.freepik.com/free-vector/artificial-intelligence-concept-circuit-board-background-with-perspective_1017-28415.jpg" 
            alt="Trending Content"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="font-bold mb-4">Latest Trending Content</h2>
            <p className="text-lg">Discover what's hot in AI</p>
          </div>
        </div>
      </div>

      <div className={`flex justify-start mb-6 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
        <div className="bg-blue-500 text-white p-8 rounded-xl w-2/3 h-96 text-center text-2xl relative overflow-hidden group hover:shadow-lg transition-all">
          <img 
            src="https://img.freepik.com/free-vector/artificial-intelligence-brain-background-with-electric-circuits_1017-16502.jpg" 
            alt="Performance"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="font-bold mb-4">Boost Your Performances</h2>
            <p className="text-lg">Optimize your AI workflow</p>
          </div>
        </div>
      </div>

      <div className={`flex justify-end mb-10 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
        <div className="bg-pink-500 text-white p-8 rounded-xl w-2/3 h-96 text-center text-2xl relative overflow-hidden group hover:shadow-lg transition-all">
          <img 
            src="https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148865392.jpg" 
            alt="Stand Out"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="font-bold mb-4">Stand out from the Crowd</h2>
            <p className="text-lg">Unique AI solutions for your needs</p>
          </div>
        </div>
      </div>

      {/* Stats Div */}
      <div className={`bg-gray-300 p-8 rounded-xl text-center text-3xl font-bold mb-10 h-48 flex items-center justify-center relative overflow-hidden transition-all duration-1000 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <img 
          src="https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg" 
          alt="Stats Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10">
          <h2 className="mb-2">Stats</h2>
          <p className="text-2xl">Your AI Performance Metrics</p>
        </div>
      </div>

      {/* Get Started Button */}
      <div className={`text-center transition-all duration-1000 delay-800 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <button className="bg-blue-600 text-white text-xl font-semibold py-4 px-10 rounded-xl hover:bg-blue-700 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default DashboardComponent;
