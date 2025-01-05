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
});

// Get employees by roleId function
async function getEmployeesByRoleId(roleId) {
    return await employeeRole.findAll({where: { roleId }});
}

// Endpoint: Get All Employees by Role
app.get('/employees/role/:roleId', async (req, res) => {
    try {
        let roleId = parseInt(req.params.roleId);
        let employees = await getEmployeesByRoleId(roleId);
        if (employees.length === 0) {
            return res.status(404).json({message: "No employee found with role id: " + roleId});
        }
        let employeesData = [];
        for (let employee of employees) {
            let employeeData = await getEmployeeById(employee.employeeId);
            let employeeDetails = await getEmployeeDetails(employeeData);
            employeesData.push(employeeDetails);
        }
        return res.status(200).json({employees: employeesData});
    } catch (error) {
        res.status(500).json({ message: 'Error while getting employees.', error: error.message });
    }
});

// Function Get Employees Sorted by Name
async function getEmployeesSortedByName(order) {
    return await employee.findAll({order: [['name', order]]});
}

// Endpoint: Get Employees Sorted by Name
app.get('/employees/sort-by-name', async (req, res) => {
    try {
        let order = req.query.order;
        let employees = await getEmployeesSortedByName(order);
        if (employees.length === 0) {
            return res.status(404).json({message: "No employee found"});
        }
        let employeesData = [];
        for (let employee of employees) {
            employeesData.push(await getEmployeeDetails(employee));
        }
        return res.status(200).json({employees: employeesData});
    } catch (error) {
        res.status(500).json({ message: 'Error while getting employees.', error: error.message });
    }
});

// Function to add new employee
async function addEmployee(employeeData) {
    let newEmployee = await employee.create({
        name: employeeData.name,
        email: employeeData.email,
    })

    await employeeDepartment.create({
        employeeId: newEmployee.id,
        departmentId: employeeData.departmentId,
    })

    await employeeRole.create({
        employeeId: newEmployee.id,
        roleId: employeeData.roleId,
    })

    return newEmployee;
}

// Endpoint: Add a New Employee
app.post('/employees/new', async (req, res) => {
    try {
        let employeeData = req.body;
        let newEmployee = await addEmployee(employeeData);
        let newEmployeeData = await getEmployeeDetails(newEmployee);
        return res.status(201).json(newEmployeeData);
    } catch (error) {
        res.status(500).json({ message: 'Error while adding new employee.', error: error.message });
    }
});

// Function To Update Employee Details
async function updateEmployeeDetails(employeeId, updatedInfo) {
    let employeeDetails = await employee.findOne({ where: {id: employeeId}});
    if (employeeDetails === null) {
        return { message: "No employee found with ID: " + employeeId }
    }

    if (updatedInfo.name || updatedInfo.email) {
        employeeDetails.set(updatedInfo);
        await employeeDetails.save();
    }

    if (updatedInfo.roleId) {
        let roleDetails = await role.findOne({ where: {id: updatedInfo.roleId}});
        if (roleDetails === null) {
            return { message: "No role found with ID: " + updatedInfo.roleId }
        }
        await employeeRole.destroy({
            where: {employeeId},
        });
        await employeeRole.create({
            employeeId,
            roleId: updatedInfo.roleId,
        });
    }

    if (updatedInfo.departmentId) {
        let departmentDetails = await department.findOne({ where: {id: updatedInfo.departmentId}});
        if (departmentDetails === null) {
            return { message: "No department found with ID: " + updatedInfo.departmentId }
        }
        await employeeDepartment.destroy({
            where: {employeeId},
        });
        await employeeDepartment.create({
            employeeId,
            departmentId: updatedInfo.departmentId,
        });
    }

    let updatedEmployee = await employee.findOne({ where: {id: employeeId}});
    return await getEmployeeDetails(updatedEmployee);
}

// Endpoint: Update Employee Details
app.post('/employees/update/:id', async (req, res) => {
    let employeeId = parseInt(req.params.id);
    let updatedInfo = req.body;

    let response = await updateEmployeeDetails(employeeId, updatedInfo);
    return res.status(200).json(response);
})

// Function to delete an employee
async function deleteEmployee(employeeId) {
    let deletedEmployee = await employee.destroy({where: {id: employeeId}});
    if (deletedEmployee === 0) return {}

    await employeeDepartment.destroy({where: {employeeId: employeeId}});
    await employeeRole.destroy({where: {employeeId: employeeId}});

    return {message: 'Employee Deleted' };
}

// Endpoint: Delete an Employee
app.post('/employees/delete', async (req, res) => {
    try {
        let employeeId = parseInt(req.body.id);
        let response = await deleteEmployee(employeeId);
        if (!response.message) {
            return res.status(404).json({message: "Employee does not exist."});
        }
        return res.status(201).json({message: 'Employee with ID ' + employeeId + ' has been deleted.'})
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting', error: error.message });
    }
})

app.listen(3000, () => { console.log('Server running on port 3000')});