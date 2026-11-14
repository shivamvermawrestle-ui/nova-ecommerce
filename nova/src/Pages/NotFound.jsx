import { Link } from "react-router-dom";
import { UseGlob } from "../Context/GlobalContext";

const NotFound = () => {
  const { dark } = UseGlob();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
        Error 404
      </p>

      <h1 className={`mt-3 text-4xl font-extrabold tracking-tight ${dark ? "text-[#EAF0FA]" : "text-[#202C50]"}`}>
        Page not found
      </h1>

      <p className={`mt-3 text-sm max-w-sm ${dark ? "text-[#AAB8D0]" : "text-[#64718A]"}`}>
        Sorry, we couldn't find the page you're looking for.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
        >
          Go home
        </Link>

        <Link
          to="/shop"
          className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
            dark
              ? "border-[#35435C] bg-[#202A40] text-[#EAF0FA] hover:bg-[#2D3B56]"
              : "border-[#D8E1EF] bg-white text-[#202C50] hover:bg-[#EDF2F9]"
          }`}
        >
          Browse shop
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
