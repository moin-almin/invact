const {DataTypes, sequelize} = require("../lib/");
let { employee } = require("./employee.model");
let { department } = require("./department.model");

let employeeDepartment = sequelize.define("employeeDepartment", {
    employeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: "employee",
            key: "id",
        }
    },
    departmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: "department",
            key: "id",
        }
    }
})

department.belongsToMany(employee, {through: "employeeDepartment"});
employee.belongsToMany(department, {through: "employeeDepartment"});

module.exports = { employeeDepartment };