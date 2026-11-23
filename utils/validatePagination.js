const validatePagination = (page, limit) => {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
        const error = new Error('Invalid pagination values');
        error.statusCode = 400;
        throw error;
    }
    return { page, limit };
}
module.exports = { validatePagination };