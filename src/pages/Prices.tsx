import React from 'react';

const Prices = () => {
  return (
    <div className="min-h-screen bg-[#2A2626] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center">Pricing Plans</h1>
          <p className="text-xl text-center text-gray-300 mb-12">
            Choose the perfect plan for your music career
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Starter Plan */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700 hover:border-[#F6C874] transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-[#F6C874]">Starter</h3>
              <div className="text-4xl font-bold mb-6">
                $9.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Up to 10 songs
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Standard support
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Social media integration
                </li>
              </ul>
              <button className="w-full bg-[#F6C874] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#E5B763] transition-colors">
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-[#F6C874] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#F6C874] text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#F6C874]">Professional</h3>
              <div className="text-4xl font-bold mb-6">
                $24.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Unlimited songs
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Custom branding
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Fan engagement tools
                </li>
              </ul>
              <button className="w-full bg-[#F6C874] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#E5B763] transition-colors">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700 hover:border-[#F6C874] transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-[#F6C874]">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">
                $49.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Everything in Professional
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  White-label solution
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <span className="text-[#F6C874] mr-2">✓</span>
                  API access
                </li>
              </ul>
              <button className="w-full bg-[#F6C874] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#E5B763] transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 italic">
              This is a placeholder page. The full pricing system will be implemented soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices;
