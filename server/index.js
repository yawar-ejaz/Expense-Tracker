const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./utils/database');
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/expenses", userRoutes);

async function startServer() {
    try {
        await sequelize.sync();
        app.listen(port, () => {
            console.log(`Server running on ${port}...`);
        });
    } catch (error) {
        console.log(error)
    }
}

startServer();