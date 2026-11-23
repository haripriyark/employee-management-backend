const normalizeArray = (value, caseType = "upper") => {

    if (typeof value === "string") {
        return value.trim() ? [normalize(value, caseType)] : [];
    }
    if (Array.isArray(value) && value.length) {
        return value
            .filter(item => typeof item === "string")
            .map(item => normalize(item, caseType))
            .filter(Boolean)
    }
    return [];
}
const normalize = (item, caseType) => {
    const trimmed = item.trim();
    return caseType === "lower"
        ? trimmed.toLowerCase()
        : trimmed.toUpperCase();
};
module.exports = { normalizeArray };