const fs = require("fs");
const inquirer = require("inquirer");
const Handlebars = require("handlebars");

process.env.EDITOR = 'nano';

const rawTemplate = fs.readFileSync(`${__dirname}/template.md`, "utf8");
const handlebarsTemplate = Handlebars.compile(rawTemplate);

const requiredParameter = function (done, input, errorMessageIfEmpty) {
  if (!input) {
    done(errorMessageIfEmpty);
    return;
  }
  done(null, true);
};

const questions = [
  {
    type: "input",
    name: "projectTitle",
    message: "What is the name of your project?",
    validate: function(input) {
      const done = this.async();
      return requiredParameter(done, input, "A project title is required.");
    }
  },
  {
    type: "editor",
    name: "description",
    message: "Please describe your project.",
    validate: function(input) {
      const done = this.async();
      return requiredParameter(done, input, "A project description is required.");
    }
  },
  {
    type: "editor",
    name: "installationInstruction",
    message: "Please give installation instructions if any.",
  },
  {
    type: "editor",
    name: "usageInstructions",
    message: "Please include how to use this app.",
    validate: function(input) {
      const done = this.async();
      return requiredParameter(done, input, "Usage instructions are required.");
    }
  },
  {
    type: "editor",
    name: "credits",
    message: "Please list all contributors including self.",
    validate: function(input) {
      const done = this.async();
      return requiredParameter(done, input, "The contributors section is required.");
    }
  },
  {
    type: "list",
    name: "license",
    message: "What is the license for this project?",
    choices: ["Apache 2", "MIT", "GPL", "BSD", "Unlicensed", "Other"],
    validate: function(input) {
      const done = this.async();
      return requiredParameter(done, input, "A license section is required.");
    }
  },
  {
    type: "editor",
    name: "contribute",
    message: "Do you want any contributions and if so, what are the guidelines?",
  },
  {
    type: "editor",
    name: "test",
    message: "Please provide examples of tests for you app.",
  },
  {
    type: "input",
    name: "support",
    message: "Please include a link to direct others that may have questions.",
    validate: function(input) {
      const done = this.async();
      if (!input) {
        done("Required but not provided");
        return;
      }
      if (!isValidHttpUrl(input)) {
        done("Please provide valid URL.")
      }
      done(null, true);
    }
  },


];

function writeToFile(filename, data) {
  fs.writeFileSync(filename, data);
}

function init() {
  inquirer.prompt(questions).then((response) => {
    const compiledTemplate = handlebarsTemplate({
      projectTitle: response.projectTitle,
      description: response.description,
      installationInstruction: response.installationInstruction,
      usageInstructions: response.usageInstructions,
      credits: response.credits,
      license: response.license,
      contribute: response.contribute,
      test: response.test,
      support: response.support,
    });
    writeToFile("./generated-readme.md", compiledTemplate);
  });
}

init();


function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}