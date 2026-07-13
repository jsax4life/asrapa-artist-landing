import React from 'react';
import UserAvatars from './UserAvatars';
import DownloadButtons from './DownloadButtons';
import MusicPlayerPreview from './MusicPlayerPreview';
import musicImage from '@/assets/images/music.png';


const AboutHeroSection: React.FC = () => {
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-[#131313]">
    <div className="relative h-[80vh] min-h-[500px] w-full">
    <img
      src={musicImage}
      alt="Music background"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-4">
          <span className="text-white">Discover a world of Music with </span>
          <span className="text-red-500">AsrapaMusic</span>
        </h1>
      </div>
    </div>
  </div>
    <section className="w-full h-[821px] relative flex items-center justify-between box-border bg-[#131313] px-[110px] py-0 max-md:h-auto max-md:flex-col max-md:gap-[60px] max-md:px-10 max-md:py-[60px] max-sm:gap-10 max-sm:px-5 max-sm:py-10">
      <div className="flex items-start gap-[81px] w-full max-w-[1292px] relative z-[2] max-md:flex-col max-md:gap-[60px] max-md:w-full max-md:max-w-none max-sm:gap-10">
        <article className="flex flex-col items-start gap-[34px] w-[702px] max-md:w-full max-md:max-w-[600px] max-md:items-center max-md:text-center">
          <header>
            <h1 className="text-white text-5xl font-bold leading-[52px] m-0 max-md:text-4xl max-md:leading-10 max-sm:text-[28px] max-sm:leading-8">
              Welcome to Asrapa Music,
            </h1>
          </header>
          <p className="w-[702px] text-white text-[28px] font-bold leading-8 m-0 max-md:w-full max-md:text-[22px] max-md:leading-7 max-sm:text-lg max-sm:leading-6">
            Where music comes alive. Experience a universe of endless tunes,
            handpicked playlists, and personalized recommendations just for
            you.
          </p>
          <div className="flex items-start gap-4 max-sm:flex-col max-sm:gap-3 max-sm:items-center">
            <UserAvatars />
            <div className="text-white text-base font-normal leading-5 tracking-[0.16px] m-0">
              517.69 million+
              <br />
              AsrapaMusic users worldwide
            </div>
          </div>
          <DownloadButtons />
        </article>
        <aside className="flex flex-col items-start gap-[13px] relative max-sm:items-center">
          <MusicPlayerPreview />
        </aside>
      </div>
      <div className="absolute right-0 top-0 w-[680px] h-[817px] z-[1] pointer-events-none">
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<svg id=\"1521:18603\" layer-name=\"Home — All Hands — Right hand\" width=\"680\" height=\"817\" viewBox=\"0 0 680 817\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"hand-background\" style=\"position: absolute; right: 0; top: 0; width: 680px; height: 817px; z-index: 1\"> <g clip-path=\"url(#clip0_1521_18603)\"> <path d=\"M982.133 -137.607H-628.277V936.13H982.133V-137.607Z\" fill=\"url(#pattern0_1521_18603)\"></path> <mask id=\"mask0_1521_18603\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"144\" y=\"69\" width=\"282\" height=\"566\"> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M196.134 69.17C178.784 68.5327 164.201 82.0698 163.549 99.4167L144.807 596.318C144.193 612.568 156.849 626.246 173.099 626.895L371.011 634.782C387.19 635.427 400.864 622.9 401.639 606.725L425.453 109.418C426.29 91.9301 412.687 77.1242 395.191 76.4818L312.111 73.43L369.053 75.5378C365.923 75.8216 365.361 78.159 365.283 80.3643C365.027 87.2199 359.849 95.2323 349.033 94.832L294.226 92.8332L240.7 90.8217C229.884 90.4211 225.315 82.0482 225.567 75.1926C225.649 73.0305 225.276 70.7073 222.343 70.1325L196.134 69.17Z\" fill=\"#FF0000\"></path> </mask> <g mask=\"url(#mask0_1521_18603)\"> <path d=\"M164.738 68.0156L426.98 77.6482L400.244 635.945L143.703 625.722L164.738 68.0156Z\" fill=\"url(#pattern1_1521_18603)\"></path> <path d=\"M163.553 99.4167C164.205 82.0698 178.792 68.5327 196.138 69.17L395.195 76.4818C412.69 77.1242 426.294 91.9301 425.457 109.418L401.643 606.725C400.868 622.9 387.194 635.427 371.015 634.782L173.103 626.895C156.853 626.246 144.197 612.568 144.81 596.318L163.553 99.4167Z\" fill=\"url(#paint0_linear_1521_18603)\" fill-opacity=\"0.05\"></path> <path d=\"M163.553 99.4167C164.205 82.0698 178.792 68.5327 196.138 69.17L395.195 76.4818C412.69 77.1242 426.294 91.9301 425.457 109.418L401.643 606.725C400.868 622.9 387.194 635.427 371.015 634.782L173.103 626.895C156.853 626.246 144.197 612.568 144.81 596.318L163.553 99.4167Z\" fill=\"url(#paint1_linear_1521_18603)\" fill-opacity=\"0.2\"></path> </g> </g> <defs> <pattern id=\"pattern0_1521_18603\" patternContentUnits=\"objectBoundingBox\" width=\"1\" height=\"1\"> <use xlink:href=\"#image0_1521_18603\" transform=\"scale(0.000244141 0.000366166)\"></use> </pattern> <pattern id=\"pattern1_1521_18603\" patternContentUnits=\"objectBoundingBox\" width=\"1\" height=\"1\"> <use xlink:href=\"#image1_1521_18603\" transform=\"scale(0.00138889 0.000692762)\"></use> </pattern> <linearGradient id=\"paint0_linear_1521_18603\" x1=\"285.34\" y1=\"68.0165\" x2=\"285.438\" y2=\"727.553\" gradientUnits=\"userSpaceOnUse\"> <stop stop-color=\"#060808\" stop-opacity=\"0\"></stop> <stop offset=\"1\" stop-color=\"#07090A\"></stop> </linearGradient> <linearGradient id=\"paint1_linear_1521_18603\" x1=\"285.34\" y1=\"68.0165\" x2=\"285.34\" y2=\"635.946\" gradientUnits=\"userSpaceOnUse\"> <stop stop-color=\"white\"></stop> <stop offset=\"1\" stop-color=\"white\" stop-opacity=\"0\"></stop> </linearGradient> <clipPath id=\"clip0_1521_18603\"> <rect width=\"680\" height=\"817\" fill=\"white\"></rect> </clipPath>   </defs> </svg>",
          }}
        />
      </div>
    </section>
    </div>
  );
};

export default AboutHeroSection;
