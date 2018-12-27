/* DROP DATABASE IF EXISTS IIS;
CREATE DATABASE IIS;
USE IIS; */

--Quizzes
DROP TYPE IF EXISTS quiz_question_type CASCADE;
CREATE TYPE quiz_question_type AS ENUM (
  'textQuestionMultipleChoice',
  'textQuestionShortAnswer',
  'textQuestionBoolean',
  'textQuestionDateAnswer',
  'textQuestionDateRangeAnswer',
  'textQuestionNumericAnswer',
  'textQuestionNumericRangeAnswer',
  'textQuestionPictureAnswer',
  'pictureQuestionMultipleChoice',
  'pictureQuestionShortAnswer',
  'pictureQuestionBoolean',
  'pictureQuestionLocationAnswer',
  'pictureQuestionDateAnswer',
  'picatureQuestionDateRangeAnswer',
  'pictureQuestionNumericAnswer',
  'pictureQuestionNumericRangeAnswer'
 );

DROP TABLE IF EXISTS Quizzes CASCADE;
CREATE TABLE Quizzes (
  id serial PRIMARY KEY,
  brief_name text,
  title text NOT NULL UNIQUE,
  config jsonb
);

DROP TABLE IF EXISTS QuizTemplates CASCADE;
CREATE TABLE QuizTemplates (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

DROP TABLE IF EXISTS QuizQuestions CASCADE;
CREATE TABLE QuizQuestions (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  template_id int REFERENCES QuizTemplates,
  text_question text,
  picture_question text,
  question_type quiz_question_type,
  options jsonb,
  boolean_correct_answer boolean,
  correct_answer_array text[],
  location_correct_answers point[],
  date_correct_answer date,
  date_start_correct_answer date,
  date_end_correct_answer date,
  integer_correct_answer int,
  integer_start_correct_answer int,
  integer_end_correct_answer int,
  real_correct_answer real,
  real_start_correct_answer real,
  real_end_correct_answer real
);

DROP TABLE IF EXISTS QuizResults CASCADE;
CREATE TABLE QuizResults (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes NOT NULL,
  date_taken date NOT NULL,
  quiz_duration interval
);

DROP TABLE IF EXISTS QuizAnswers CASCADE;
CREATE TABLE QuizAnswers (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes NOT NULL,
  question_id int REFERENCES QuizQuestions NOT NULL,
  results_id int REFERENCES QuizResults NOT NULL,
  text_answer text,
  boolean_answer boolean,
  date_answer date,
  date_start_answer date,
  date_end_answer date,
  location_answers point[],
  integer_answer int,
  integer_start_answer int,
  integer_end_answer int,
  real_answer real,
  real_start_answer real,
  real_end_answer real,
  answered_correctly boolean,
  time_to_answer interval
);


--Surveys
DROP TYPE IF EXISTS survey_question_type CASCADE;
CREATE TYPE survey_question_type AS ENUM (
  'textMultipleChoice',
  'textShortAnswer',
  'textBoolean'
  'textDateAnswer',
  'textDateRangeAnswer',
  'pictureQuestionMultipleChoice',
  'pictureQuestionShortAnswer',
  'pictureQuestionBoolean',
  'pictureQuestionLocationAnswer',
  'pictureQuestionDateAnswer',
  'picatureQuestionDateRangeAnswer',
  'pictureAnswer',
  'numericAnswer'
 );

DROP TYPE IF EXISTS survey_multiple_choice_options CASCADE;
CREATE TYPE survey_multiple_choice_options AS (
  option_id  text,
  text_answer  text,
  picture_answer text
);

DROP TABLE IF EXISTS Surveys CASCADE;
CREATE TABLE Surveys (
  id serial PRIMARY KEY,
  brief_name text,
  title text,
  config jsonb
);

DROP TABLE IF EXISTS SurveyTemplates CASCADE;
CREATE TABLE SurveyTemplates (
  id serial PRIMARY KEY,
  name text,
  description text
);

DROP TABLE IF EXISTS SurveyQuestions CASCADE;
CREATE TABLE SurveyQuestions (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  template_id int REFERENCES SurveyTemplates,
  text_question text,
  picture_question text,
  question_type quiz_question_type,
  options jsonb
);

DROP TABLE IF EXISTS SurveyResults CASCADE;
CREATE TABLE SurveyResults (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  date_taken date,
  survey_duration interval
);

DROP TABLE IF EXISTS SurveyAnswers CASCADE;
CREATE TABLE SurveyAnswers (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  question_id int REFERENCES SurveyQuestions,
  results_id int REFERENCES SurveyResults,
  text_answer text,
  boolean_answer boolean,
  date_answer date,
  date_start_answer date,
  date_end_answer date,
  location_answers point[],
  integer_answer int,
  integer_start_answer int,
  integer_end_answer int,
  real_answer real,
  real_start_answer real,
  real_end_answer real,
  time_to_answer interval
);


--Webpages
DROP TABLE IF EXISTS Webpages CASCADE;
CREATE TABLE Webpages (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  survey_id int REFERENCES Surveys,
  title text NOT NULL UNIQUE
);


--Admin Users
DROP TABLE IF EXISTS AdminUsers CASCADE;
CREATE TABLE AdminUsers (
  id serial PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  password text
);
