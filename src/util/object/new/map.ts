export type Object_New_Map_Handler<Src extends Object, Out> = {
    (value: Src[keyof Src], key: keyof Src, src: Src): Out
}

export type Object_New_Map_Return<Src extends Object, Out> = {
    -readonly [K in keyof Src]: Out
}

type Return<Src extends Object, Out> = Object_New_Map_Return<Src, Out>
type Handler<Src extends Object, Out> = Object_New_Map_Handler<Src, Out>

export const object_new_map = function <Src extends Object, Out>(src: Src, handler: Handler<Src, Out>): Return<Src, Out> {
    return Object.fromEntries(Object.entries(src).map(([key, value]) => {
        return [
            key,
            handler(value, key as keyof Src, src)
        ]
    })) as Return<Src, Out>
}
