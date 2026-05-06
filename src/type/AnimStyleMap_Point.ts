export type AnimStyleMap_Point_Field<ChildPoint> = {
    readonly point: ChildPoint
    readonly deps: null | readonly unknown[]
}

export type AnimStyleMap_Point<ChildPoint> = {
    [K in string]: {
        [K in string]: AnimStyleMap_Point_Field<ChildPoint>
    }
}
