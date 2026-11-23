const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate.js");
const { authorize } = require("../middleware/authorize.js");
const { createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee } = require('../controllers/employeeController');
const { authorizePermission } = require("../middleware/authorizePermission.js");

router.get('/', authenticate, getAllEmployees);

// authorize(
//     "admin",
//     "hr",
//     "manager",
//     "employee"
// )
// router.get('/:id', authenticate, getEmployeeById);
// router.post('/', authenticate, createEmployee);
// router.put('/:id', authenticate, updateEmployee);
// router.delete('/:id', authenticate, authorize("admin"), authorizePermission("DELETE_EMPLOYEE"), deleteEmployee);

router.delete(
    "/test-delete",
    authenticate,
    authorizePermission("employee:delete"),
    (req,res)=>{
        res.json({
            message:"Delete allowed"
        });
    }
);
// router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

router.get('/filter', (req, res) => {
    const { department, experience, location } = req.query;
    res.send({ department, experience, location });
})


module.exports = router;