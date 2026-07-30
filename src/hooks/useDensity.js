import { useEffect, useState } from "react";

const STORAGE_KEY = "dentalclub_density";

const getInitialDensity = () => localStorage.getItem(STORAGE_KEY) || "comfortable";

export const useDensity = () => {
  const [density, setDensity] = useState(getInitialDensity);

  useEffect(() => {
    const root = document.documentElement;
    if (density === "compact") root.classList.add("compact");
    else root.classList.remove("compact");
    localStorage.setItem(STORAGE_KEY, density);
  }, [density]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) setDensity(e.newValue || "comfortable");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleDensity = () => setDensity((d) => (d === "compact" ? "comfortable" : "compact"));

  return { density, toggleDensity };
};