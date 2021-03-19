export function checkRow(matchArray: RegExpMatchArray, arr: string[]): [string[], string[]] {
    const [open, close] = arr
    return matchArray.reduce(([prevStart, prevEnd], curr) => {
        prevStart.push(...curr.split("").filter((ch) => ch === open));
        prevEnd.push(...curr.split("").filter((ch) => ch === close));
        return [prevStart, prevEnd];
    }, [new Array<string>(), new Array<string>()]);
}