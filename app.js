const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./lib/htmlRenderer');

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const teamList = [];
console.log('testing');

// ***Manager Questions
const ManagerQs = [
    {
        type: 'input',
        message: 'Name:',
        name: 'name',
        default: 'manager name',
        validate: async (name) => {
            if (name == '') {
                return 'Please enter a name.';
            }
            return true;
        }
    },
    {
        type: 'input',
        message: 'Id:',
        name: 'id',
        default: 1,
        validate: async (id) => {
            valid = /^\d*$/.test(id);
            if (valid) {
                return true;
            } else {
                return 'A number is required for an id.';
            }
        }
    },
    {
        type: 'input',
        message: 'Email address:',
        name: 'email',
        default: 'manager@email.com',
        validate: async (email) => {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (valid) {
                return true;
            } else {
                return 'Please enter a valid email';
            }
        }
    },
    {
        type: 'input',
        message: 'Office Number:',
        name: 'office',
        default: '1100a',
        validate: async (office) => {
            if (office == '') {
                return 'Please enter an Office Number.';
            }
            return true;
        }
    },
    {
        type: 'confirm',
        message: 'More Empolyees?',
        name: 'more',
    },
]

// ***Employee Questions
const employeeQs = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter employee name:',
        default: 'employee name',
        validate: async (name) => {
            if (name == '') {
                return 'Please enter a name.';
            }
            return true;
        }
    },
    {
        type: 'input',
        message: 'Id:',
        name: 'id',
        default: 1,
        validate: async (id) => {
            valid = /^\d*$/.test(id);
            if (valid) {
                return true;
            } else {
                return 'A number is required for an id.';
            }
        }
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter employee email:',
        default: 'employee@email.com',
        validate: async (email) => {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (valid) {
                return true;
            } else {
                return 'Please enter a valid email';
            }
        }
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is their role?',
        choices: ['Engineer', 'Intern']
    },
    {
        when: input => {
            return input.role == 'Engineer'
        },
        type: 'input',
        name: 'github',
        message: 'Enter their github username:',
        default: 'gitHubUser',
        validate: async (github) => {
            if (github == '' || /\s/.test(github)) {
                return 'Please enter a valid GitHub username';
            }
            return true;
        }
    },
    {
        when: input => {
            return input.role == 'Intern'
        },
        type: 'input',
        name: 'school',
        message: 'Enter their school name:',
        default: 'zoobie',
        validate: async (school) => {
            if (school == '') {
                return 'Please enter a school.';
            }
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'more',
        message: 'More Empolyees?',
    },
]

function init() {
    askManagerQs()

}

function askManagerQs() {
    inquirer.prompt(ManagerQs).then(managerInfo => {
        let teamManager =
            new Manager(managerInfo.name,
                managerInfo.id,
                managerInfo.email,
                managerInfo.office);
        teamList.push(teamManager);
        if (managerInfo.more) { buildTeam() }
        // ... ask more questions
        else { html() }
        // console.log(render(teamList));
        // console.log(teamList);
        // html();
    })
}

function buildTeam() {
    inquirer.prompt(employeeQs).then(employeeInfo => {
        if (employeeInfo.role == 'Engineer') {
            var newMember = new Engineer(employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.github);
        } else {
            var newMember = new Intern(employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.school);
        }
        teamList.push(newMember);
        if (employeeInfo.more) {
            buildTeam();
        } else {
            html();
        }
    })
}

init()

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
function html() {
    fs.writeFile(outputPath, render(teamList), err => {
        if (err) {
            return console.error(err);
        }
        console.log('Congrats, your HTML has been rendered')
    })
}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
