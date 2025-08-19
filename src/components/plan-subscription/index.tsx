import React from 'react';
import { FeatureCard } from './FeatureCard';
import { PricingCard } from './PricingCard';
import { PaymentIcons } from './PaymentIcons';

const Index = () => {
  const featureCards = [
    {
      icon: `<svg id="813:22521" width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon" style="width: 124px; height: 124px; border-radius: 62px; background: #121212; box-shadow: 0 6px 25px 0 rgba(196, 5, 5, 0.08)"> <g filter="url(#filter0_d_813_22521)"> <rect x="25" y="19" width="124" height="124" rx="62" fill="#121212"></rect> <path d="M61.272 52.7264L115.272 106.726C115.975 107.429 115.975 108.569 115.272 109.272C114.569 109.975 113.429 109.975 112.726 109.272L108.163 104.708C106.74 105.651 105.033 106.199 103.199 106.199H70.7992C65.8287 106.199 61.7992 102.17 61.7992 97.1992V64.7992C61.7992 62.9649 62.348 61.2587 63.2903 59.8359L58.7264 55.272C58.0235 54.5691 58.0235 53.4294 58.7264 52.7264C59.4294 52.0235 60.5691 52.0235 61.272 52.7264ZM103.944 100.489L90.5992 87.1448V89.9992C90.5992 90.9932 89.7932 91.7992 88.7992 91.7992H74.3992C73.4051 91.7992 72.5992 90.9932 72.5992 89.9992V75.5992C72.5992 74.6051 73.4051 73.7992 74.3992 73.7992H77.2536L73.6536 70.1992H67.1992V96.2992C67.1992 98.7847 69.2139 100.799 71.6992 100.799H102.299C102.88 100.799 103.434 100.689 103.944 100.489ZM80.8536 77.3992H76.1992V88.1992H86.9992V83.5448L80.8536 77.3992ZM106.799 93.1625V70.1992H83.8361L69.5255 55.8887C69.9416 55.8297 70.3668 55.7992 70.7992 55.7992H103.199C108.17 55.7992 112.199 59.8287 112.199 64.7992V97.1992C112.199 97.6316 112.169 98.0567 112.11 98.4729L106.799 93.1625Z" fill="white"></path> </g> <defs> <filter id="filter0_d_813_22521" x="0" y="0" width="174" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset dy="6"></feOffset> <feGaussianBlur stdDeviation="12.5"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.768627 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_22521"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_22521" result="shape"></feBlend> </filter> </defs> </svg>`,
      title: "Ad-free music listening",
      description: "Enjoy uninterrupted music"
    },
    {
      icon: `<svg id="813:22527" width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon" style="width: 124px; height: 124px; border-radius: 62px; background: #121212; box-shadow: 0 6px 25px 0 rgba(196, 5, 5, 0.08)"> <g filter="url(#filter0_d_813_22527)"> <rect x="25" y="19" width="124" height="124" rx="62" fill="#121212"></rect> <path d="M87.0195 99.9004C89.5048 99.9004 91.5195 97.8857 91.5195 95.4004C91.5195 92.9151 89.5048 90.9004 87.0195 90.9004C84.5342 90.9004 82.5195 92.9151 82.5195 95.4004C82.5195 97.8857 84.5342 99.9004 87.0195 99.9004Z" fill="white"></path> <path d="M110.72 98.4004L113.12 96.0004C114.32 94.8004 114.32 93.0004 113.12 91.8004C111.92 90.6004 110.12 90.6004 108.92 91.8004L106.52 94.2004L104.12 91.8004C102.92 90.6004 101.12 90.6004 99.9195 91.8004C98.7195 93.0004 98.7195 94.8004 99.9195 96.0004L102.32 98.4004L99.9195 100.8C98.7195 102 98.7195 103.8 99.9195 105C100.52 105.6 101.42 105.9 102.02 105.9C102.62 105.9 103.52 105.6 104.12 105L106.52 102.6L108.92 105C109.52 105.6 110.42 105.9 111.02 105.9C111.62 105.9 112.52 105.6 113.12 105C114.32 103.8 114.32 102 113.12 100.8L110.72 98.4004Z" fill="white"></path> <path d="M87.0164 79.5C82.8164 79.5 78.9164 81.3 76.2164 84.3C75.0164 85.5 75.0164 87.3 76.2164 88.5C77.4164 89.7 79.2164 89.7 80.4164 88.5C84.0164 84.6 90.0164 84.6 93.3164 88.5C93.9164 89.1 94.8164 89.4 95.4164 89.4C96.0164 89.4 96.9164 89.1 97.5164 88.5C98.7164 87.3 98.7164 85.5 97.5164 84.3C95.1164 81.3 91.2164 79.5 87.0164 79.5Z" fill="white"></path> <path d="M101.417 79.4988C102.017 80.0988 102.617 80.3988 103.517 80.3988C104.417 80.3988 105.017 80.0988 105.617 79.4988C106.817 78.2988 106.817 76.4988 105.617 75.2988C100.517 70.4988 93.9172 67.7988 87.3172 67.7988C80.7172 67.7988 73.8172 70.4988 69.0172 75.2988C67.8172 76.4988 67.8172 78.2988 69.0172 79.4988C70.2172 80.6988 72.0172 80.6988 73.2172 79.4988C77.1172 75.5988 82.2172 73.4988 87.6172 73.4988C93.0172 73.4988 97.2172 75.5988 101.417 79.4988Z" fill="white"></path> <path d="M108.918 70.4996C109.518 71.0996 110.118 71.3996 111.018 71.3996C111.918 71.3996 112.518 71.0996 113.118 70.4996C114.318 69.2996 114.018 67.4996 112.818 66.2996C105.618 59.6996 96.3181 56.0996 86.7181 56.0996C77.1181 56.0996 68.4181 59.3996 60.9181 65.9996C59.7181 67.1996 59.7181 68.9996 60.6181 70.1996C61.8181 71.3996 63.6181 71.3996 64.8181 70.4996C71.4181 64.7996 78.9181 61.7996 87.0181 61.7996C95.1181 61.7996 102.618 64.7996 108.918 70.4996Z" fill="white"></path> </g> <defs> <filter id="filter0_d_813_22527" x="0" y="0" width="174" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset dy="6"></feOffset> <feGaussianBlur stdDeviation="12.5"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.768627 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_22527"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_22527" result="shape"></feBlend> </filter> </defs> </svg>`,
      title: "Offline playback",
      description: "Save your data by listening offline"
    },
    {
      icon: `<svg id="813:22539" layer-name="Layer_1" width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon" style="width: 124px; height: 124px; border-radius: 62px; background: #121212; box-shadow: 0 6px 25px 0 rgba(196, 5, 5, 0.08)"> <g filter="url(#filter0_d_813_22539)"> <rect x="25" y="19" width="124" height="124" rx="62" fill="#121212"></rect> <path d="M67.2078 98.1418C63.2422 98.1418 60.0078 101.362 60.0078 105.314C60.0078 109.265 63.2422 112.486 67.2078 112.486H72.4391C74.5906 112.486 76.5031 111.529 77.825 110.039C77.8391 110.025 77.8672 110.025 77.8813 110.011C77.9656 109.926 78.0219 109.8 78.0922 109.715C78.275 109.49 78.4438 109.265 78.5844 109.012C79.9203 107.015 80.5531 104.386 80.5531 102.375C80.5531 100.012 80.5531 74.6293 80.5531 74.6293C80.5531 74.5449 80.5531 74.4746 80.5531 74.3902C80.5531 74.3199 80.5531 74.2355 80.5531 74.1652C80.6656 72.1684 82.1281 70.5512 84.0828 70.1012C84.3219 70.0449 84.8422 69.9324 84.8422 69.9324L105.922 65.9387C106.02 65.9246 106.105 65.9105 106.203 65.8965C106.316 65.8824 106.414 65.8824 106.541 65.8824C108.242 65.8824 109.508 67.2184 109.508 68.8637C109.508 68.8637 109.508 83.7418 109.508 87.3418C109.508 90.9277 109.916 91.8277 103.812 91.8277H100.986C97.0062 91.8277 93.7859 95.048 93.7859 98.9996C93.7859 102.951 97.0062 106.171 100.986 106.171H106.217C108.777 106.171 111.012 104.85 112.292 102.853C112.292 102.839 112.306 102.853 112.32 102.853C113.586 101.137 113.994 98.5496 113.994 95.0762C113.994 91.5887 113.994 52.4949 113.994 52.4949C113.994 50.8496 112.602 49.5137 110.9 49.5137C110.802 49.5137 110.703 49.5277 110.619 49.5277L110.183 49.598L79.5969 55.3918C77.6562 55.9121 75.8984 57.7684 75.7578 59.8074C75.7578 59.8215 75.7578 59.8215 75.7578 59.8355C75.7578 59.8496 75.7578 59.8496 75.7578 59.8637C75.7578 59.8637 75.7578 93.0793 75.7578 95.034C75.7578 96.9887 76.0391 98.1559 69.05 98.1559H67.2078V98.1418Z" fill="white"></path> </g> <defs> <filter id="filter0_d_813_22539" x="0" y="0" width="174" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset dy="6"></feOffset> <feGaussianBlur stdDeviation="12.5"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.768627 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_22539"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_22539" result="shape"></feBlend> </filter> </defs> </svg>`,
      title: "Play everywhere",
      description: "Listen on your speakers, TV and other favorite devices"
    },
    {
      icon: `<svg id="813:22545" layer-name="Stock_cut" width="174" height="174" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon" style="width: 124px; height: 124px; border-radius: 62px; background: #121212; box-shadow: 0 6px 25px 0 rgba(196, 5, 5, 0.08)"> <g filter="url(#filter0_d_813_22545)"> <rect x="25" y="19" width="124" height="124" rx="62" fill="#121212"></rect> <path d="M104.185 44.1875H69.8122C68.5836 44.1875 67.4053 44.6756 66.5365 45.5443C65.6678 46.4131 65.1797 47.5914 65.1797 48.82V113.181C65.1797 114.409 65.6678 115.588 66.5365 116.456C67.4053 117.325 68.5836 117.813 69.8122 117.813H104.185C105.414 117.813 106.592 117.325 107.461 116.456C108.33 115.588 108.818 114.409 108.818 113.181V48.82C108.818 47.5914 108.33 46.4131 107.461 45.5443C106.592 44.6756 105.414 44.1875 104.185 44.1875ZM105.729 113.181C105.729 113.59 105.567 113.983 105.277 114.273C104.988 114.562 104.595 114.725 104.185 114.725H69.8122C69.4026 114.725 69.0099 114.562 68.7203 114.273C68.4307 113.983 68.268 113.59 68.268 113.181V48.82C68.268 48.4104 68.4307 48.0177 68.7203 47.7281C69.0099 47.4385 69.4026 47.2758 69.8122 47.2758H104.185C104.595 47.2758 104.988 47.4385 105.277 47.7281C105.567 48.0177 105.729 48.4104 105.729 48.82V113.181Z" fill="white"></path> <path d="M88.8056 106.787H85.1613C84.7518 106.787 84.359 106.95 84.0695 107.239C83.7799 107.529 83.6172 107.922 83.6172 108.331C83.6172 108.741 83.7799 109.134 84.0695 109.423C84.359 109.713 84.7518 109.875 85.1613 109.875H88.8056C89.2151 109.875 89.6079 109.713 89.8975 109.423C90.187 109.134 90.3497 108.741 90.3497 108.331C90.3497 107.922 90.187 107.529 89.8975 107.239C89.6079 106.95 89.2151 106.787 88.8056 106.787Z" fill="white"></path> <path d="M80.1797 82.2237V78.1702H82.4777C84.7167 78.1702 86.0719 77.3502 86.5433 75.7103H80.1797V73.3544L82.7958 73.1466H86.508C86.2723 72.4305 85.8127 71.934 85.1292 71.6568C84.4457 71.3796 83.5618 71.241 82.4777 71.241H80.1797V67.1875H94.1797V69.7513H89.513C90.6443 70.5366 91.3632 71.6683 91.6696 73.1466H94.1797V75.7103H91.7049C91.54 77.1193 91.0804 78.2972 90.3262 79.2442C89.5719 80.1681 88.641 80.8725 87.5332 81.3576L93.5787 89.1875H87.7453L82.6898 82.2237H80.1797Z" fill="white"></path> </g> <defs> <filter id="filter0_d_813_22545" x="0" y="0" width="174" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset dy="6"></feOffset> <feGaussianBlur stdDeviation="12.5"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0.768627 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_22545"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_22545" result="shape"></feBlend> </filter> </defs> </svg>`,
      title: "Pay your way",
      description: "Prepay with Patm, UPI, and more."
    }
  ];

  const premiumFeatures = [
    { text: "Unlimited skips" },
    { text: "High-quality audio streaming" },
    { text: "Access to our full music library" },
    { text: "Offline listening" },
    { text: "Exclusive content" }
  ];

  const familyFeatures = [
    { text: "Ad-free streaming" },
    { text: "Unlimited skips" },
    { text: "High-quality audio streaming" },
    { text: "Access to our full music library" },
    { text: "Offline listening" },
    { text: "Personalized recommendations" },
    { text: "Create and save playlists" },
    { text: "Exclusive content" }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center gap-24  px-[84px] py-24 max-md:gap-[60px] max-md:px-10 max-md:py-[60px] max-sm:gap-10 max-sm:px-5 max-sm:py-10">
      <div className="flex flex-col items-center gap-24 w-full max-w-[1344px]">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-6 w-full max-w-[1116px]">
          <h1 className="text-white text-center text-7xl font-bold leading-[82.8px] tracking-[0.72px] max-md:text-5xl max-md:leading-[57.6px] max-sm:text-[32px] max-sm:leading-10">
            Enhance Your Music Journey with Premium
          </h1>
          <p className="text-[#CCC] text-center text-xl font-bold leading-[30px] max-md:text-lg max-sm:text-base">
            Upgrade to Asra Music Premium and take your music journey to the
            next level. Enjoy uninterrupted music playback, even in offline
            mode. Say goodbye to those pesky ads, and indulge in high-quality
            audio for a truly immersive experience.
          </p>
        </section>

        {/* Features Section */}
        <section className="flex items-start gap-6 w-full justify-center max-md:flex-wrap max-md:gap-10 max-md:justify-center max-sm:flex-col max-sm:gap-8 max-sm:items-center max-sm:justify-center max-sm:min-h-screen max-sm:flex-col max-sm:justify-center max-sm:items-center">
          {featureCards.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>
      </div>

      {/* Pricing Section */}
      <section className="flex flex-col items-center  w-full max-w-[1116px]">
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="text-white text-center text-7xl font-bold leading-[82.8px] tracking-[0.72px] max-md:text-5xl max-md:leading-[57.6px] max-sm:text-[32px] max-sm:leading-10">
            Pick Your Premium
          </h2>
          <p className="text-[#CCC] text-center text-base font-bold leading-6 max-sm:text-base">
            Upgrade to Asra Music Premium and take your music journey to the
            next level. Enjoy uninterrupted music playback, even in offline mode
          </p>
          <PaymentIcons />
        </div>

        {/* Pricing Cards */}
        <div className="flex items-start gap-[18px] w-full justify-center max-md:flex-col max-md:items-center max-md:gap-6">
          <PricingCard
            title="Premium"
            price="From 3500/month"
            description="1 account on mobile only"
            features={premiumFeatures}
            backgroundColor="bg-[#EB5640]"
            textColor="text-white"
            priceColor="text-[#C40505]"
            badge="One-time plan available"
            badgeTextColor="text-[#131313]"
            badgeBorderColor="border-[#131313]"
            dividerColor="stroke-white"
            termsColor="text-black"
          />
          
          <PricingCard
            title="Family"
            price="From 3500/month"
            description="Up to six accounts"
            features={familyFeatures}
            backgroundColor="bg-[#D5F479]"
            textColor="text-[#131313]"
            priceColor="text-[#EB5640]"
            badge="One-time plan available"
            badgeTextColor="text-black"
            badgeBorderColor="border-black"
            dividerColor="stroke-black"
            termsColor="text-black"
          />
        </div>
      </section>
    </main>
  );
};

export default Index;
