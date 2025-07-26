


/**
 * Parse a string as a JSON array and return the array.
 * If the string is not a valid JSON array, return an error.
 * @param {string} array the string to parse
 * @returns {string[] | Error} the parsed array or an error
 */
export const parseArray = (array : string) : string[] | Error => {

    try {
        return JSON.parse(array);
    } catch (error) {
        return new Error("Invalid array format");
    }

}