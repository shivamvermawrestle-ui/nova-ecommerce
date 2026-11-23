import { useEffect } from "react";

const usePageTitle = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} | Nova.` : "Nova.";

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      description || "Thoughtful products for your home and everyday life."
    );
  }, [title, description]);
};

export default usePageTitle;