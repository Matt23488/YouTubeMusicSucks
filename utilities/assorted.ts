export const groupIntoObject = <T, G>(arr: T[], accessor: (item: T) => string, create: (item: T) => G, update: (item: T, group: G) => void) => {
    return arr.reduce<Record<string, G>>((map, item) => {
        const key = accessor(item);
        if (map[key]) update(item, map[key]);
        else map[key] = create(item);
        return map;
    }, {});
};

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
 export const calculateStringCloseness = (s1: string, s2: string) => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
};

const editDistance = (s1: string, s2: string) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

/**
 * @template T
 * @param {T[]} arrA 
 * @param {T[] | string[] | string} arrB 
 * @param {(obj: T) => string} [accessor]
 * @param {boolean=} descending 
 * @returns {T[]}
 */
export const orderByCloseness = <T>(arrA: T[], arrB: T[] | string[] | string, accessor: (obj: T) => string = obj => obj as unknown as string, descending = true) => {
    const getComparisonVal = (i: number) => {
        if (typeof arrB === 'string') return arrB;
        if (typeof arrB[i] === 'string') return arrB[i] as string;
        return accessor(arrB[i] as T);
    };

    return arrA.map((obj, i) => ({
        obj,
        closeNess: calculateStringCloseness(accessor(obj), getComparisonVal(i))
    })).sort((a, b) => a.closeNess - b.closeNess * (descending ? 1 : -1))
    .map(({ obj }) => obj);
};