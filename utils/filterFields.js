/**
 * Returns a new object containing only the allowed fields
 * from the request body.
 */
const filterFields = (reqBody, allowedFields) => {
    const filteredFields = {}
    allowedFields.forEach(field => {
        if (Object.hasOwn(reqBody, field)) {
            filteredFields[field] = reqBody[field];
        }
    })
    return filteredFields;
}
module.exports = { filterFields }