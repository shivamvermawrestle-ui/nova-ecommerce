
import { Link, useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";

const StoreBrowseBar = () => {
  const { dark } = UseGlob();
  const [searchParams] = useSearchParams();

  const { data: categoryItems = [] } = useGetCategoriesQuery();

  const categories = [
    ...new Map(
      categoryItems
        .filter((item) => item.category)
        .map((item) => [item.category, item])
    ).values(),
  ];

  const activeCategory = searchParams.get("category") || "";

  const activeText = dark
    ? "text-[#7895C5] font-bold"
    : "text-[#202C50] font-bold";

  const inactiveText = dark
    ? "text-[#AAB8D0] hover:text-[#EAF0FA] font-medium"
    : "text-[#64718A] hover:text-[#202C50] font-medium";

  const activeIcon = dark
    ? "border-[#7895C5] bg-[#202A40] text-[#7895C5]"
    : "border-[#344F82] bg-[#DFE7F3] text-[#202C50]";

  const inactiveIcon = dark
    ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] group-hover:border-[#7895C5]/50"
    : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] group-hover:border-[#344F82]/50";

  const underlineColor = dark ? "bg-[#7895C5]" : "bg-[#344F82]";

  return (
    <div
      className={`border-b transition-colors duration-200 ${
        dark
          ? "border-[#35435C] bg-[#171E30]"
          : "border-[#D8E1EF] bg-[#FFFFFF]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar sm:gap-4">
          {/* All Category Option */}
          <Link
            to="/shop"
            className={`group relative flex shrink-0 flex-col items-center px-2.5 py-1 transition-colors duration-150 ${
              !activeCategory ? activeText : inactiveText
            }`}
          >
            {/* Category Icon Container */}
            <div
              className={`mb-1.5 flex h-11 w-11 items-center justify-center rounded-xl border shadow-2xs transition-colors ${
                !activeCategory ? activeIcon : inactiveIcon
              }`}
            >
              <span className="text-xs font-bold">All</span>
            </div>

            {/* Category Label */}
            <span className="max-w-[85px] truncate text-center text-xs tracking-tight">
              All Products
            </span>

            {/* Active Underline Indicator */}
            {!activeCategory && (
              <span
                className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${underlineColor}`}
              />
            )}
          </Link>

          {/* Dynamic Categories */}
          {categories.map((item) => {
            const isActive = activeCategory === item.category;

            return (
              <Link
                key={item.category}
                to={`/shop?category=${encodeURIComponent(item.category)}`}
                className={`group relative flex shrink-0 flex-col items-center px-2.5 py-1 transition-colors duration-150 ${
                  isActive ? activeText : inactiveText
                }`}
              >
                {/* Category Icon / Image Container */}
                <div
                  className={`mb-1.5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border shadow-2xs transition-colors ${
                    isActive ? activeIcon : inactiveIcon
                  }`}
                >
                  {item.productImage?.[0] ? (
                    <img
                      src={item.productImage[0]}
                      alt={item.category}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {item.category.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <span className="max-w-[85px] truncate text-center text-xs tracking-tight">
                  {item.category}
                </span>

                {/* Active Underline Indicator */}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${underlineColor}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default StoreBrowseBar;
