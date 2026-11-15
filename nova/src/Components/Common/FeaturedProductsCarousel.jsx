import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import ProductCard from "../Product/ProductCard";
import { useGetFeaturedProductsQuery } from "../../services/productsApi";
import ProductCardSkeleton from "../Product/ProductCardSkeleton";
import { UseGlob } from "../../Context/GlobalContext";

const PRODUCTS_PER_SLIDE = 4;

const FeaturedProductsCarousel = () => {
  const { dark } = UseGlob();

  const {
    data: featuredProducts = [],
    isLoading,
    isError,
    refetch,
  } = useGetFeaturedProductsQuery();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const inStockFeaturedProducts = featuredProducts.filter(
    (product) => Number(product.stock ?? 0) > 0
  );

  const slides = [];

  for (
    let index = 0;
    index < inStockFeaturedProducts.length;
    index += PRODUCTS_PER_SLIDE
  ) {
    slides.push(
      inStockFeaturedProducts.slice(index, index + PRODUCTS_PER_SLIDE)
    );
  }

  // Smooth auto-slide every 4.5 seconds, pauses on mouse hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const moveSlide = (direction) => {
    if (slides.length <= 1) return;

    setActiveSlide(
      (current) => (current + direction + slides.length) % slides.length
    );
  };

  const visibleSlide = slides.length ? activeSlide % slides.length : 0;

  return (
    <section
      aria-label="Featured products"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {/* Eyebrow Badge */}
          <div
            className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
              dark
                ? "border-[#7895C5]/30 bg-[#26334D] text-[#7895C5]"
                : "border-[#202C50]/20 bg-[#DFE7F3] text-[#344F82]"
            }`}
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>Handpicked For You</span>
          </div>

          <h2
            className={`text-2xl font-extrabold tracking-tight transition-colors sm:text-3xl ${
              dark ? "text-[#EAF0FA]" : "text-[#202C50]"
            }`}
          >
            Featured Products
          </h2>

          <p
            className={`mt-1 text-xs transition-colors sm:text-sm ${
              dark ? "text-[#AAB8D0]" : "text-[#64718A]"
            }`}
          >
            Explore top-rated picks curated just for you
          </p>
        </div>

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span
              className={`text-xs font-semibold tracking-wider ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              <span
                className={`font-bold ${
                  dark ? "text-[#7895C5]" : "text-[#344F82]"
                }`}
              >
                0{visibleSlide + 1}
              </span>{" "}
              / 0{slides.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveSlide(-1)}
                aria-label="Previous featured products"
                className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-xs transition-all duration-200 active:scale-95 ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:border-[#7895C5] hover:text-[#7895C5]"
                    : "border-[#D8E1EF] bg-white text-[#202C50] hover:border-[#344F82] hover:bg-[#F7F9FC] hover:text-[#344F82]"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => moveSlide(1)}
                aria-label="Next featured products"
                className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-xs transition-all duration-200 active:scale-95 ${
                  dark
                    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:border-[#7895C5] hover:text-[#7895C5]"
                    : "border-[#D8E1EF] bg-white text-[#202C50] hover:border-[#344F82] hover:bg-[#F7F9FC] hover:text-[#344F82]"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div
          className={`rounded-2xl border p-8 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA]"
              : "border-[#D8E1EF] bg-white text-[#202C50]"
          }`}
        >
          <p className="text-sm font-medium text-[#C04452] dark:text-[#F08089]">
            Could not load featured products.
          </p>

          <button
            type="button"
            onClick={refetch}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#202C50] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8]"
          >
            <RefreshCw size={14} />
            <span>Try again</span>
          </button>
        </div>
      ) : slides.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#AAB8D0]"
              : "border-[#D8E1EF] bg-white text-[#64718A]"
          }`}
        >
          No featured products available right now.
        </div>
      ) : (
        <>
          {/* Carousel Slider Viewport */}
          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${visibleSlide * 100}%)`,
              }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid min-w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                >
                  {slide.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicator Pills */}
          {slides.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to featured slide ${index + 1}`}
                  aria-pressed={visibleSlide === index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    visibleSlide === index
                      ? "w-8 bg-[#344F82] dark:bg-[#7895C5]"
                      : dark
                      ? "w-2.5 bg-[#35435C] hover:bg-[#465570]"
                      : "w-2.5 bg-[#D8E1EF] hover:bg-[#B7C9E5]"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FeaturedProductsCarousel;