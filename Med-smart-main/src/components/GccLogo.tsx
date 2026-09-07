import React from 'react';

interface GccLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

const GccLogo: React.FC<GccLogoProps> = ({ className = '', size = '100%', showText = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ width: size, height: 'auto' }}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-lg"
      >
        <defs>
          {/* Metallic/Silver Gradients for the 3D box faces */}
          <linearGradient id="topFaceGcc" x1="100" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e9f0" />
          </linearGradient>

          <linearGradient id="leftFaceGcc" x1="20" y1="80" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#d1d9e6" />
            <stop offset="100%" stopColor="#b4c2d3" />
          </linearGradient>

          <linearGradient id="rightFaceGcc" x1="100" y1="80" x2="180" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#c0cbd9" />
            <stop offset="100%" stopColor="#9ba8ba" />
          </linearGradient>

          {/* Deep shadow for internal hollow gaps that creates the "C" and "G" letter 3D look */}
          <linearGradient id="innerHollowShadow" x1="100" y1="70" x2="100" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0c294a" />
            <stop offset="100%" stopColor="#05172b" />
          </linearGradient>

          {/* Golden/Silver highlight gradient */}
          <linearGradient id="edgeGleam" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
          </linearGradient>

          {/* Main Royal Blue Circular Shield Background */}
          <linearGradient id="shieldBg" x1="100" y1="5" x2="100" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a59b5" />
            <stop offset="50%" stopColor="#0b52a8" />
            <stop offset="100%" stopColor="#063e82" />
          </linearGradient>
        </defs>

        {/* 1. Outer Circular Blue Shield */}
        <circle cx="100" cy="100" r="95" fill="url(#shieldBg)" stroke="#ffffff" strokeWidth="1.5" />

        {/* 2. Stylized 3D Isometric Logo Structure (representing letters G - C - C combined inside a box) */}
        {/* We have mathematically computed isometric coordinates for perfect angles (30 degrees) */}
        <g transform="translate(0, 4)">
          {/* Inner dark depth of the block */}
          <polygon
            points="100,28 162,64 162,136 100,172 38,136 38,64"
            fill="url(#innerHollowShadow)"
          />

          {/* Top segment: The "G" face in isometric flat layer */}
          {/* Formed by drawing the horizontal top ring with a gap on the right and an entry prong inward */}
          <path
            d="M 100 28 L 162 64 L 140 76.7 L 100 53.5 L 60 76.7 L 38 64 Z"
            fill="url(#topFaceGcc)"
          />
          {/* The prong arm of the G going inwards */}
          <path
            d="M 162 64 L 162 82 L 138 96 L 138 78 Z"
            fill="url(#rightFaceGcc)"
          />
          <path
            d="M 138 78 L 100 100 L 100 87 L 122 74 M 100 87 L 100 100 L 60 76.7 L 72 70 Z"
            fill="url(#topFaceGcc)"
          />

          {/* Left Block Side (Letter C 3D curve) */}
          {/* Top thick bar, back column, bottom thick bar */}
          <path
            d="M 38 64 L 100 100 L 100 114 L 38 78 Z"
            fill="url(#leftFaceGcc)"
          />
          <path
            d="M 38 64 L 38 136 L 56 125.5 L 56 74.5 Z"
            fill="url(#leftFaceGcc)"
          />
          <path
            d="M 38 136 L 100 172 L 100 158 L 38 122 Z"
            fill="url(#leftFaceGcc)"
          />

          {/* Right Block Side (Letter C 3D curve reversed) */}
          <path
            d="M 162 64 L 100 100 L 100 114 L 162 78 Z"
            fill="url(#rightFaceGcc)"
          />
          <path
            d="M 162 64 L 162 136 L 144 125.5 L 144 74.5 Z"
            fill="url(#rightFaceGcc)"
          />
          <path
            d="M 162 136 L 100 172 L 100 158 L 162 122 Z"
            fill="url(#rightFaceGcc)"
          />

          {/* Additional 3D inner faces/depths of the letters */}
          {/* Left-inner lip */}
          <polygon
            points="56,74.5 100,100 100,105 56,79.5"
            fill="#8fa3bd"
          />
          {/* Right-inner lip */}
          <polygon
            points="144,74.5 100,100 100,105 144,79.5"
            fill="#6d7f99"
          />
          {/* Bottom-inner left base depth */}
          <polygon
            points="56,125.5 100,151 100,156 56,130.5"
            fill="#a6b7cc"
          />
          {/* Bottom-inner right base depth */}
          <polygon
            points="144,125.5 100,151 100,156 144,130.5"
            fill="#8093ad"
          />

          {/* Core pillar inside to hold the structure */}
          <polygon
            points="100,100 100,154 94,151 94,103"
            fill="#d1dbe8"
          />
          <polygon
            points="100,100 100,154 106,151 106,103"
            fill="#aabccc"
          />

          {/* Inner lines highlight contours to emphasize high-tech 3D design */}
          <polyline
            points="100,28 38,64 100,100 162,64 100,28"
            stroke="url(#edgeGleam)"
            strokeWidth="0.75"
            fill="none"
          />
          <polyline
            points="38,136 100,172 162,136"
            stroke="url(#edgeGleam)"
            strokeWidth="1"
            fill="none"
          />
        </g>
      </svg>

      {showText && (
        <div className="mt-4 text-center select-none pointer-events-none">
          <span className="block font-black text-blue-900 tracking-wide text-lg sm:text-xl font-sans">
            شركة جي سي سي للمقاولات
          </span>
          <span className="block font-medium text-slate-500 text-[10px] sm:text-xs tracking-[0.15em] font-mono mt-0.5">
            GCC COMPANY FOR CONTRACTING
          </span>
        </div>
      )}
    </div>
  );
};

export default GccLogo;
