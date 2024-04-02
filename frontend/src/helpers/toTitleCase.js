export const toTitleCase = (input) => {
    if (typeof input === 'string') {
        if (input.includes('_')) {
            return toTitleCase(input.split('_'))
        } else {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
    } else if (Array.isArray(input)) {
        return input.map((ele) => {return ele.charAt(0).toUpperCase() + ele.slice(1)}).join(' ')
    } else {
        throw new TypeError(`Expected type [ String || Array]. Received [${typeof input}]`)
    }
}