
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

  const formStyle = dark
    ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] focus-within:border-[#7895C5] focus-within:ring-2 focus-within:ring-[#7895C5]/20"
    : "border-[#D8E1EF] bg-white text-[#202C50] focus-within:border-[#344F82] focus-within:ring-2 focus-within:ring-[#344F82]/15";

  const iconColor = dark ? "text-[#AAB8D0]" : "text-[#64718A]";

  const inputColor = dark
    ? "text-[#EAF0FA] placeholder:text-[#8190AA]"
    : "text-[#202C50] placeholder:text-[#8A96AA]";

  const buttonColor = dark
    ? "text-[#7895C5] hover:text-[#9BB2D8]"
    : "text-[#344F82] hover:text-[#202C50]";

  return (
    <form
      key={searchParams.toString()}
      onSubmit={handleSearch}
      role="search"
      className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border px-3.5 py-2 shadow-xs transition-all ${formStyle}`}
    >
      <Search
        size={20}
        className={`shrink-0 ${iconColor}`}
      />

      <input
        name="q"
        defaultValue={searchParams.get("q") || ""}
        placeholder="Search for Products, Brands and More"
        className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${inputColor}`}
      />

      <button
        type="submit"
        className={`shrink-0 px-1 text-sm font-semibold transition-colors ${buttonColor}`}
      >
        Search
      </button>
    </form>
  );
};

export default StoreSearchForm;
