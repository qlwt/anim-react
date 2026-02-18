import { inputdef_new_dynamic } from "#src/inputdef/new/dynamic.js"
import { inputdef_new_static } from "#src/inputdef/new/static.js"
import { InputDef_type, type InputDef } from "#src/inputdef/type/InputDef.js"
import type { InputDef_InferOutput } from "#src/inputdef/type/InputDef_InferOutput.js"
import { attachment_new_lazy, batcher, signal_sub_emit, type Signal_Sub } from "@qyu/signal-core"

type Src_Generic = InputDef<InputDef | undefined>

type InputDefFlat_Output<Src extends Src_Generic> = (
    (Src extends InputDef<InputDef<infer T>>
        ? T
        : (Src extends InputDef<InputDef<infer T> | undefined>
            ? T | undefined
            : never
        )
    )
)

type Cache<Src extends Src_Generic> = {
    src_id: Symbol
    batcher_id: Symbol
    target: InputDef_InferOutput<Src>
}

export const inputdef_new_flat = function <Src extends Src_Generic>(src: Src): InputDef<InputDefFlat_Output<Src>> {
    if (src.type === InputDef_type.Static) {
        const src_value = src.value()

        return src_value || inputdef_new_static(() => undefined)
    }

    let cache: Cache<Src> | null = null

    const cache_get = () => {
        const batcher_id = batcher.id()

        if (cache) {
            if (batcher_id !== cache.batcher_id) {
                const src_id = src.value.id()
                const src_output = src.value.output() as InputDef_InferOutput<Src>

                if (cache.src_id !== src_id) {
                    cache = {
                        src_id,
                        batcher_id,
                        target: src_output,
                    }
                }
            }
        } else {
            const src_id = src.value.id()
            const src_output = src.value.output() as InputDef_InferOutput<Src>

            cache = {
                src_id,
                batcher_id,
                target: src_output,
            }
        }

        return cache
    }

    const attachment = attachment_new_lazy({
        connection_new: order => {
            let target_last: InputDef_InferOutput<Src> | null = null

            const emit = () => {
                attachment.emit(order)
            }

            const src_sub: Signal_Sub = () => {
                const cache_l = cache_get()
                const cache_now = cache_l.target

                const last = target_last

                {
                    target_last = cache_now
                }

                if (last && last.type === InputDef_type.Dynamic) {
                    last.value.rmsub(emit)
                }

                if (cache_now && cache_now.type === InputDef_type.Dynamic) {
                    cache_now.value.addsub(emit, { order })
                }

                signal_sub_emit(emit, { order: false })
            }

            return {
                attach: () => {
                    const cache_l = cache_get()
                    const cache_now = cache_l.target

                    {
                        target_last = cache_now
                    }

                    src.value.addsub(src_sub, { order })

                    if (cache_now && cache_now.type === InputDef_type.Dynamic) {
                        cache_now.value.addsub(emit, { order })
                    }
                },

                detach: () => {
                    src.value.rmsub(src_sub)

                    if (target_last && target_last.type === InputDef_type.Dynamic) {
                        target_last.value.rmsub(emit)
                    }
                },
            }
        },
    })

    return inputdef_new_dynamic({
        rmsub: attachment.rmsub,
        addsub: attachment.addsub,

        id: () => {
            const cache = cache_get()

            if (cache.target?.type === InputDef_type.Dynamic) {
                return cache.target.value.id()
            }

            return cache.src_id
        },

        output() {
            const cache_l = cache_get()

            if (cache_l.target) {
                switch (cache_l.target.type) {
                    case InputDef_type.Static:
                        return cache_l.target.value()
                    case InputDef_type.Dynamic:
                        return cache_l.target.value.output()
                }
            }

            return undefined
        },
    })
}
