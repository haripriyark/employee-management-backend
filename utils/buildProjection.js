
const allowedProjectFields = [
    "name",
    "email",
    "salary",
    "department",
    "location",
    "_id"
];
const buildProjection = (fields) => {
    if (!fields) {
        return null;
    }
    if (fields) {
        const projection = {};
        const projectFields = fields.split(',');
        const hasInclude = projectFields.some(field => !field.startsWith("-"));
        const hasExclude = projectFields.some(field => field.startsWith("-"));
        if (hasInclude && hasExclude) {
            const error = new Error("Mixed projection types are not allowed");
            error.statusCode = 400;
            throw error;
        }
        const hasRealExclusion =
            excludedFields.some(field => field !== "-_id");
        if (hasInclude && hasRealExclusion) {
            const error = new Error("Mixed projection types are not allowed");
            error.statusCode = 400;
            throw error;
        }
        projectFields.forEach(field => {
            const fieldName = field.startsWith("-") ? field.slice(1) : field;
            if (allowedProjectFields.includes(fieldName)) {
                projection[fieldName] = field.startsWith("-") ? 0 : 1;
            } else {
                const error = new Error(`Invalid project field : ${fieldName}`);
                error.statusCode = 400;
                throw error;
            }
        })
    }
    return projection;
}
module.exports = { buildProjection };