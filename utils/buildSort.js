const allowedSortFields = [
    "name",
    "email",
    "department",
    "location",
    "salary",
    "createdAt",
    "_id"
];
const buildSort = (sort) => {
    sort = sort || "-createdAt,_id";
    const sortFields = sort.split(",");
    if (sortFields.length > 3) {
        const error = new Error('Maximum 3 sort fields allowed');
        error.statusCode = 400;
        throw error;
    }
    const sortObject = {};
    sortFields.forEach(sortField => {
        const fieldName = sortField.startsWith("-") ? sortField.slice(1) : sortField;
        if (allowedSortFields.includes(fieldName)) {
            sortObject[fieldName] = sortField.startsWith("-") ? -1 : 1;
        } else {
            const error = new Error(`Invalid sort field : ${fieldName}`);
            error.statusCode = 400;
            throw error;
        }
    });
    return sortObject;
}
module.exports = { buildSort };