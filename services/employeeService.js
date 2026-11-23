const Employee = require("../models/Employee.js");

const findEmployeeByEmail = async(email) => {
    return await Employee.findOne({ email });
}
module.exports = {
    findEmployeeByEmail
}