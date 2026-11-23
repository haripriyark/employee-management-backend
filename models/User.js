const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "hr", "manager", "employee"],
        default: "employee",
    },
    permissions: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    accessTokenVersion: {
        type: Number,
        default: 0
    },
    refreshTokenVersion: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
    }
)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }
    // Generate a salt and hash the password
    // try {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    // const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, saltRounds);
    // next();
    // } catch (error) {
    //     next(error)
    // }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(
        password, // user sent pwd
        this.password//hashed pwd stored in db
    );
};
const User = mongoose.model("User", userSchema);

module.exports = User;
