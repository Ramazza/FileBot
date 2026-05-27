import { useEffect } from "react";

type RefOrArray = React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[];

export function useClickOutside(
    refOrRefs: RefOrArray,
    callback: () => void
) {
    useEffect(() => {
        const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            const isInside = refs.some(
                (ref) => ref.current?.contains(target)
            );

            if (!isInside) {
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refOrRefs, callback]);
}