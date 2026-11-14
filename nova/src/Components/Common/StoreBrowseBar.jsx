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

  return (
    <div
      className={`border-b transition-colors duration-200 ${
        dark ? "border-[#35435C] bg-[#171E30]" : "border-[#D8E1EF] bg-[#FFFFFF]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar items-center py-2.5">
          {/* "All" Category Option */}
          <Link
            to="/shop"
            className={`group relative flex shrink-0 flex-col items-center px-2.5 py-1 transition-colors duration-150 ${
              !activeCategory
                ? dark
                  ? "text-[#7895C5] font-bold"
                  : "text-[#202C50] font-bold"
                : dark
                ? "text-[#AAB8D0] hover:text-[#EAF0FA] font-medium"
                : "text-[#64718A] hover:text-[#202C50] font-medium"
            }`}
          >
            {/* Category Icon Container */}
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center mb-1.5 border shadow-2xs transition-colors ${
                !activeCategory
                  ? dark
                    ? "border-[#7895C5] bg-[#202A40] text-[#7895C5]"
                    : "border-[#202C50] bg-[#DFE7F3] text-[#202C50]"
                  : dark
                  ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] group-hover:border-[#7895C5]/50"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#202C50] group-hover:border-[#202C50]/50"
              }`}
            >
              <span className="text-xs font-bold">All</span>
            </div>

            {/* Category Label */}
            <span className="text-xs tracking-tight text-center max-w-[85px] truncate">
              All Products
            </span>

            {/* Active Underline Indicator */}
            {!activeCategory && (
              <span
                className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                  dark ? "bg-[#7895C5]" : "bg-[#202C50]"
                }`}
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
                  isActive
                    ? dark
                      ? "text-[#7895C5] font-bold"
                      : "text-[#202C50] font-bold"
                    : dark
                    ? "text-[#AAB8D0] hover:text-[#EAF0FA] font-medium"
                    : "text-[#64718A] hover:text-[#202C50] font-medium"
                }`}
              >
                {/* Category Icon / Image Container */}
                <div
                  className={`h-11 w-11 rounded-xl  overflow-hidden flex items-center justify-center mb-1.5  border shadow-2xs transition-colors ${
                    isActive
                      ? dark
                        ? "border-[#7895C5] bg-[#202A40]"
                        : "border-[#202C50] bg-[#DFE7F3]"
                      : dark
                      ? "border-[#35435C] bg-[#202A40] group-hover:border-[#7895C5]/50"
                      : "border-[#D8E1EF] bg-[#F7F9FC] group-hover:border-[#202C50]/50"
                  }`}
                >
                  {item.productImage?.[0] ? (
                    <img
                      src={item.productImage[0]}
                      alt={item.category}
                      loading="lazy"
                      className="h-full w-full object-cover "
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {item.category.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <span className="text-xs tracking-tight text-center max-w-[85px] truncate">
                  {item.category}
                </span>

                {/* Active Underline Indicator */}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                      dark ? "bg-[#7895C5]" : "bg-[#202C50]"
                    }`}
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
