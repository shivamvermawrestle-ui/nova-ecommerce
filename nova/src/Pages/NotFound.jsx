import { Link } from "react-router-dom";
import { UseGlob } from "../Context/GlobalContext";

const NotFound = () => {
  const { dark } = UseGlob();

  return (
    <main
      className={`flex min-h-[75vh] flex-col items-center justify-center px-6 py-12 text-center ${
        dark ? "bg-[#171E30]" : "bg-[#F7F9FC]"
      }`}
    >
      {/* 404 Illustration */}
      <img
        src="/images/monster-404.svg"
        alt="Monster 404 error illustration"
        className="mb-6 w-full max-w-[320px] object-contain sm:max-w-[380px]"
      />

      <p
        className={`text-xs font-bold uppercase tracking-widest ${
          dark ? "text-[#AAB8D0]" : "text-[#64718A]"
        }`}
      >
        Error 404
      </p>

      <h1
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-[#EAF0FA]" : "text-[#202C50]"
        }`}
      >
        Page not found
      </h1>

      <p
        className={`mt-3 max-w-sm text-sm leading-6 ${
          dark ? "text-[#AAB8D0]" : "text-[#64718A]"
        }`}
      >
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or deleted.
      </p>

      {/* Navigation Buttons */}
      <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className={`rounded-xl px-6 py-3 text-sm font-bold transition-colors ${
            dark
              ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
              : "bg-[#202C50] text-white hover:bg-[#344F82]"
          }`}
        >
          Go home
        </Link>

        <Link
          to="/shop"
          className={`rounded-xl border px-6 py-3 text-sm font-semibold transition-colors ${
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
