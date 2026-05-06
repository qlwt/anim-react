import * as r from "react"

export const useRefMerge = function <T>(refs: readonly (r.Ref<T> | null | undefined)[]): (element: T) => void {
    return r.useCallback((element: T) => {
        for (const ref of refs) {
            if (ref) {
                if (typeof ref === "object") {
                    ;(ref as r.MutableRefObject<T>).current = element
                } else {
                    ref(element)
                }
            }
        }

    }, refs)
}
