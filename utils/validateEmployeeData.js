const allowedEmpFields = [
    'name',
    'email',
    'salary',
    'experience',
    'department',
    'location'
];
const allowedDepartments = ['HR', 'IT', 'Sales', 'Support'];
const validateEmployeeData = (empData) => {
    const empFields = Object.keys(empData);
    for (const field of empFields) {
        if (!allowedEmpFields.includes(field)) {
            return false
        }
    }
    const { name, email, salary, experience, department, location } = { ...empData };
    if (!name || !email || !location || !department) {
        return false;
    }
    if (!(name.trim().length >= 3) || !(location.trim().length >= 3)) {
        return false;
    }
    if (!allowedDepartments.includes(department)) {
        return false;
    }
    if (salary === null || salary === undefined) {
        return false;
    }
    if (typeof salary !== 'number' || salary < 10000 || salary > 500000) {
        return false;
    }
    if (experience === null || experience === undefined) {
        return false;
    }
    if (typeof experience !== 'number' || experience < 0 || experience > 50) {
        return false;
    }

    return true;
}
module.exports = {
    validateEmployeeData
}