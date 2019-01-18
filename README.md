# Angular Interactive Informational Site (IIS)

### Jan. 2019--3 quiz question types are implemented for Admin and Take Quiz.

See Demo Version at xxx

## Description

Information sites like Wikipedia typically don't utilize the full interactive capability of the Web. Wikipedia has mainly text and images, which is what you can also find in a paper book. It also has a lot of hyperlinks, and a few multimedia elements like animations and audio files. Many other informational sites have similar content.

A quiz can add to an informational site by providing feedback to the user on how well he has read and understood the material. It is a more active method of learning than simply reading the material. It can also provide feedback to the site owner on how well information in the site is communicated.

A survey can provide feedback to the site owner on various aspects related to the information in the site. It is also another way for the user to play an active role in understanding the material.

From a development persepective, quizzes and surveys are very similar. They both ask a series of questions, and provide a way for the user to answer the questions. This similarity reduces development time. The big difference is that a quiz question has a correct answer, while a survey doesn't. There are also some differences in question types. 

The purpose of this project is to use Angular and a NodeJS server, along with PostgreSQL database, to allow for a quick and efficient site to create quizzes and surveys that will add interactivity to an informational site. 

This site includes a template-based quiz and survey administration system that allows for quizzes and surveys to be created, modified, and added as links to a webpage on a site. A Wikipedia page is used as an example, with Take Quiz and Take Survey links added to the header. 


## Getting Started
### Prerequisites
 - PostgreSQL database.
 - Server with Node.js and npm installed.

### Installation
1. git clone https://github.com/dougalderman/iis.git
2. npm install
3. Create a .env file in the project root folder with the following format:
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
4. npm run [one or more of the build scripts in package.json]
5. npm run server.

## Usage
### Demo Insructions

1. Point the browser to [url]/admin to get the Admin Main Menu.
2. Select Create/Modify Quiz Template.
3. Create a new quiz template or modify an existing one by changing the Template name.
4. Go back to the Admin Main Menu. Select Activate Quiz/Survey Template.
5. Follow the instructions on the page to activate a quiz template for the Wikipedia page and/or one of the two sample pages.
6. Point the browser to the home page to go to the Wikipedia Fibromyalgia page, or put in /sample-page-one or /sample-page/two after the URL to go to one of the sample pages. 
7. Click the "Take Quiz" link on the Wikipedia page header, or on one of the sample pages. 
8. Take the quiz.

## Engineering Overview

### Database Tables

### Admin Section
#### Create/Modify Quiz Template
#### Activate Quiz/Survey Template

### Take Quiz

Templates are the building blocks of surveys. You can build a new template from scratch, or modify an existing one.

![Create Modify Template Page](https://github.com/dougalderman/surveys/blob/master/readme_images/Create_Modify_Template.jpg)

The select template drop down box integrates Materialize CSS framework and Angular, using ng-options to display a variable number of template options.

![Select Template Drop Down Box](https://github.com/dougalderman/surveys/blob/master/readme_images/Create_Modify_Template4.jpg)

```html
<div class="container">
        
        <p>Select Template:</p>
        <div class="row">
            <div class="input-field col s6">
                <select id="choose_template" ng-options="templ.name for templ in templates" ng-model="selectedTemplate" ng-change="loadSelectedTemplate()">
                    <option value="" disabled selected>Select Template</option>
                </select>
            </div>
        </div>
```

Templates are loaded in the resolve of the createModifyTemplate state in app.js, calling a service function that does an http request to one of the 29 server endpoints:

```javascript
 resolve: {
            templates: function(templateSurveyService, $state) {
                return templateSurveyService.getAllTemplateNames()
                .then(function( response ) {
                     return response.data;
                })
                .catch(function(err) {
                     // For any error, send them back to admin login screen.     
                    console.error('err = ', err);
                    if (err.status === 403) { //  if unauthorized
                        $state.go('student')
                    }
                    else { 
                        $state.go('login', {
                            successRedirect: 'createModifyTemplate'
                        });
                    }
                });
            }
        }         
```

## License
This code is open source under the MIT license. See license.txt in the project root folder.
