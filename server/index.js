require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumRoutes = require('./routes/premiumRoutes');


const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ADDRESS
}));

connectDb();

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);

async function startServer() {
    try {
        app.listen(port, () => {
            console.log(`Server running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();