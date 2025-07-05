# Angular Interactive Informational Site

## Description

Information sites like Wikipedia typically don't utilize the full interactive capability of the Web. Most content on Wikipedia consists of text and images, which is what you can also find in a paper book. Wikipedia also has a lot of hyperlinks, and a few multimedia elements like animations and audio files. Many other informational sites have similar content.

A quiz can add to an informational site by providing feedback to the user on how well he has read and understood the material. It is a more active method of learning than simply reading the material. It can also provide feedback to the site owner on how well information in the site is communicated.

A survey can provide feedback to the site owner on various aspects related to the information in the site. It is another way for the user to play an active role in understanding the material.

From a development persepective, quizzes and surveys are very similar. They both ask a series of questions, and provide a way for the user to answer the questions. This similarity reduces development time. The big difference is that a quiz question has a correct answer, while a survey doesn't. There are also some differences in common question types. 

The purpose of this project is to use Angular v.19 and a Node.js v.22 server, along with PostgreSQL v.17 database, to allow for a quick and efficient way to create quizzes and surveys that will add interactivity to an informational site. 

This site includes a template-based quiz and survey administration system that allows for quizzes and surveys to be created, modified, and added as links to a webpage on a site. A Wikipedia page is used as an example, with Take Quiz and Take Survey links added to the header. 


## Getting Started
### Prerequisites
 - System with Node.js v22+, npm v10+, and PostgreSQL v17+ database installed.

### Installation
1. git clone https://github.com/dougalderman/iis.git
2. npm install
3. Run db/create_database.pgsql script to create DB tables.
4. Create a .env file in the project root folder with the following format:
    ```
    PORT= [port #]
    APP_DIR = '/../public'
    SECRET = [some random sequence of characters]
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

1. Select Admin Main Menu from the home page menu (or point the browser to [url]/admin).
2. Select Create/Modify Quiz Template.
3. (First time) create a new quiz template by entering a name and description, and creating quiz questions. (Subsequent times) either select an existing template to modify, or create a new quiz template by changing the template name.
4. Go back to the Admin Main Menu, and select Create/Modify Survey Template.
5. (First time) create a new quiz template by entering a name and description, and creating quiz questions. (Subsequent times) either select an existing template to modify, or create a new quiz template by changing the template name.
6. Go back to the Admin Main Menu, and select Activate Quiz/Survey Template.
7. Follow the instructions on the page to activate a quiz and/or survey template for the Wikipedia page and/or one of the two sample pages.
8. Go back to the home page menu, and select a page you activated a quiz and/or survey for in the previous step. 
9. Click the "Take Quiz" or "Take Survey" link on the Wikipedia page header, or on one of the sample pages. 
10. Take the quiz or survey.

## Engineering Overview
### Database Tables

The database table setup script can be found in db/create_database.pgsql. There is a large number of possible quiz question types, with 3 implemented in this initial code release: textQuestionMultipleChoice, textQuestionShortAnswer, and textQuestionBoolean. The QuizTemplates table is updated from the Create/Modify Quiz Template Screen. It has templates of quiz questions which may or may not be used in an actual quiz. The Quizzes table consists of actual quizzes which at one time have been linked from a Webpage. QuizResults is updated when the user takes a quiz. QuizQuestions has foreign keys referencing the Quizzes and QuizTemplates tables. A row may have one or both foreign keys set. If neither key is set (which happens after deleting a template), the question is useless, and a timed server scripts deletes such questions from the table. QuizAnswers, like QuizResults is updated when a user takes a quiz. It has foreign keys referencing Quizzes, QuizQuestions, and QuizResults. A question in QuizQuestions can have multiple answers from multiple times the same quiz was taken.

Database tables for surveys are very similar to those for quizzes. The big difference is that survey questions have no correct answers. 4 survey question types are implemented in this initial code release:  textQuestionMultipleChoice, textQuestionShortAnswer, textQuestionBoolean, and textQuestionNumericAnswer.

### Node.js Overview
The Node.js server code is written in TypeScript, and is located in the server folder. The lightweight index.js starts an Express session and calls TimedTasksController and EndpointsController. TimedTasksController is used to periodically delete unused quiz and survey questions. EndpointsController manages the Quiz, Survey, and Webpages endpoints. Controllers for the endpoints are located in the controllers folder.

### Angular Overview
[Reactive forms](https://angular.io/guide/reactive-forms) are used exclusively in this project. The form models are stored in the models/forms folder. Data models for DB API calls are stored in models/quizzes, models/surveys, and models/webpages. Standalone components are used in this project. The public/src/app folder has the AppComponent, along with a separate app.routes.ts to handle routing. The admin folder has the admin.routes.ts, along with all the admin components. All routes are lazy loaded. The components folder includes all non-admin components. Constants, services, utilities, and (Reactive Form) validators are separated out into their own folders. Bootstrap is used for styling, ng-bootstrap for modals and tooltips, and ng5-slider for the Take Survey slider.

### Admin Section
The admin section is a separate component with its own routing. The AdminHomeComponent has a menu which provides options for Create/Modify Quiz Template, Create/Modify Survey Template, and Activate Quiz/Survey Template.

#### Create/Modify Quiz Template
Before attaching a quiz to a webpage, you need to create a quiz template. You can build a new template from scratch, or modify an existing one, using the Create/Modify Quiz Template screen.

![Create Modify Quiz Template Page](https://github.com/dougalderman/iis/blob/main/readme_images/Create_Modify_Quiz_Template.jpg)

The component reads all templates from QuizTemplates on initialization. It listens for changes to the Select Template menu or to the Name field. It has methods to handle if the user selects Add Question, deletes a question, clicks the Clear (clear screen) or Delete (delete template) buttons, or clicks Save Template. Save Template first saves the template information to the QuizTemplates table, then deletes quiz questions associated with the template (if they exist), and saves quiz questions as new rows in the QuizQuestions table.

Individual quiz question handling is done via a child component, TemplateQuizQuestionComponent. It handles the 3 supported quiz question types: multiple choice, short answer, and boolean. It has methods for adding and deleting multiple choice options or short answer correct answers. 

![Create Modify Quiz Template Quiz Questions](https://github.com/dougalderman/iis/blob/main/readme_images/Create_Modify_Quiz_Template_Quiz_Questions.jpg)

#### Create/Modify Survey Template
Create/Modify Survey template is very similar to Create/Modify Quiz template, with the difference that there are no correct answers for surveys. Surveys have an additional supported question type: textQuestionNumericAnswer.

#### Activate Quiz/Survey Template
After creating or modifying quiz and survey templates, the next step is to activate them by associating them with a webpage. Technically, this will update the row on the Webpages table corresponding to the page you want to link a quiz and/or survey to. It will also insert a row in the Quizzes or Surveys table with a new quiz or survey, and either update or add new records in QuizQuestions or SurveyQuestions that have a foreign key corresponding to the new quiz or survey. 

![Activate Quiz/Survey Template](https://github.com/dougalderman/iis/blob/main/readme_images/Activate_Quiz_Survey_Template.jpg)

On initialization, Activate Quiz/Survey Template gets a list of active routes from the constant appRoutes, and syncs this list with the Webpages table. It also gets all quiz and survey templates. The user follows a simple step-by-step approach. After selecting a webpage, she then selects a quiz template. If a quiz has already been associated with that webpage, it will default to "Keep the Same Quiz". If no quiz has been selected, it will default to "No Quiz". The user can either keep the default, or choose a different template. Unique Name, Title (which is visible to the quiz taker) and Description are text input fields that can be modified. The only configuration option is Percent Great Job, which is the percent of questions the user needs to answer correctly to see the "Great Job" Giphy (as opposed to the "OK Job" Giphy). The Preview button provides a way to see all the disabled quiz questions, multiple choice options, and correct answers. This makes use of a child component TemplateQuizQuestionDisabledComponent, which is a child class of TemplateQuizQuestionComponent.

Selecting a survey template is virtually the same user experience as selecting a quiz, with the exception of no Percent Great Job option. After selecting a survey, the user clicks the Activate button to save the changes. The activate() method updates Webpages, Quizzes, Surveys, QuizQuestions, and SurveyQuestions tables. The quiz and/or survey will now be available as links from the webpage.

### Take Quiz
Each webpage has code that queries the Webpages table whether or not a quiz_id is associated with the webpage. If there is a quiz_id, then the "Take Quiz" link will become visible on the page. When the user clicks on the "Take Quiz" link, the router calls the TakeQuizComponent. On initialization, TakeQuizComponent queries the Quizzes and QuizQuestions tables, randomizes question and multiple choice option order, and adds all the quiz questions to the form. It sends the form and the current question index to a child component TakeQuizQuestionComponent, which handles individual questions. Once the user submits the answer to a question, immediate feedback is given.

![Take Quiz Question Feedback](https://github.com/dougalderman/iis/blob/main/readme_images/Take_Quiz_Question_Feedback.jpg)

After answering all the questions, a results page that is a div element within the TakeQuizComponent template is shown. This page provides feedback to the user on how many questions he correctly answered, the total time to take the quiz, and a Giphy with an animation that is targeted based on how well he did. A button that returns to the calling page is included.

![Take Quiz Results](https://github.com/dougalderman/iis/blob/main/readme_images/Take_Quiz_Results.jpg)

### Take Survey
Take Survey is very similar to Take Quiz, with the difference that no feedback is given after each question or at the end of the survey, as there are no correct answers, and no percent correct. A slider is used to handle user input for a numeric answer. Question order is randomized, but not multiple choice option order.

### Security Considerations
In production, the admin pages and endpoints will need to be login secured. In Angular, you secure a routed page by using [route guards](https://angular.io/guide/router#milestone-5-route-guards). The guard will check to see if an authenticated user is signed on, and if not, will redirect to a login page. On the server side, middleware needs to be added to all admin endpoints to confirm that an authenticated user is signed in. If not, the user will be redirected to the login page.

The Take Quiz and Take Survey pages don't need to be login protected. Not requiring login and signup will allow a larger number of people to make use of these features. [reCAPTCHA](https://www.google.com/recaptcha/intro/v3.html) should be used to prevent robots from taking quizzes and surveys.

### Responsive Web Design
Take Quiz and Take Survey components were developed to look good on mobile devices. The Admin module components were intended for use on a large screen device only.

### Reporting
This app does not include any reporting tools. Standard SQL queries and reports can be used to get information from the database.

## License
This code is open source under the MIT license. See license.txt in the project root folder.
