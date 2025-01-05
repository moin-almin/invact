const express = require('express');
const { sequelize } = require('./lib/');
const cors = require('cors');
const { department } = require('./models/department.model');
const { role } = require('./models/role.model');
const { employee } = require('./models/employee.model');
const { employeeDepartment } = require('./models/employeeDepartment.model');
const { employeeRole } = require('./models/employeeRole.model');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to seed database
app.get('/seed_db', async (req, res) => {
    await sequelize.sync({ force: true });

    const departments = await department.bulkCreate([
        { name: 'Engineering' },
        { name: 'Marketing' },
    ]);

    const roles = await role.bulkCreate([
        { title: 'Software Engineer' },
        { title: 'Marketing Specialist' },
        { title: 'Product Manager' },
    ]);

    const employees = await employee.bulkCreate([
        { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
        { name: 'Priya Singh', email: 'priya.singh@example.com' },
        { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
    ]);

    // Associate employees with departments and roles using create method on junction models
    await employeeDepartment.create({
        employeeId: employees[0].id,
        departmentId: departments[0].id,
    });
    await employeeRole.create({
        employeeId: employees[0].id,
        roleId: roles[0].id,
    });

    await employeeDepartment.create({
        employeeId: employees[1].id,
        departmentId: departments[1].id,
    });
    await employeeRole.create({
        employeeId: employees[1].id,
        roleId: roles[1].id,
    });

    await employeeDepartment.create({
        employeeId: employees[2].id,
        departmentId: departments[0].id,
    });
    await employeeRole.create({
        employeeId: employees[2].id,
        roleId: roles[2].id,
    });

    return res.json({ message: 'Database seeded!' });
});

// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
    const employeeDepartments = await employeeDepartment.findAll({
        where: { employeeId },
    });

    let departmentData;
    for (let empDep of employeeDepartments) {
        departmentData = await department.findOne({
            where: { id: empDep.departmentId },
        });
    }

    return departmentData;
}

async function getEmployeeRoles(employeeId) {
    const employeeRoles = await employeeRole.findAll({ where: { employeeId } });

    let roleData;
    for (let empRole of employeeRoles) {
        roleData = await role.findOne({
            where: { id: empRole.roleId}
        })
    }
    return roleData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
    const department = await getEmployeeDepartments(employeeData.id);
    const role = await getEmployeeRoles(employeeData.id);

    return {
        ...employeeData.dataValues,
        department,
        role,
    };
}

// Get All Employees Function
async function getAllEmployees(){
    let employees = await employee.findAll();
    return { employees };
};

// Endpoint: Get All Employees
app.get('/employees', async (req, res) => {
    try {
        let result = await getAllEmployees();
        if (result.employees.length === 0) {
            return res.status(404).json({message: "No employee found"});
        }
        let employees = [];
        for (let employee of result.employees) {
            let employeeData = await getEmployeeDetails(employee);
            employees.push(employeeData);
        }
        return res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: 'Error while getting all employees', error: error.message });
    }
});

// Get Employee by ID function
async function getEmployeeById(employeeId) {
    return await employee.findOne({ where: { id: employeeId } });
}

// Endpoint: Get Employee by ID
app.get('/employees/details/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let employee = await getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({message: "No employee found with id: " + id});
        }
        let employeeData = await getEmployeeDetails(employee);
        return res.status(200).json({employee: employeeData});
    } catch (error) {
        res.status(500).json({ message: 'Error while getting details', error: error.message });
    }
});

// Get employees by departmentId function
async function getEmployeesByDepartmentId(deptId) {
    return await employeeDepartment.findAll({where: { departmentId: deptId }});
}

// Endpoint: Get Employees by Department
app.get('/employees/department/:departmentId', async (req, res) => {
    try {
        let departmentId = parseInt(req.params.departmentId);
        let employees = await getEmployeesByDepartmentId(departmentId);
        if (employees.length === 0) {
            return res.status(404).json({message: "No employee found for department Id: " + departmentId});
        }
        let employeesData = [];
        for (let employee of employees) {
            let employeeData = await getEmployeeById(employee.employeeId);
            let employeeDetails = await getEmployeeDetails(employeeData);
            employeesData.push(employeeDetails);
        }
        return res.status(200).json({ employees: employeesData });
    } catch (error) {
        res.status(500).json({ message: 'Error while getting employees.', error: error.message });
    }
})

app.listen(3000, () => { console.log('Server running on port 3000')});