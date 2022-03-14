const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
//code to prompt user about employee's information

const teamMembers = [];
const render = require("./lib/htmlRenderer");
async function init() {
    //ask teamSize to determine the number of employees in the team
    let teamSize;
    await inquirer.prompt(
        {
            type: "number",
            name: "teamSize",
            message: ("How many team members on your project?")
        }
    )

        .then(answers => {
            teamSize = answers.teamSize;
        })
    //prompt number for employee information for each member in the  team size
    for (i = 1; i <= teamSize; i++) {
        let name;
        let id;
        let role;
        let email;

        //prompt employee data for each team member
        await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: `What is the name of team member number (${i})?`
            },
            {
                type: "input",
                name: "id",
                message: `What is the id of team member number (${i})?`
            },
            {
                type: "email",
                name: "email",
                message: `What is the email address of team member number (${i})?`
            },
            {
                type: "list",
                name: "role",
                message: `What is the role of team member number (${i})?`,
                choices: ["manager", "engineer", "intern"]
            },
            //manager, engineer and intern need different data, so ask per employee role
            {
                type: "input",
                name: "officeNumber",
                message: "What is manager's office number?",
                when: (answers) => answers.role === "manager"
            },
            {
                type: "input",
                name: "github",
                message: "What is engineer's GitHub name?",
                when: (answers) => answers.role === "engineer"
            },
            {
                type: "input",
                name: "school",
                message: "What is intern's school?",
                when: (answers) => answers.role === "intern"
            }

        ]).then(response => {
            try {
                //take response data and build the team members with their roles  
                id = response.id;
                name = response.name;
                email = response.email;
                role = response.role;

                switch (role) {
                    case "manager": officeNumber = response.officeNumber;
                        const manager = new Manager(
                           
                            name,
                            id,
                            email,
                            response.officeNumber
                        );
                        teamMembers.push(manager);
                        console.log(manager);
                        renderhtml();
                        break;
                    case "engineer": github = response.github;
                        const engineer = new Engineer(
                            
                            name,
                            id,
                            email,
                            response.github
                        );
                        teamMembers.push(engineer);
                        console.log(engineer);
                        renderhtml();
                        break;
                    case "intern": school = response.school;
                        const intern = new Intern(
                            
                            name,
                            id,
                            email,
                            response.school
                        );
                        teamMembers.push(intern);
                        console.log(intern);
                        renderhtml();
                        break;
                }

            }
            catch (err) {
                console.log(err);
            }
        })

        console.log(teamMembers);
    }
}
function renderhtml() {

    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");

} //initiate the function to build the team with the user prompts
init();


