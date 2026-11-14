import { UseGlob } from "../../Context/GlobalContext";

const StorysetSignupIllustration = () => {
  const { dark } = UseGlob();

  const primary = dark ? "#7895C5" : "#202C50";
  const primaryLight = dark ? "rgba(120, 149, 197, 0.22)" : "rgba(32, 44, 80, 0.12)";
  const surface = dark ? "#202A40" : "#FFFFFF";
  const screenBg = dark ? "#171E30" : "#F7F9FC";
  const border = dark ? "#35435C" : "#D8E1EF";
  const textMuted = dark ? "#8190AA" : "#8A96AA";
  const accentGold = "#F59E0B";
  const accentGreen = "#10B981";

  return (
    <div className="relative w-full max-w-[190px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[440px] aspect-square flex items-center justify-center select-none">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <style>{`
            @keyframes signup-float-y {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes signup-float-reverse {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(10px) rotate(4deg); }
            }
            @keyframes signup-pulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.08); opacity: 1; }
            }
            @keyframes signup-shadow {
              0%, 100% { transform: scaleX(1); opacity: 0.5; }
              50% { transform: scaleX(0.85); opacity: 0.25; }
            }
            @keyframes signup-spark {
              0%, 100% { opacity: 0.3; transform: scale(0.7); }
              50% { opacity: 1; transform: scale(1.2); }
            }

            .anim-float {
              animation: signup-float-y 4s ease-in-out infinite;
            }
            .anim-float-delayed {
              animation: signup-float-reverse 4.5s ease-in-out infinite 0.7s;
            }
            .anim-pulse {
              animation: signup-pulse 3s ease-in-out infinite;
            }
            .anim-shadow {
              transform-origin: 250px 455px;
              animation: signup-shadow 4s ease-in-out infinite;
            }
            .anim-spark-1 {
              transform-origin: 90px 110px;
              animation: signup-spark 2.5s ease-in-out infinite;
            }
            .anim-spark-2 {
              transform-origin: 415px 130px;
              animation: signup-spark 3s ease-in-out infinite 1s;
            }
            .anim-spark-3 {
              transform-origin: 425px 390px;
              animation: signup-spark 2.8s ease-in-out infinite 0.5s;
            }
            .anim-gift {
              transform-origin: 395px 230px;
              animation: signup-float-y 3.6s ease-in-out infinite;
            }
            .anim-shield {
              transform-origin: 105px 230px;
              animation: signup-float-reverse 4.2s ease-in-out infinite;
            }
          `}</style>

          <radialGradient id="signupAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primary} stopOpacity={dark ? "0.22" : "0.15"} />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </radialGradient>

          <filter id="signupDeviceShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor={dark ? "#000" : "#253B35"} floodOpacity={dark ? "0.4" : "0.1"} />
          </filter>

          <linearGradient id="signupPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={dark ? "#C5DED0" : "#1A2B26"} />
          </linearGradient>

          <linearGradient id="giftGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ambient Glow Aura */}
        <circle cx="250" cy="240" r="220" fill="url(#signupAmbient)" />

        {/* Sparkles / Stars (Pulsing Infinite) */}
        <g className="anim-spark-1">
          <path d="M90 95 L94 106 L105 110 L94 114 L90 125 L86 114 L75 110 L86 106 Z" fill={accentGold} />
        </g>
        <g className="anim-spark-2">
          <path d="M415 115 L418 125 L428 128 L418 131 L415 141 L412 131 L402 128 L412 125 Z" fill={primary} />
        </g>
        <g className="anim-spark-3">
          <path d="M425 380 L428 388 L436 391 L428 394 L425 402 L422 394 L414 391 L422 388 Z" fill={accentGold} />
        </g>

        {/* Ground Floor Breathing Shadow */}
        <ellipse cx="250" cy="455" rx="190" ry="14" fill={dark ? "#0E1412" : "#DDE8E1"} className="anim-shadow" />

        {/* MAIN DEVICE / REGISTRATION PORTAL SCREEN */}
        <g filter="url(#signupDeviceShadow)">
          {/* Phone / Tablet Frame */}
          <rect
            x="135"
            y="65"
            width="230"
            height="370"
            rx="32"
            fill={surface}
            stroke={border}
            strokeWidth="3.5"
          />

          {/* Screen Display */}
          <rect
            x="147"
            y="85"
            width="206"
            height="330"
            rx="22"
            fill={screenBg}
          />

          {/* Notch Bar */}
          <rect x="220" y="73" width="60" height="5" rx="2.5" fill={border} />
          <circle cx="205" cy="75.5" r="3" fill={border} />

          {/* User Plus Avatar Circle */}
          <circle cx="250" cy="135" r="26" fill={primaryLight} stroke={primary} strokeWidth="2.5" />
          <circle cx="250" cy="129" r="9" fill={primary} />
          <path d="M236 151 C236 142 242 140 250 140 C258 140 264 142 264 151" fill={primary} />
          {/* Green Plus Badge on Avatar */}
          <circle cx="268" cy="148" r="7" fill={accentGreen} />
          <path d="M268 144 V152 M264 148 H272" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

          {/* Header Lines */}
          <rect x="200" y="172" width="100" height="8" rx="4" fill={primary} opacity="0.8" />
          <rect x="215" y="185" width="70" height="5" rx="2.5" fill={textMuted} opacity="0.6" />

          {/* Input 1: Name Box */}
          <rect
            x="167"
            y="204"
            width="166"
            height="30"
            rx="8"
            fill={surface}
            stroke={border}
            strokeWidth="1.5"
          />
          <circle cx="182" cy="219" r="4.5" stroke={primary} strokeWidth="1.5" fill="none" />
          <rect x="195" y="217" width="55" height="4" rx="2" fill={textMuted} opacity="0.4" />

          {/* Input 2: Email Box */}
          <rect
            x="167"
            y="242"
            width="166"
            height="30"
            rx="8"
            fill={surface}
            stroke={border}
            strokeWidth="1.5"
          />
          <rect x="176" y="251" width="13" height="10" rx="2" stroke={primary} strokeWidth="1.5" fill="none" />
          <path d="M176 253 L182.5 257 L189 253" stroke={primary} strokeWidth="1.5" fill="none" />
          <rect x="196" y="255" width="65" height="4" rx="2" fill={textMuted} opacity="0.4" />

          {/* Input 3: Password Box */}
          <rect
            x="167"
            y="280"
            width="166"
            height="30"
            rx="8"
            fill={surface}
            stroke={border}
            strokeWidth="1.5"
          />
          <rect x="177" y="291" width="11" height="9" rx="2" stroke={primary} strokeWidth="1.5" fill="none" />
          <circle cx="199" cy="295" r="2.5" fill={primary} />
          <circle cx="208" cy="295" r="2.5" fill={primary} />
          <circle cx="217" cy="295" r="2.5" fill={primary} />
          <circle cx="226" cy="295" r="2.5" fill={primary} />
          <circle cx="235" cy="295" r="2.5" fill={primary} />

          {/* Sign Up Submit Button on Screen */}
          <rect
            x="167"
            y="322"
            width="166"
            height="36"
            rx="10"
            fill="url(#signupPrimaryGrad)"
          />
          <text
            x="250"
            y="345"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="bold"
            letterSpacing="1.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            CREATE ACCOUNT
          </text>

          {/* Bottom Screen Pill */}
          <rect x="220" y="400" width="60" height="4" rx="2" fill={border} />
        </g>

        {/* CHARACTER (Storyset Style Character standing beside screen) */}
        <g className="anim-float">
          {/* Feet Shadow */}
          <ellipse cx="120" cy="445" rx="30" ry="7" fill={dark ? "#0B0F19" : "#CBD5E1"} opacity="0.6" />

          {/* Legs */}
          <path d="M125 365 L130 435 L144 437 C144 441 138 444 126 444 L121 440 L118 365 Z" fill={dark ? "#35413B" : "#171D1B"} />
          <path d="M105 365 L108 433 L118 435 C118 439 112 442 102 442 L97 438 L99 365 Z" fill={dark ? "#35413B" : "#171D1B"} />
          {/* Shoes */}
          <path d="M120 438 L146 438 C148 438 149 441 147 443 C144 445 136 446 122 445 Z" fill={surface} stroke={border} strokeWidth="1.5" />
          <path d="M96 436 L120 436 C122 436 123 439 121 441 C118 443 110 444 98 443 Z" fill={surface} stroke={border} strokeWidth="1.5" />

          {/* Torso / Jacket */}
          <path
            d="M92 245 C92 235 138 235 138 245 L134 370 C134 372 96 372 96 370 Z"
            fill={primary}
          />
          {/* Inner Shirt */}
          <path d="M108 245 L115 295 L122 245 Z" fill={surface} />

          {/* Head & Neck */}
          <rect x="110" y="222" width="10" height="15" fill="#FDBA74" />
          <circle cx="115" cy="208" r="18" fill="#FDBA74" />
          <path
            d="M97 205 C97 190 120 185 130 190 C135 193 135 204 133 210 C130 205 125 205 120 205 C115 205 105 200 100 208 Z"
            fill={dark ? "#EAF2EC" : "#171D1B"}
          />

          {/* Arms */}
          <path d="M94 248 L82 315 L90 320 L100 255 Z" fill={primary} />
          <circle cx="85" cy="324" r="6.5" fill="#FDBA74" />

          {/* Right Arm pointing up / waving */}
          <path d="M136 250 L168 288 L160 295 L130 262 Z" fill={primary} />
          <circle cx="172" cy="292" r="7" fill="#FDBA74" />
        </g>

        {/* FLOATING ELEMENT 1: Welcome Gift Box (Infinite Float) */}
        <g className="anim-gift">
          <circle cx="395" cy="230" r="30" fill={accentGold} opacity="0.12" />
          <rect x="375" y="215" width="40" height="34" rx="8" fill="url(#giftGoldGrad)" stroke="#B45309" strokeWidth="1.2" />
          {/* Gift Lid */}
          <rect x="371" y="209" width="48" height="9" rx="4" fill="url(#giftGoldGrad)" stroke="#B45309" strokeWidth="1.2" />
          {/* Ribbon */}
          <rect x="391" y="209" width="8" height="40" fill="#FFFFFF" opacity="0.8" />
          {/* Ribbon Bow */}
          <path d="M388 205 C384 200 395 197 395 205 C395 197 406 200 402 205 Z" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* FLOATING ELEMENT 2: Verified Shield Badge (Infinite Float Reverse) */}
        <g className="anim-shield">
          <circle cx="100" cy="130" r="30" fill={primary} opacity="0.12" />
          <rect
            x="76"
            y="106"
            width="48"
            height="48"
            rx="16"
            fill={surface}
            stroke={border}
            strokeWidth="2"
            filter="url(#signupDeviceShadow)"
          />
          <path
            d="M100 119 L112 123.5 C112 133.5 105.5 140 100 142 C94.5 140 88 133.5 88 123.5 Z"
            stroke={accentGreen}
            strokeWidth="2"
            fill={accentGreen}
            fillOpacity="0.15"
          />
          <path
            d="M95 130.5 L98.5 134 L105.5 127"
            stroke={accentGreen}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* FLOATING ELEMENT 3: User Plus Badge Top Right */}
        <g className="anim-float-delayed">
          <rect
            x="360"
            y="95"
            width="46"
            height="46"
            rx="14"
            fill={surface}
            stroke={border}
            strokeWidth="2"
            filter="url(#signupDeviceShadow)"
          />
          <circle cx="380" cy="115" r="6" fill={primary} />
          <path d="M371 129 C371 124 375 122 380 122 C385 122 389 124 389 129" fill={primary} />
          <circle cx="392" cy="120" r="5" fill={accentGold} />
          <path d="M392 117 V123 M389 120 H395" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default StorysetSignupIllustration;
