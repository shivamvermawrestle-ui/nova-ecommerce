import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      document.body.style.backgroundColor = "#171E30";
      document.body.style.color = "#EAF0FA";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      document.body.style.backgroundColor = "#F7F9FC";
      document.body.style.color = "#202C50";
    }
  }, [dark]);

  const formatPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return (
    <div>
      <GlobalContext.Provider
        value={{
          dark,
          setDark,
          isOpen,
          setIsOpen,
          showPassword,
          setShowPassword,
          loading,
          setLoading,
          navigate,
          location,
          formatPrice,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </div>
  );
};

export const UseGlob = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("Provide children within the provider!");
  }
  return context;
};
