export type AnimStyleMap_Point<ChildPoint> = {
    [K in string]: {
        [K in string]: ChildPoint
    }
}
