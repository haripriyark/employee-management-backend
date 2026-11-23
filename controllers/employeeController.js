const Employee = require("../models/Employee.js");
const { validateObjectId } = require("../utils/validateObjectId.js");
const { buildFilters } = require("../utils/buildFilters.js");
const { buildProjection } = require("../utils/buildProjection.js");
const { buildSort } = require("../utils/buildSort");
const { validatePagination } = require("../utils/validatePagination.js");
const { validateEmployeeData } = require("../utils/validateEmployeeData.js");
const { filterFields } = require("../utils/filterFields.js");
const { findEmployeeByEmail } = require("../services/employeeService.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { AppError } = require("../utils/AppError");

const createEmployee = asyncHandler(async (req, res) => {
    const newEmp = req.body;
    if (!validateEmployeeData(newEmp)) {
        throw new AppError("Invalid/ missing employee fields", 400);
    }
    const normalizedEmail = newEmp.email.trim().toLowerCase();
    const existingEmployee = await findEmployeeByEmail(normalizedEmail);
    if (existingEmployee) {
        throw new AppError('Employee with this email already exists', 409);
    }
    newEmp.email = normalizedEmail;
    const employee = await Employee.create(newEmp);
    res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        employee
    })
})

const getAllEmployees = asyncHandler(async (req, res) => {
    let { page: queryPage, limit: queryLimit, sort, fields, ...queryFilters } = req.query;
    const { page, limit } = validatePagination(queryPage, queryLimit);
    const filters = buildFilters(queryFilters);
    const sortObject = buildSort(sort);
    const projection = buildProjection(fields);

    const result = await Employee.aggregate([
        {
            $match: filters
        },
        {
            $facet: {
                metadata: [
                    { $count: "totalEmployees" }
                ],
                employees: [
                    {
                        $sort: sortObject
                    },
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $limit: limit
                    },
                    ...(projection ? [{ $project: projection }] : [])
                ]
            }
        }
    ]);
    const totalEmployees = result[0]?.metadata[0]?.totalEmployees || 0;
    const employees = result[0].employees;
    res.status(200).json({
        totalEmployees,
        currentPage: page,
        totalPages: Math.ceil(totalEmployees / limit),
        employees
    });
})

const getEmployeeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id)) {
        const error = new Error('Invalid employee id');
        error.statusCode = 400;
        throw error;
    }
    const employee = await Employee.findById(id);
    if (!employee) {
        const error = new Error('Employee not found');
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({
        message: 'Employee fetched successfully',
        employee,
        success: true
    })
})
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id)) {
        throw new AppError('Invalid employee id', 400);
    }
    if (Object.keys(req.body).length === 0) {
        throw new AppError('Invalid  update details', 400);
    }
    const allowedUpdates = [
        "name",
        "email",
        "department",
        "salary",
        "experience",
        "location"
    ];
    const updates = filterFields(req.body, allowedUpdates);
    if (Object.keys(updates).length === 0) {
        throw new AppError('No valid field/s provided for update', 400);
    }
    const employee = await Employee.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true });
    if (!employee) {
        throw new AppError('Employee not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        employee
    })
})
const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id)) {
        throw new AppError('Invalid employee id', 400);
    }
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
        throw new AppError('Employee not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        employee: deletedEmployee
    })
})

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};

