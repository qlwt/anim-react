import { InputDef_type, type InputDef } from "#src/inputdef/type/InputDef.js"

type InputDefListen_Params<T> = {
    readonly src: InputDef<T>
    readonly listener: (value: T) => VoidFunction | void | undefined | null
}

export const inputdef_listen = function <T>(params: InputDefListen_Params<T>): VoidFunction {
    const { src, listener } = params

    let cleanup: VoidFunction | void | undefined | null

    switch (src.type) {
        case InputDef_type.Static: {
            cleanup = listener(src.value())

            return () => {
                if (cleanup) {
                    cleanup()

                    cleanup = undefined
                }
            }
        }
        case InputDef_type.Dynamic: {
            const src_sub = () => {
                cleanup?.()

                cleanup = listener(src.value.output())
            }

            src.value.addsub(src_sub)

            src_sub()

            return () => {
                src.value.rmsub(src_sub)

                if (cleanup) {
                    cleanup()

                    cleanup = undefined
                }
            }
        }
    }
}
