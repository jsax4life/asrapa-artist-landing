import React from 'react';

const MusicPlayerPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-[13px] relative max-sm:items-center">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/55d7387821efe9ce973e81cdaa0b60e06d867ccc?width=777"
        alt="Music player top interface"
        className="w-[389px] h-[54px] rotate-[7.378deg] shadow-[0_4px_40px_0_rgba(255,255,255,0.25)] max-sm:w-[280px] max-sm:h-[39px]"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/647de7cec8202bbd015c7cdc13473322b45f2085?width=853"
        alt="Music player main interface"
        className="w-[426px] h-[82px] shadow-[0_4.738px_29.613px_0_rgba(196,5,5,0.12)] max-sm:w-[307px] max-sm:h-[59px]"
      />
    </div>
  );
};

export default MusicPlayerPreview;
