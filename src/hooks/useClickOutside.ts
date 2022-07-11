import { useEffect, RefObject } from "react"
interface useClickOutsideOptionsProps {
  onClickOutside: () => void
}

export const useClickOutside = (
  ref: RefObject<HTMLElement | null | undefined>,
  { onClickOutside }: useClickOutsideOptionsProps
) => {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside()
      }
    }
    document?.addEventListener("mousedown", handleClickOutside)
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, onClickOutside])
}
