import { UseGlob } from "../../Context/GlobalContext";

const ProductCardSkeleton = () => {
  const { dark } = UseGlob();

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-2xl border overflow-hidden animate-pulse shadow-2xs ${
        dark
          ? "border-[#35435C] bg-[#202A40]"
          : "border-[#D8E1EF] bg-white"
      }`}
    >
      {/* Image Area Skeleton */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-t-2xl ${
          dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
        }`}
      >
        <div
          className={`h-full w-full rounded-t-2xl ${
            dark ? "bg-[#202A40]/80" : "bg-[#DFE7F3]/80"
          }`}
        />

        {/* Top-left category badge skeleton */}
        <div
          className={`absolute left-2 top-2 sm:left-3 sm:top-3 h-4 sm:h-5 w-12 sm:w-16 rounded-full border shadow-2xs ${
            dark
              ? "border-[#35435C] bg-[#202A40]"
              : "border-[#D8E1EF] bg-white"
          }`}
        />

        {/* Top-right heart button skeleton */}
        <div
          className={`absolute right-2 top-2 sm:right-3 sm:top-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full border shadow-2xs ${
            dark
              ? "border-[#35435C] bg-[#202A40]"
              : "border-[#D8E1EF] bg-white"
          }`}
        />
      </div>

      {/* Content Area Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
        <div>
          {/* Brand line */}
          <div
            className={`h-2 sm:h-2.5 w-12 sm:w-16 rounded-full ${
              dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
            }`}
          />
          {/* 2-line Title container matching h-8 sm:h-10 */}
          <div className="mt-1.5 flex flex-col gap-1.5 h-8 sm:h-10 justify-center">
            <div
              className={`h-3 w-4/5 rounded-full ${
                dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
              }`}
            />
            <div
              className={`h-3 w-1/2 rounded-full ${
                dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
              }`}
            />
          </div>
        </div>

        {/* Price Row Skeleton */}
        <div
          className={`mt-2 pt-2 border-t border-dashed flex items-center justify-between ${
            dark ? "border-[#35435C]/60" : "border-[#D8E1EF]"
          }`}
        >
          <div
            className={`h-4 sm:h-5 w-16 sm:w-20 rounded-full ${
              dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
            }`}
          />
          <div
            className={`h-3 sm:h-4 w-10 sm:w-12 rounded-full ${
              dark ? "bg-[#35435C]" : "bg-[#D8E1EF]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;