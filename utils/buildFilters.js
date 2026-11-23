const allowedFilters = [
    "name",
    "department",
    "salary",
    "location"
];

const buildFilters = (queryParams) => {
    const { search } = queryParams;
    const filters = {};
    //normal filters
    allowedFilters.forEach(field => {
        if (queryParams[field] !== undefined &&
            queryParams[field] !== ""
        ) {
            filters[field] = queryParams[field];
        }
    })
    // search 
    if (search) {
        filters.$or = [
            { name: { $regex: search?.trim(), $options: "i" } },
            { email: { $regex: search?.trim(), $options: "i" } },
        ]
    }
    return filters;
}

module.exports = { buildFilters };