const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT;
const connectDB = require("./config/db.js");
const employeeRoutes = require("./routes/employeeRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

// cors
app.use(cors({
    origin: 'http://localhost:4200'
}));
// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
// Error Handler
app.use(errorHandler);

// connectDB();
// app.listen(PORT, () => {
//     console.log(`Server running on port : ${PORT}`);
// })

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
};

startServer();