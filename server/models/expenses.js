const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const DataTypes = Sequelize.DataTypes;

const Expenses = sequelize.define('expenses', {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
});

module.exports = Expenses;