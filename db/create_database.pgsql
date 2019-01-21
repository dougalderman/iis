/* DROP DATABASE IF EXISTS IIS;
CREATE DATABASE IIS;
USE IIS; */

DROP TYPE IF EXISTS question_type CASCADE;
CREATE TYPE question_type AS ENUM (
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

 --Quizzes

DROP TABLE IF EXISTS Quizzes CASCADE;
CREATE TABLE Quizzes (
  id serial PRIMARY KEY,
  unique_name text NOT NULL UNIQUE,
  title text,
  description text,
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
  question_type question_type,
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
  questions_answered int NOT NULL,
  questions_answered_correctly int NOT NULL,
  datetime_quiz_completed timestamp with time zone NOT NULL,
  quiz_duration interval NOT NULL
);

DROP TABLE IF EXISTS QuizAnswers CASCADE;
CREATE TABLE QuizAnswers (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes NOT NULL,
  question_id int REFERENCES QuizQuestions NOT NULL,
  result_id int REFERENCES QuizResults NOT NULL,
  answered_correctly boolean NOT NULL,
  time_to_answer interval NOT NULL,
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
  real_end_answer real
);


--Surveys

DROP TABLE IF EXISTS Surveys CASCADE;
CREATE TABLE Surveys (
  id serial PRIMARY KEY,
  unique_name text NOT NULL UNIQUE,
  title text,
  description text,
  config jsonb
);

DROP TABLE IF EXISTS SurveyTemplates CASCADE;
CREATE TABLE SurveyTemplates (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

DROP TABLE IF EXISTS SurveyQuestions CASCADE;
CREATE TABLE SurveyQuestions (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  template_id int REFERENCES SurveyTemplates,
  text_question text,
  picture_question text,
  question_type question_type,
  options jsonb,
  integer_start_answer_range int,
  integer_end_answer_range int,
  real_start_answer_range real,
  real_end_answer_range real
);

DROP TABLE IF EXISTS SurveyResults CASCADE;
CREATE TABLE SurveyResults (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys NOT NULL,
  questions_answered int NOT NULL,
  datetime_survey_completed timestamp with time zone NOT NULL,
  survey_duration interval NOT NULL
 );

DROP TABLE IF EXISTS SurveyAnswers CASCADE;
CREATE TABLE SurveyAnswers (
  id serial PRIMARY KEY,
  survey_id int REFERENCES Surveys NOT NULL,
  question_id int REFERENCES SurveyQuestions NOT NULL,
  result_id int REFERENCES SurveyResults NOT NULL,
  time_to_answer interval NOT NULL,
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
  real_end_answer real
);


--Webpages
DROP TABLE IF EXISTS Webpages CASCADE;
CREATE TABLE Webpages (
  id serial PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  survey_id int REFERENCES Surveys,
  title text NOT NULL UNIQUE
);
