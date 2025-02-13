const { Sequelize, DataTypes } = require('sequelize');
const defaultString = `Not_Set`
//create Local Server
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: './sqlite/save.sqlite'
});
//Models
const valueKeys = sequelize.define('valueKeys', {
    key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        unique: false,
        defaultValue: defaultString,
        allowNull: false
    }
});
//exports
module.exports = { sequelize , valueKeys };