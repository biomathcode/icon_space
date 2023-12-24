import { useState, useEffect } from "react";

type MediaQuery = "small" | "medium" | "large";

const useMediaQuery = (): MediaQuery => {
  const [mediaQuery, setMediaQuery] = useState<MediaQuery>("medium");

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 240) {
        setMediaQuery("small");
      } else if (screenWidth <= 600) {
        setMediaQuery("medium");
      } else if (screenWidth <= 1200) {
        setMediaQuery("large");
      } else {
        // Handle other sizes if needed
      }
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return mediaQuery;
};

export default useMediaQuery;
