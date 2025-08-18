import React from 'react';

const Footer = () => {
  const companyLinks = [
    { label: 'About', href: '#about' },
    { label: 'Jobs', href: '#jobs' },
    { label: 'For the record', href: '#record' },
  ];

  const communityLinks = [
    { label: 'For Artists', href: '#artists' },
    { label: 'Developers', href: '#developers' },
    { label: 'Advertising', href: '#advertising' },
    { label: 'Investors', href: '#investors' },
    { label: 'Vendors', href: '#vendors' },
  ];

  const usefulLinks = [
    { label: 'Support', href: '#support' },
    { label: 'Web Player', href: '#web-player' },
    { label: 'Free Mobile App', href: '#mobile-app' },
  ];

  return (
    <footer className="bg-[rgba(18,18,18,1)] flex min-h-[487px] w-full flex-col items-center justify-center mt-[191px] px-2.5 py-[104px] max-md:max-w-full max-md:mt-10 max-md:pb-[100px]">
      <div className="flex w-[1344px] max-w-full gap-[40px_100px] justify-between flex-wrap">
        <img
          src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/83099d7d05c878480fcc6c2e375526e518037144?placeholderIfAbsent=true"
          alt="AsraMusic Logo"
          className="aspect-[4.46] object-contain w-[161px] shrink-0"
        />
        
        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">Company</h4>
          <nav>
            <ul className="space-y-8">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-[#F6C874] transition-colors"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">Community</h4>
          <nav>
            <ul className="space-y-8">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-[#F6C874] transition-colors"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="text-base text-white font-bold tracking-[0.13px] leading-none w-[135px]">
          <h4 className="text-[rgba(204,204,204,1)] mb-8">Useful Links</h4>
          <nav>
            <ul className="space-y-8">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-[#F6C874] transition-colors"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex min-w-60 flex-col items-stretch w-[278px]">
          <div className="flex items-center gap-4 mb-3.5">
            <button
              className="self-stretch flex w-14 shrink-0 h-14 gap-2.5 bg-[#121212] my-auto rounded-[50px] hover:bg-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212]"
              aria-label="Social media link 1"
            />
            <button
              className="justify-center items-center self-stretch flex min-h-14 flex-col overflow-hidden w-14 h-14 bg-[#121212] my-auto px-0.5 rounded-[50px] hover:bg-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212]"
              aria-label="Twitter/X social media link"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/4212e7282c4a8428ab3c73f613b039ec2249cff9?placeholderIfAbsent=true"
                alt="Twitter/X icon"
                className="aspect-[1.23] object-contain w-[31px] fill-white"
              />
            </button>
            <button
              className="self-stretch flex w-14 shrink-0 h-14 gap-2.5 bg-[#121212] my-auto rounded-[50px] hover:bg-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212]"
              aria-label="Social media link 3"
            />
          </div>
          
          <div className="flex gap-2.5">
            <a href="#app-store" aria-label="Download from App Store">
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/e31ccb7066e64a27a7cbfa183960fcb5791da114?placeholderIfAbsent=true"
                alt="Download on App Store"
                className="aspect-[3.44] object-contain w-[134px] shrink-0 rounded-md hover:opacity-80 transition-opacity"
              />
            </a>
            <a href="#google-play" aria-label="Download from Google Play">
              <img
                src="https://api.builder.io/api/v1/image/assets/e4fe701087e74a95b6a29ed12c1bd7bc/963e7ad2396dcc3cf3f719aca69e1dfe2b36f109?placeholderIfAbsent=true"
                alt="Get it on Google Play"
                className="aspect-[3.44] object-contain w-[134px] shrink-0 rounded-md hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
