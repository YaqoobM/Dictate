import { useEffect, useRef, useState } from "react";

const useComponentVisibility = <T extends HTMLElement>(
  isInitiallyVisible: boolean,
) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isVisible, setIsVisible };
};

export default useComponentVisibility;
