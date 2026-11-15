
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";

const slides = [
  {
    eyebrow: "MADE FOR EVERYDAY",
    title: "Thoughtful pieces for a warmer home.",
    description: "Explore useful favourites for your home and daily life.",
    image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85",
    alt: "Warm modern living room",
  },
  {
    eyebrow: "THE EVERYDAY COLLECTION",
    title: "Small details. Better days.",
    description: "Find simple pieces that make daily routines feel special.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    alt: "Comfortable contemporary home",
  },
  {
    eyebrow: "FIND YOUR FAVOURITES",
    title: "Make room for things you love.",
    description: "Browse the latest pieces selected for your everyday life.",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1400&q=85",
    alt: "Bright, thoughtfully decorated interior",
  },
  {
    eyebrow: "SLOW MORNINGS",
    title: "Start every day at your own pace.",
    description: "Discover essentials designed to bring calm to your morning routine.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
    alt: "Sunlit minimalist bedroom with soft linens",
  },
  {
    eyebrow: "NATURAL TEXTURES",
    title: "Crafted for comfort and longevity.",
    description: "Bring warmth indoors with organic materials and timeless finishes.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
    alt: "Wooden lounge chair with textured throw",
  },
  {
    eyebrow: "GATHER & DINE",
    title: "Designed for shared moments.",
    description: "Elevate casual meals and weekend dinners with understated tableware.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85",
    alt: "Warm wooden dining table set for a meal",
  },
  {
    eyebrow: "QUIET CORNERS",
    title: "Create a space just for you.",
    description: "Soft lighting and cozy accents for reading, resting, and unwinding.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
    alt: "Cozy reading nook with warm lamp light",
  },
  {
    eyebrow: "ORGANIZED LIVING",
    title: "Clutter-free spaces, clearer minds.",
    description: "Smart storage solutions that blend seamlessly into your decor.",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1400&q=85",
    alt: "Clean, organized shelving with ceramic decor",
  },
  {
    eyebrow: "SEASONAL REFRESH",
    title: "Lighter layers for brighter days.",
    description: "Update your living space with breathable fabrics and soft tones.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
    alt: "Airy living area with neutral tones and indoor plants",
  },
  {
    eyebrow: "TIMELESS DESIGN",
    title: "Built to stay, made to love.",
    description: "Invest in versatile staples that grow better with every year.",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
    alt: "Classic modern interior with warm wood accents",
  },
];

const PromoCarousel = () => {
  const { dark } = UseGlob();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Theme colors
  const mainText = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const mutedText = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const primaryButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const indicatorActive = dark ? "bg-[#7895C5]" : "bg-[#344F82]";

  const indicatorInactive = dark
    ? "bg-[#35435C] hover:bg-[#465570]"
    : "bg-[#D8E1EF] hover:bg-[#B7C9E5]";

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 45) {
      showNext();
    } else if (distance < -45) {
      showPrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      aria-label="Featured promotional banners"
      className="mx-auto max-w-7xl px-3 pt-3 pb-2 sm:px-6 sm:pt-5 sm:pb-3"
    >
      {/* Main Banner Card */}
      <div
        className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 sm:rounded-3xl ${
          dark
            ? "border-[#35435C] bg-[#202A40]"
            : "border-[#D8E1EF] bg-[#FFFFFF]"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated Slide Track */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <article
              key={slide.title}
              className="grid min-w-full grid-cols-1 items-stretch overflow-hidden md:h-[310px] md:grid-cols-2 lg:h-[330px]"
            >
              {/* Text Side */}
              <div className="order-2 flex flex-col justify-center gap-2 px-5 py-5 sm:gap-2.5 sm:px-8 sm:py-6 md:order-1 md:px-10 lg:px-12">
                {/* Eyebrow Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors sm:text-[11px] ${
                      dark
                        ? "border-[#7895C5]/30 bg-[#7895C5]/15 text-[#7895C5]"
                        : "border-[#344F82]/20 bg-[#344F82]/10 text-[#344F82]"
                    }`}
                  >
                    <Sparkles size={11} className="animate-pulse" />
                    <span>{slide.eyebrow}</span>
                  </span>
                </div>

                {/* Main Headline */}
                <h2
                  className={`line-clamp-2 text-lg font-extrabold leading-snug tracking-tight transition-colors sm:text-xl md:text-2xl lg:text-3xl ${mainText}`}
                >
                  {slide.title}
                </h2>

                {/* Description */}
                <p
                  className={`line-clamp-2 max-w-lg text-xs transition-colors sm:text-sm ${mutedText}`}
                >
                  {slide.description}
                </p>

                {/* Shop Button */}
                <div className="pt-1.5 sm:pt-2">
                  <Link
                    to="/shop"
                    className={`group/btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 sm:text-sm ${primaryButton}`}
                  >
                    <span>Shop Collection</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative order-1 h-44 w-full overflow-hidden sm:h-52 md:order-2 md:h-full">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Previous Arrow */}
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous promo slide"
          className={`absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-95 sm:flex sm:h-10 sm:w-10 ${
            dark
              ? "border-[#35435C] bg-[#202A40]/85 text-[#EAF0FA] hover:border-[#7895C5] hover:bg-[#202A40]"
              : "border-[#D8E1EF] bg-white/85 text-[#202C50] hover:border-[#344F82] hover:bg-white"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={showNext}
          aria-label="Next promo slide"
          className={`absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-95 sm:flex sm:h-10 sm:w-10 ${
            dark
              ? "border-[#35435C] bg-[#202A40]/85 text-[#EAF0FA] hover:border-[#7895C5] hover:bg-[#202A40]"
              : "border-[#D8E1EF] bg-white/85 text-[#202C50] hover:border-[#344F82] hover:bg-white"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="mt-3 flex items-center justify-between px-1">
        {/* Slide Counter */}
        <span
          className={`text-[11px] font-semibold tracking-wider ${mutedText}`}
        >
          Slide{" "}
          <span className={`font-bold ${accentText}`}>
            {activeIndex + 1 < 10
              ? `0${activeIndex + 1}`
              : activeIndex + 1}
          </span>{" "}
          / {slides.length < 10 ? `0${slides.length}` : slides.length}
        </span>

        {/* Indicator Pills */}
        <div className="flex items-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? `w-6 ${indicatorActive}`
                  : `w-1.5 ${indicatorInactive}`
              }`}
            />
          ))}
        </div>

        {/* Mobile Next Button */}
        <button
          type="button"
          onClick={showNext}
          className={`text-[11px] font-bold transition-colors sm:hidden ${accentText}`}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default PromoCarousel;
