import * as react from "react"

type UseRef_Definition<T> = {
    readonly current: T
}


export const useRefObject = function <T>(definition: UseRef_Definition<T>): () => T {
    return react.useCallback(
        () => definition.current,
        [definition]
    )
}
