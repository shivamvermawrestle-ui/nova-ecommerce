import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";

const slides = [
  {
    eyebrow: "MADE FOR EVERYDAY",
    title: "Thoughtful pieces for a warmer home.",
    description: "Explore useful favourites for your home and daily life.",
    image:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85",
    alt: "Warm modern living room",
  },
  {
    eyebrow: "THE EVERYDAY COLLECTION",
    title: "Small details. Better days.",
    description: "Find simple pieces that make daily routines feel special.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    alt: "Comfortable contemporary home",
  },
  {
    eyebrow: "FIND YOUR FAVOURITES",
    title: "Make room for things you love.",
    description: "Browse the latest pieces selected for your everyday life.",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1400&q=85",
    alt: "Bright, thoughtfully decorated interior",
  },
  {
    eyebrow: "SLOW MORNINGS",
    title: "Start every day at your own pace.",
    description: "Discover essentials designed to bring calm to your morning routine.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
    alt: "Sunlit minimalist bedroom with soft linens",
  },
  {
    eyebrow: "NATURAL TEXTURES",
    title: "Crafted for comfort and longevity.",
    description: "Bring warmth indoors with organic materials and timeless finishes.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
    alt: "Wooden lounge chair with textured throw",
  },
  {
    eyebrow: "GATHER & DINE",
    title: "Designed for shared moments.",
    description: "Elevate casual meals and weekend dinners with understated tableware.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85",
    alt: "Warm wooden dining table set for a meal",
  },
  {
    eyebrow: "QUIET CORNERS",
    title: "Create a space just for you.",
    description: "Soft lighting and cozy accents for reading, resting, and unwinding.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
    alt: "Cozy reading nook with warm lamp light",
  },
  {
    eyebrow: "ORGANIZED LIVING",
    title: "Clutter-free spaces, clearer minds.",
    description: "Smart storage solutions that blend seamlessly into your decor.",
    image:
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1400&q=85",
    alt: "Clean, organized shelving with ceramic decor",
  },
  {
    eyebrow: "SEASONAL REFRESH",
    title: "Lighter layers for brighter days.",
    description: "Update your living space with breathable fabrics and soft tones.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
    alt: "Airy living area with neutral tones and indoor plants",
  },
  {
    eyebrow: "TIMELESS DESIGN",
    title: "Built to stay, made to love.",
    description: "Invest in versatile staples that grow better with every year.",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
    alt: "Classic modern interior with warm wood accents",
  },
];

const PromoCarousel = () => {
  const { dark } = UseGlob();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture support for smooth mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
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
      className="mx-auto max-w-7xl px-3 sm:px-6 pt-3 pb-2 sm:pt-5 sm:pb-3"
    >
      {/* Main Medium-Sized Banner Card */}
      <div
        className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-sm transition-all duration-300 ${
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
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <article
              key={slide.title}
              className="grid min-w-full grid-cols-1 md:grid-cols-2 md:h-[310px] lg:h-[330px] items-stretch overflow-hidden"
            >
              {/* Text Side (order-2 on mobile so image is hero on top) */}
              <div className="order-2 md:order-1 flex flex-col justify-center px-5 py-5 sm:px-8 sm:py-6 md:px-10 lg:px-12 gap-2 sm:gap-2.5">
                {/* Eyebrow Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${
                      dark
                        ? "bg-[#7895C5]/15 text-[#7895C5] border border-[#7895C5]/30"
                        : "bg-[#202C50]/10 text-[#202C50] border border-[#202C50]/20"
                    }`}
                  >
                    <Sparkles size={11} className="animate-pulse" />
                    <span>{slide.eyebrow}</span>
                  </span>
                </div>

                {/* Main Headline */}
                <h2
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug line-clamp-2 transition-colors ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  {slide.title}
                </h2>

                {/* Subtitle / Description */}
                <p
                  className={`text-xs sm:text-sm line-clamp-2 max-w-lg transition-colors ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  {slide.description}
                </p>

                {/* Call To Action Button */}
                <div className="pt-1.5 sm:pt-2">
                  <Link
                    to="/shop"
                    className={`group/btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 active:scale-95 ${
                      dark
                        ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                        : "bg-[#202C50] text-white hover:bg-[#344F82]"
                    }`}
                  >
                    <span>Shop Collection</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

              {/* Image Side (100% Full Cover, Crisp & NO White Overlay) */}
              <div className="order-1 md:order-2 h-44 sm:h-52 md:h-full w-full overflow-hidden relative">
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

        {/* Desktop / Tablet Navigation Arrows */}
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous promo slide"
          className={`hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-95 ${
            dark
              ? "border-[#35435C] bg-[#202A40]/85 text-[#EAF0FA] hover:bg-[#202A40] hover:border-[#7895C5]"
              : "border-[#D8E1EF] bg-white/85 text-[#202C50] hover:bg-white hover:border-[#202C50]"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Next promo slide"
          className={`hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all active:scale-95 ${
            dark
              ? "border-[#35435C] bg-[#202A40]/85 text-[#EAF0FA] hover:bg-[#202A40] hover:border-[#7895C5]"
              : "border-[#D8E1EF] bg-white/85 text-[#202C50] hover:bg-white hover:border-[#202C50]"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Modern Bottom Controls: Indicator Pills & Counter */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span
          className={`text-[11px] font-semibold tracking-wider ${
            dark ? "text-[#AAB8D0]" : "text-[#64718A]"
          }`}
        >
          Slide{" "}
          <span
            className={`font-bold ${
              dark ? "text-[#7895C5]" : "text-[#202C50]"
            }`}
          >
            {activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1}
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
                  ? "w-6 bg-[#202C50] dark:bg-[#7895C5]"
                  : dark
                  ? "w-1.5 bg-[#35435C] hover:bg-[#465570]"
                  : "w-1.5 bg-[#D8E1EF] hover:bg-[#B7C9E5]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={showNext}
          className={`text-[11px] font-bold sm:hidden transition-colors ${
            dark ? "text-[#7895C5]" : "text-[#202C50]"
          }`}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default PromoCarousel;
