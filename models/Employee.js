const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'IT', 'Sales', 'Support']
    },
    salary: {
        type: Number,
        min: 10000
    },
    experience: {
        type: Number,
        min: 0
    },
    location: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
    })

module.exports = mongoose.model("Employee", employeeSchema);
