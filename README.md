# Angular Interactive Informational Site (IIS)

### Jan. 2019--3 quiz question types are implemented.

See Demo Version at xxx

## Description

Information sites like Wikipedia typically don't utilize the full interactive capability of the Web. Most content on Wikipedia consists of text and images, which is what you can also find in a paper book. Wikipedia also has a lot of hyperlinks, and a few multimedia elements like animations and audio files. Many other informational sites have similar content.

A quiz can add to an informational site by providing feedback to the user on how well he has read and understood the material. It is a more active method of learning than simply reading the material. It can also provide feedback to the site owner on how well information in the site is communicated.

A survey can provide feedback to the site owner on various aspects related to the information in the site. It is also another way for the user to play an active role in understanding the material.

From a development persepective, quizzes and surveys are very similar. They both ask a series of questions, and provide a way for the user to answer the questions. This similarity reduces development time. The big difference is that a quiz question has a correct answer, while a survey doesn't. There are also some differences in common question types. 

The purpose of this project is to use Angular v.7 and a Node.js server, along with PostgreSQL database, to allow for a quick and efficient site to create quizzes and surveys that will add interactivity to an informational site. 

This site includes a template-based quiz and survey administration system that allows for quizzes and surveys to be created, modified, and added as links to a webpage on a site. A Wikipedia page is used as an example, with Take Quiz and Take Survey links added to the header. 


## Getting Started
### Prerequisites
 - PostgreSQL database.
 - Server with Node.js and npm installed.

### Installation
1. git clone https://github.com/dougalderman/iis.git
2. npm install
3. Run db/create_database.pgsql script to create DB tables.
4. Create a .env file in the project root folder with the following format:
    ```
    NODE_ENV = ['development' or 'production']
    PORT= [port #]
    APP_DIR = ['/../public' for development or '/../dist' for production]
    SECRET = [some random number and letter combination]
    PGHOST= [All PG* parameters are from the PostgreSQL database configuration]
    PGPORT=
    PGDATABASE=
    PGUSER=
    PGPASSWORD=
    ```
5. npm run [one or more of the build scripts in package.json]
6. npm run server.

## Usage
### Demo Insructions

1. Point the browser to [url]/admin to get the Admin Main Menu.
2. Select Create/Modify Quiz Template.
3. Create a new quiz template or modify an existing one by changing the Template name.
4. Go back to the Admin Main Menu. Select Activate Quiz/Survey Template.
5. Follow the instructions on the page to activate a quiz template for the Wikipedia page and/or one of the two sample pages.
6. Point the browser to the home page to go to the Wikipedia Fibromyalgia page, or put in /sample-page-one or /sample-page-two after the base URL to go to one of the sample pages. 
7. Click the "Take Quiz" link on the Wikipedia page header, or on one of the sample pages. 
8. Take the quiz.

## Engineering Overview

### Database Tables

The database table setup script can be found in db/create_database.pgsql. There is a large number of possible quiz question types, with 3 implemented in this initial code release: textQuestionMultipleChoice, textQuestionShortAnswer, and textQuestionBoolean. The QuizTemplates table is updated from the Create/Modify Quiz Template Screen. It has templates of quiz questions which may or may not be used in an actual quiz. The Quizzes table consists of actual quizzes which at one time have been linked from a Webpage using the Active Quiz/Survey Template screen. QuizResults is updated when the user takes a quiz. QuizQuestions has foreign keys referencing the Quizzes and QuizTemplates tables. A row may have one or both foreign keys set. If neither key is set, the question is useless, and a timed server scripts deletes such questions from the table. QuizAnswers, like QuizResults is updated when a user takes a quiz. It has foreign keys referencing Quizzes, QuizQuestions, and QuizResults. A question in QuizQuestions can have multiple answers from multiple times the same quiz can be taken.  


### Node.js Overview
The Node.js server code is written in TypeScript, and is located in the server folder. The lightweight index.js starts an Express session and calls TimedTasksController and EndpointsController. TimedTasksController is used to periodically delete unused quiz questions. EndpointsController manages the Quiz, Survey, and Webpages endpoints. Controllers for the endpoints are located in the controllers folder.

### Angular Overview
[Reactive forms](https://angular.io/guide/reactive-forms) are used exclusively in this project. The form models are stored in the models/forms folder. Data models for DB API calls are stored in models/quizzes, models/surveys, and models/webpages. The public/src/app folder has the AppModule and AppComponent, along with a separate AppRoutingModule to handle routing. The admin folder has the AdminModule and AdminRoutingModule, along with all admin components. The components folder includes all non-admin components. Constants, services, utitities, and (Reactive Form) validators are separated out into their own folders. Bootstrap is used for styling and ng-bootstrap for modals and tooltips.

### Admin Section
The admin section is a separate component with its own routing module. The AdminHomeComponent has a menu which provides options for Create/Modify Quiz Template, Create/Modify Survey Template, and Activate Quiz/Survey Template.

#### Create/Modify Quiz Template
Before attaching a quiz to a webpage, you need to create a quiz template. You can build a new template from scratch, or modify an existing one, using the Create/Modify Quiz Template screen.

![Create Modify Quiz Template Page](https://github.com/dougalderman/iis/blob/master/readme_images/Create_Modify_Quiz_Template.jpg)

The component reads all templates from QuizTemplates upon initialization. It listens for changes to the Select Template menu or to the Name field. It has methods to handle if the user selects Add Question, deletes a question, clicks the Clear (clear screen) or Delete (delete template) buttons, or clicks Save Template. Save Template first saves the template information to the QuizTemplates table, then deletes quiz questions associated with the template (if they exist), and saves quiz questions as new rows in the QuizQuestions table.

Individual quiz question handling is done via a child component, TemplateQuizQuestionComponent. It handles the 3 supported quiz question types: multiple choice, short answer, and boolean. It has methods for adding and deleting multiple choice options or short answer correct answers. 

![Create Modify Quiz Template Quiz Questions](https://github.com/dougalderman/iis/blob/master/readme_images/Create_Modify_Quiz_Template_Quiz_Questions.jpg)

#### Activate Quiz/Survey Template

### Take Quiz

### Security Considerations

## License
This code is open source under the MIT license. See license.txt in the project root folder.
