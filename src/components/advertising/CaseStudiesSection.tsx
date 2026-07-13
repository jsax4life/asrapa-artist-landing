import React from 'react';

const caseStudies = [
  {
    title: 'Smile to the beat of your favorite music.',
    description:
      'Colgate partnered with AsrapaMusic to launch a campaign that connected oral care with the joy of music. By placing audio ads during morning playlist sessions, Colgate reached health-conscious listeners and saw a 34% increase in brand recall among 18–34 year-olds.',
    image: 'https://images.unsplash.com/photo-1620916560348-5933a3490aec?w=600&q=80',
    imageAlt: 'Colgate Supreme toothpaste product',
  },
  {
    title: 'Coca-Cola: The perfect soundtrack for your music journey',
    description:
      'Coca-Cola leveraged AsrapaMusic\'s in-feed and full-screen ad formats to promote its "Share a Coke" campaign. Targeting listeners during social and party playlists, the brand achieved a 28% lift in purchase intent and over 2 million ad impressions in the first month.',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80',
    imageAlt: 'Coca-Cola glass with ice',
  },
];

const CaseStudiesSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Case studies</h2>

      <div className="flex flex-col gap-20">
        {caseStudies.map((study, index) => (
          <article
            key={study.title}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                {study.title}
              </h3>
              <p className="text-[#D2D8DA] text-base leading-relaxed">{study.description}</p>
            </div>
            <div className="flex-1 w-full max-w-md">
              <img
                src={study.image}
                alt={study.imageAlt}
                className="w-full h-64 md:h-72 object-cover rounded-lg"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
