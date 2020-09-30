const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./lib/htmlRenderer');

const teamList = [];

// variable for auto generating employee id
let currentId = 1;

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
        message: 'Id (if nothing is it will be automatically generated):',
        name: 'id',
        // default: currentId,
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
            return input.role == 'Engineer';
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
            return input.role == 'Intern';
        },
        type: 'input',
        name: 'school',
        message: 'Enter their school name:',
        default: 'dumb zoobie',
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
        default: false,
    },
]

//  *** Initiates the app
init()

function askManagerQs() {
    inquirer.prompt(ManagerQs).then(managerInfo => {
        // *** adds manager info to teamList
        let teamManager =
            new Manager(managerInfo.name,
                managerInfo.id,
                managerInfo.email,
                managerInfo.office);
        teamList.push(teamManager);
        currentId++
        // *** if answer yes to add more employees else build html
        if (managerInfo.more) { buildTeam() }
        else { buildHtml() }
        // console.log(render(teamList));
        // console.log(teamList);
    })
        .catch(err => {
            console.error(err);
        })
}

function buildTeam() {
    inquirer.prompt(employeeQs).then(employeeInfo => {
        if (employeeInfo.role === 'Engineer') {
            var newMember = new Engineer(employeeInfo.name, employeeInfo.id || currentId, employeeInfo.email, employeeInfo.github);
        } else {
            var newMember = new Intern(employeeInfo.name, employeeInfo.id || currentId, employeeInfo.email, employeeInfo.school);
        }
        teamList.push(newMember);
        currentId++;
        if (employeeInfo.more) {
            buildTeam();
        } else {
            buildHtml();
        }
    })
        .catch(err => {
            console.error(err);
        })
}

function init() {
    askManagerQs()
}

function buildHtml() {
    fs.writeFile(outputPath, render(teamList), err => {
        if (err) {
            return console.error(err);
        }
        console.log('Congrats, your HTML has been rendered')
    })
}
