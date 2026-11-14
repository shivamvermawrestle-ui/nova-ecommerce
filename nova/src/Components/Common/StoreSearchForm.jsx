import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { UseGlob } from "../../Context/GlobalContext";

const StoreSearchForm = () => {
  const { navigate, dark } = UseGlob();
  const [searchParams] = useSearchParams();

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") || "").trim();

    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  };

  return (
    <form
      key={searchParams.toString()}
      onSubmit={handleSearch}
      role="search"
      className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border px-3.5 py-2 transition-all shadow-xs ${
        dark
          ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] focus-within:border-[#9BB2D8] focus-within:ring-2 focus-within:ring-[#9BB2D8]/20"
          : "border-[#C9D5E7] bg-white text-[#202C50] focus-within:border-[#7895C5] focus-within:ring-2 focus-within:ring-[#7895C5]/20"
      }`}
    >
      <Search
        size={20}
        className={`shrink-0 ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}
      />

      <input
        name="q"
        defaultValue={searchParams.get("q") || ""}
        placeholder="Search for Products, Brands and More"
        className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
          dark
            ? "placeholder:text-[#8190AA] text-[#EAF0FA]"
            : "placeholder:text-[#8A96AA] text-[#202C50]"
        }`}
      />

      <button
        type="submit"
        className={`shrink-0 text-sm font-semibold transition-colors px-1 ${
          dark
            ? "text-[#7895C5] hover:text-[#9BB2D8]"
            : "text-[#202C50] hover:text-[#344F82]"
        }`}
      >
        Search
      </button>
    </form>
  );
};

export default StoreSearchForm;
