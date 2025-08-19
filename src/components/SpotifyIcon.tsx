import React from 'react';

const SpotifyIcon: React.FC = () => {
  return (
    <div className="w-[46px] h-[46px] relative">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<svg id=\"813:22512\" width=\"47\" height=\"46\" viewBox=\"0 0 47 46\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"spotify-circle\" style=\"width: 46px; height: 45px; position: absolute; left: 0; top: 0; fill: #000\"> <path d=\"M23.5 45.5C36.2025 45.5 46.5 35.4264 46.5 23C46.5 10.5736 36.2025 0.5 23.5 0.5C10.7975 0.5 0.5 10.5736 0.5 23C0.5 35.4264 10.7975 45.5 23.5 45.5Z\" fill=\"black\"></path> </svg>",
          }}
        />
      </div>
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/8e0b54025c985885b9c3530c49226d80d01829dc?width=92"
        alt="Spotify logo"
        className="w-[46px] h-[46px] absolute left-0 top-0"
      />
    </div>
  );
};

export default SpotifyIcon;
