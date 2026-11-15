import { UseGlob } from "../../Context/GlobalContext";

const ProductCardSkeleton = () => {
  const { dark } = UseGlob();

  const cardStyle = dark
    ? "border-[#35435C] bg-[#202A40]"
    : "border-[#D8E1EF] bg-white";

  const imageBackground = dark ? "bg-[#171E30]" : "bg-[#F7F9FC]";

  const skeletonColor = dark ? "bg-[#35435C]" : "bg-[#D8E1EF]";

  const badgeStyle = dark
    ? "border-[#35435C] bg-[#202A40]"
    : "border-[#D8E1EF] bg-white";

  return (
    <div
      className={`flex h-full flex-col justify-between overflow-hidden rounded-2xl border shadow-sm animate-pulse ${cardStyle}`}
    >
      {/* Image Area Skeleton */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-t-2xl ${imageBackground}`}
      >
        <div
          className={`h-full w-full rounded-t-2xl ${
            dark ? "bg-[#202A40]/80" : "bg-[#D8E1EF]/70"
          }`}
        />

        {/* Top-left Category Badge Skeleton */}
        <div
          className={`absolute left-2 top-2 h-4 w-12 rounded-full border shadow-sm sm:left-3 sm:top-3 sm:h-5 sm:w-16 ${badgeStyle}`}
        />

        {/* Top-right Discount Badge Skeleton */}
        <div
          className={`absolute right-2 top-2 h-4 w-12 rounded-full border shadow-sm sm:right-3 sm:top-3 sm:h-5 sm:w-14 ${badgeStyle}`}
        />

        {/* Bottom-right Heart Button Skeleton */}
        <div
          className={`absolute right-2 bottom-2 h-7 w-7 rounded-full border shadow-sm sm:right-3 sm:bottom-3 sm:h-8 sm:w-8 ${badgeStyle}`}
        />
      </div>

      {/* Content Area Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
        <div>
          {/* Brand Line */}
          <div
            className={`h-2 w-12 rounded-full sm:h-2.5 sm:w-16 ${skeletonColor}`}
          />

          {/* Two-line Title Skeleton */}
          <div className="mt-1.5 flex h-8 flex-col justify-center gap-1.5 sm:h-10">
            <div className={`h-3 w-4/5 rounded-full ${skeletonColor}`} />
            <div className={`h-3 w-1/2 rounded-full ${skeletonColor}`} />
          </div>
        </div>

        {/* Price Row Skeleton */}
        <div
          className={`mt-2 flex items-center gap-2 border-t border-dashed pt-2 ${
            dark ? "border-[#35435C]/60" : "border-[#D8E1EF]"
          }`}
        >
          <div
            className={`h-4 w-20 rounded-full sm:h-5 sm:w-24 ${skeletonColor}`}
          />
          <div
            className={`h-3 w-12 rounded-full sm:h-3.5 sm:w-14 ${skeletonColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
