import React from 'react';

export default function AboutUsMinimal() {
  const team = [
    {
      name: "Aarav Gupta",
      role: "Lead AI Engineer",
      img: "https://randomuser.me/api/portraits/men/31.jpg"
    },
    {
      name: "Ishita Verma",
      role: "Content Strategist",
      img: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Rahul Singh",
      role: "UX Developer",
      img: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      name: "Priya Shah",
      role: "Marketing Analyst",
      img: "https://randomuser.me/api/portraits/women/34.jpg"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900">
      {/* Header */}
      <header className="pt-14 pb-7 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Empowering growth with AI: insights, intelligence, and clarity for your evolving content strategy.
        </p>
      </header>

      {/* About Project Section (Image Left, Text Right) */}
      <section className="py-12 px-4 flex flex-col md:flex-row items-center gap-10 md:gap-20 max-w-6xl mx-auto">
        {/* Left (Image) */}
        <div className="flex-1 flex justify-center md:justify-end order-1">
          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
            alt="AI Content Strategy Engine"
            className="rounded-xl shadow-2xl w-full max-w-md object-cover"
          />
        </div>
        {/* Right (Text) */}
        <div className="flex-1 md:pl-6 order-2">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">AI Content Strategy Engine</h2>
          <p className="text-lg text-gray-700 mb-3">
            Our platform is built to transform how teams approach digital content. <span className="font-semibold text-blue-600">AI Content Strategy Engine</span> combines advanced AI, real-time trend insights, and automated competitor tracking, unlocking the next level of content marketing.
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3 space-y-1">
            <li>
              <span className="font-bold text-indigo-700">Discover and analyze emerging trends</span> instantly.
            </li>
            <li>
              <span className="font-bold text-green-700">Benchmark content</span> performance against industry leaders.
            </li>
            <li>
              <span className="font-bold text-cyan-700">Receive tailored recommendations</span> powered by intelligent analysis.
            </li>
            <li>
              <span className="font-bold text-blue-700">Automate reports</span> and access insightful visual dashboards.
            </li>
          </ul>
          <p className="text-base text-gray-700 mt-2">
            From startups to large brands, our mission is to make smart, scientific content strategy simple and scalable for everyone.
          </p>
        </div>
      </section>

      {/* Stylish Team Section: Equal-sized cards in grid */}
      <section className="py-14 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {team.map((member, idx) => (
            <div
              key={member.name}
              className="relative flex flex-col items-center bg-white rounded-2xl shadow-2xl pt-12 pb-8 px-7 h-full transition hover:shadow-blue-200 hover:-translate-y-1"
            >
              {/* Avatar overlapping card top */}
              <div className="absolute left-1/2 -top-12 -translate-x-1/2">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-xl"
                />
              </div>
              {/* Body */}
              <div className="mt-16 flex flex-col items-center flex-1 justify-center">
                <div className="font-bold text-lg text-gray-900 mb-3 text-center">{member.name}</div>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold
                  ${idx === 0 ? "bg-indigo-600 text-white" : ""}
                  ${idx === 1 ? "bg-blue-700 text-white" : ""}
                  ${idx === 2 ? "bg-cyan-600 text-white" : ""}
                  ${idx === 3 ? "bg-green-700 text-white" : ""}
                `}>
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Get in touch</h3>
        <p className="text-base text-gray-700 font-medium mb-3">
          Curious to learn more, partner, or request a feature?
        </p>
        <p>
          <a href="mailto:strategy-team@example.com" className="text-blue-600 hover:underline font-medium">
            strategy-team@example.com
          </a>
        </p>
        <p className="mt-2">
          <a
            href="https://linkedin.com/company/aicontentstrategy"
            className="text-blue-500 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect on LinkedIn
          </a>
        </p>
      </section>
    </div>
  );
}
