import { useEffect } from "react";

const useOutsideClick = (refs: any[], handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = refs.every((ref) => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      if (isOutsideClick) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler]);
};

export default useOutsideClick;
