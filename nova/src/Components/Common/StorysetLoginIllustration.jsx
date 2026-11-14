import { UseGlob } from "../../Context/GlobalContext";

const StorysetLoginIllustration = () => {
  const { dark } = UseGlob();

  const primary = dark ? "#7895C5" : "#202C50";
  const primaryHover = dark ? "#9BB2D8" : "#344F82";
  const primaryLight = dark ? "rgba(120, 149, 197, 0.22)" : "rgba(32, 44, 80, 0.12)";
  const surface = dark ? "#202A40" : "#FFFFFF";
  const screenBg = dark ? "#171E30" : "#F7F9FC";
  const border = dark ? "#35435C" : "#D8E1EF";
  const textMuted = dark ? "#8190AA" : "#8A96AA";
  const accentGold = "#F59E0B";
  const accentGreen = "#10B981";

  return (
    <div className="relative w-full max-w-[210px] sm:max-w-[290px] md:max-w-[370px] lg:max-w-[460px] aspect-[5/4] sm:aspect-square flex items-center justify-center select-none">
      <svg
        viewBox="0 0 540 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <style>{`
            @keyframes cuate-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes cuate-float-reverse {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(9px) rotate(4deg); }
            }
            @keyframes cuate-lock-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes cuate-shadow {
              0%, 100% { transform: scaleX(1); opacity: 0.5; }
              50% { transform: scaleX(0.88); opacity: 0.25; }
            }
            @keyframes cuate-sparkle {
              0%, 100% { opacity: 0.25; transform: scale(0.7); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            @keyframes cuate-key-bob {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-14px) rotate(6deg); }
            }

            .anim-cuate-char {
              animation: cuate-float 4.2s ease-in-out infinite;
            }
            .anim-cuate-key {
              transform-origin: 395px 190px;
              animation: cuate-key-bob 3.6s ease-in-out infinite;
            }
            .anim-cuate-shield {
              transform-origin: 85px 180px;
              animation: cuate-float-reverse 4.5s ease-in-out infinite;
            }
            .anim-cuate-lock {
              transform-origin: 270px 210px;
              animation: cuate-lock-pulse 3.8s ease-in-out infinite;
            }
            .anim-cuate-shadow {
              transform-origin: 270px 425px;
              animation: cuate-shadow 4.2s ease-in-out infinite;
            }
            .anim-cuate-sparkle-1 {
              transform-origin: 65px 100px;
              animation: cuate-sparkle 2.6s ease-in-out infinite;
            }
            .anim-cuate-sparkle-2 {
              transform-origin: 470px 105px;
              animation: cuate-sparkle 3.2s ease-in-out infinite 0.8s;
            }
            .anim-cuate-sparkle-3 {
              transform-origin: 460px 360px;
              animation: cuate-sparkle 2.9s ease-in-out infinite 0.4s;
            }
          `}</style>

          {/* Ambient Background Radial Glow */}
          <radialGradient id="cuateAmbientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primary} stopOpacity={dark ? "0.2" : "0.14"} />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </radialGradient>

          {/* Golden Key Gradient */}
          <linearGradient id="cuateGoldKey" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Primary Button Gradient */}
          <linearGradient id="cuatePrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={primaryHover} />
          </linearGradient>

          {/* Tablet Drop Shadow Filter */}
          <filter id="cuateTabletShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor={dark ? "#000000" : "#253B35"} floodOpacity={dark ? "0.45" : "0.1"} />
          </filter>
        </defs>

        {/* Ambient Glow */}
        <circle cx="270" cy="220" r="230" fill="url(#cuateAmbientGlow)" />

        {/* Animated Sparkles / Twinkles */}
        <g className="anim-cuate-sparkle-1">
          <path d="M65 88 L68 98 L78 101 L68 104 L65 114 L62 104 L52 101 L62 98 Z" fill={accentGold} />
        </g>
        <g className="anim-cuate-sparkle-2">
          <path d="M470 95 L473 103 L482 106 L473 109 L470 117 L467 109 L458 106 L467 103 Z" fill={primary} />
        </g>
        <g className="anim-cuate-sparkle-3">
          <path d="M460 350 L463 357 L471 360 L463 363 L460 370 L457 363 L449 360 L457 357 Z" fill={accentGold} />
        </g>

        {/* Ground Floor Shadow */}
        <ellipse cx="270" cy="425" rx="220" ry="15" fill={dark ? "#0E1412" : "#DDE8E1"} className="anim-cuate-shadow" />

        {/* 1. TABLET STAND (Cuate Tablet Stand Base) */}
        <path d="M220 395 L245 425 H295 L320 395 Z" fill={dark ? "#1E293B" : "#CBD5E1"} />
        <ellipse cx="270" cy="426" rx="60" ry="6" fill={dark ? "#0F172A" : "#94A3B8"} />

        {/* 2. MAIN HORIZONTAL TABLET (Cuate Tablet Frame & Screen) */}
        <g filter="url(#cuateTabletShadow)">
          {/* Outer Tablet Frame */}
          <rect
            x="115"
            y="95"
            width="310"
            height="295"
            rx="28"
            fill={surface}
            stroke={border}
            strokeWidth="4"
          />

          {/* Inner Tablet Display Screen */}
          <rect
            x="130"
            y="112"
            width="280"
            height="260"
            rx="18"
            fill={screenBg}
          />

          {/* Top Tablet Camera / Sensor */}
          <circle cx="270" cy="103" r="3.5" fill={border} />

          {/* Tablet Screen UI: Top Header Icon */}
          <circle cx="270" cy="155" r="24" fill={primaryLight} stroke={primary} strokeWidth="2.5" />
          {/* User Lock Silhouette */}
          <circle cx="270" cy="149" r="8" fill={primary} />
          <path d="M256 170 C256 161 262 159 270 159 C278 159 284 161 284 170" fill={primary} />

          {/* Login Headline Bars */}
          <rect x="220" y="188" width="100" height="7" rx="3.5" fill={primary} opacity="0.85" />
          <rect x="235" y="200" width="70" height="4" rx="2" fill={textMuted} opacity="0.6" />

          {/* Input Box 1: Email */}
          <rect
            x="170"
            y="218"
            width="200"
            height="32"
            rx="9"
            fill={surface}
            stroke={border}
            strokeWidth="1.5"
          />
          {/* Email Icon */}
          <rect x="182" y="228" width="14" height="11" rx="2" stroke={primary} strokeWidth="1.5" fill="none" />
          <path d="M182 230 L189 235 L196 230" stroke={primary} strokeWidth="1.5" fill="none" />
          <rect x="204" y="231" width="75" height="5" rx="2.5" fill={textMuted} opacity="0.4" />

          {/* Input Box 2: Password */}
          <rect
            x="170"
            y="258"
            width="200"
            height="32"
            rx="9"
            fill={surface}
            stroke={border}
            strokeWidth="1.5"
          />
          {/* Lock Icon */}
          <rect x="183" y="270" width="11" height="9" rx="2" stroke={primary} strokeWidth="1.5" fill="none" />
          <path d="M185 270 V267 C185 265 186.5 263.5 188.5 263.5 C190.5 263.5 192 265 192 267 V270" stroke={primary} strokeWidth="1.5" fill="none" />
          {/* Password dots */}
          <circle cx="206" cy="274" r="3" fill={primary} />
          <circle cx="216" cy="274" r="3" fill={primary} />
          <circle cx="226" cy="274" r="3" fill={primary} />
          <circle cx="236" cy="274" r="3" fill={primary} />
          <circle cx="246" cy="274" r="3" fill={primary} />

          {/* Primary Action Button (LOG IN) */}
          <rect
            x="170"
            y="302"
            width="200"
            height="36"
            rx="10"
            fill="url(#cuatePrimaryGrad)"
          />
          <text
            x="270"
            y="325"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="1.8"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            LOG IN
          </text>

          {/* Bottom Screen Home Indicator */}
          <rect x="240" y="360" width="60" height="3.5" rx="1.75" fill={border} />
        </g>

        {/* 3. BIG SECURITY PADLOCK (In front of tablet, pulse animated) */}
        <g className="anim-cuate-lock">
          <g filter="url(#cuateTabletShadow)">
            {/* Shackle */}
            <path
              d="M252 238 V222 C252 212 260 204 270 204 C280 204 288 212 288 222 V238"
              stroke="url(#cuateGoldKey)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Padlock Body */}
            <rect
              x="242"
              y="234"
              width="56"
              height="44"
              rx="12"
              fill="url(#cuateGoldKey)"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            {/* Keyhole */}
            <circle cx="270" cy="252" r="4.5" fill="#78350F" />
            <path d="M268.5 254 L267 266 H273 L271.5 254 Z" fill="#78350F" />
          </g>
        </g>

        {/* 4. CUATE CHARACTER (Young modern character leaning on tablet with big shoes) */}
        <g className="anim-cuate-char">
          {/* Feet Shadow */}
          <ellipse cx="90" cy="425" rx="36" ry="8" fill={dark ? "#0B0F19" : "#CBD5E1"} opacity="0.6" />

          {/* Legs & Big Cuate Sneakers */}
          {/* Back Leg */}
          <path d="M102 335 L106 412 L116 414 C116 418 108 421 98 421 L93 417 L96 335 Z" fill={dark ? "#35413B" : "#171D1B"} />
          {/* Front Leg (Crossed casual stance) */}
          <path d="M78 335 L88 410 L104 413 C104 417 96 422 84 422 L75 416 L72 335 Z" fill={dark ? "#35413B" : "#171D1B"} />

          {/* Distinctive Cuate Shoes / Oversized Sneakers */}
          <path d="M96 415 L124 415 C126 415 128 418 126 421 C122 424 112 425 96 424 Z" fill={surface} stroke={border} strokeWidth="1.8" />
          <path d="M74 413 L106 413 C109 413 111 416 109 419 C104 423 94 424 74 423 Z" fill={surface} stroke={border} strokeWidth="1.8" />
          <rect x="78" y="418" width="24" height="2" fill={primary} />
          <rect x="100" y="420" width="20" height="2" fill={primary} />

          {/* Torso / Jacket */}
          <path
            d="M62 235 C62 225 110 225 110 235 L106 345 C106 348 66 348 66 345 Z"
            fill={primary}
          />
          {/* Inner T-shirt */}
          <path d="M78 235 L86 285 L94 235 Z" fill={surface} />

          {/* Neck & Head */}
          <rect x="81" y="215" width="10" height="15" fill="#FDBA74" />
          <circle cx="86" cy="200" r="18" fill="#FDBA74" />
          {/* Modern Cuate Hairstyle */}
          <path
            d="M68 198 C68 180 92 175 102 180 C108 183 108 195 106 202 C102 196 96 196 91 196 C86 196 75 192 70 200 Z"
            fill={dark ? "#EAF2EC" : "#171D1B"}
          />

          {/* Left Arm (Resting on side) */}
          <path d="M64 238 L50 300 L58 305 L70 245 Z" fill={primary} />
          <circle cx="53" cy="308" r="6.5" fill="#FDBA74" />

          {/* Right Arm (Reaching up holding the key or tablet) */}
          <path d="M106 240 L138 275 L130 282 L98 250 Z" fill={primary} />
          <circle cx="140" cy="278" r="7" fill="#FDBA74" />
        </g>

        {/* 5. FLOATING GOLDEN SECURITY KEY (Cuate Style Floating Key) */}
        <g className="anim-cuate-key">
          <circle cx="415" cy="190" r="32" fill={accentGold} opacity="0.14" />
          {/* Key Ring */}
          <circle cx="400" cy="180" r="18" fill="url(#cuateGoldKey)" stroke="#B45309" strokeWidth="1.8" />
          <circle cx="400" cy="180" r="8" fill={surface} stroke="#B45309" strokeWidth="1.5" />
          {/* Key Shaft */}
          <rect x="414" y="176" width="34" height="8" rx="2" fill="url(#cuateGoldKey)" stroke="#B45309" strokeWidth="1.5" />
          {/* Key Teeth */}
          <rect x="434" y="183" width="6" height="10" rx="1.8" fill="url(#cuateGoldKey)" stroke="#B45309" strokeWidth="1.2" />
          <rect x="443" y="183" width="5" height="7" rx="1.8" fill="url(#cuateGoldKey)" stroke="#B45309" strokeWidth="1.2" />
        </g>

        {/* 6. FLOATING VERIFIED SHIELD BADGE (Top Left) */}
        <g className="anim-cuate-shield">
          <circle cx="85" cy="130" r="28" fill={primary} opacity="0.12" />
          <rect
            x="62"
            y="107"
            width="46"
            height="46"
            rx="15"
            fill={surface}
            stroke={border}
            strokeWidth="2"
            filter="url(#cuateTabletShadow)"
          />
          {/* Shield */}
          <path
            d="M85 119 L97 123.5 C97 133.5 90.5 140 85 142 C79.5 140 73 133.5 73 123.5 Z"
            stroke={accentGreen}
            strokeWidth="2"
            fill={accentGreen}
            fillOpacity="0.15"
          />
          {/* Checkmark */}
          <path
            d="M80 130.5 L83.5 134 L90.5 127"
            stroke={accentGreen}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default StorysetLoginIllustration;