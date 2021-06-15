export const groupIntoObject = <T, G>(arr: T[], accessor: (item: T) => string, create: (item: T) => G, update: (item: T, group: G) => void) => {
    return arr.reduce<Record<string, G>>((map, item) => {
        const key = accessor(item);
        if (map[key]) update(item, map[key]);
        else map[key] = create(item);
        return map;
    }, {});
};