import { useEffect } from "react";

// https://stackoverflow.com/a/65821541/338986
export default function useOutsideClick(ref: any, onClickOut: () => void) {
  useEffect(() => {
    const onClick = ({ target }: any) => {
      !ref.current?.contains(target) && onClickOut?.();
    };
    // https://github.com/facebook/react/issues/20325#issuecomment-732707240
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick);
  }, []);
}
