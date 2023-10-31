const Expenses = require('../models/expenses');

const getExpenses = async (req, res, next) => {
    try {
        const result = await Expenses.findAll({
            order: [["date", "ASC"]]
        });
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch items from database!"
        })
        console.log("failed to fetch items from database. " + error)
    }
}

const getParticularExpense = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            console.log("No id provided");
            res.status(500).json({
                success: false,
                message: "Some problem with the id provided!"
            })
        }
        else {
            const data = await Expenses.findByPk(id);
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch item from database!"
        })
    }
}

const createExpense = async (req, res, next) => {
    const { amount, desc, date } = req.body;
    try {
        await Expenses.create({
            amount,
            desc,
            date
        });
        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add item to the database!"
        });
        console.log("failed to add item to the database. " + error);
    }
}

const updateExpense = async (req, res, next) => {;
    const id = req.params.id;
    const { amount, desc, date } = req.body;
    try {
        const data = await Expenses.findByPk(id);
        if (!data) {
            console.log('Incorrect id');
            return res.status(400).json({
                success: false,
                message: "No data found for this id"
            });
        }
        else {
            await Expenses.update({
                amount, desc, date
            },
                {
                    where: {
                        _id: id
                    }
                });
            return res.status(200).json({
                success: true,
                message: "Value updated successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "value not deleted"
        });
    }
}

const deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        console.log("No id provided");
    }
    else {
        try {
            const data = await Expenses.findByPk(id);
            if (!data) {
                console.log('Incorrect id');
                return res.status(400).json({
                    success: false,
                    message: "No data found for this id"
                });
            }
            else {
                await Expenses.destroy({
                    where: {
                        _id: id
                    }
                });
                return res.status(200).json({
                    success: true,
                    message: "Value deleted successfully"
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "value not deleted"
            });
        };
    }
}

module.exports = {
    getExpenses,
    getParticularExpense,
    createExpense,
    updateExpense,
    deleteExpense
}