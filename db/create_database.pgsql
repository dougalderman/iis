/* DROP DATABASE IF EXISTS IIS;
CREATE DATABASE IIS;
USE IIS; */

--Quizzes
DROP TYPE IF EXISTS quiz_question_type CASCADE;
CREATE TYPE quiz_question_type AS ENUM (
  'textMultipleChoice',
  'textShortAnswer',
  'textBoolean'
  'textDateAnswer',
  'textDateRangeAnswer',
  'textNumericAnswer',
  'pictureQuestionMultipleChoice',
  'pictureQuestionShortAnswer',
  'pictureQuestionBoolean',
  'pictureQuestionLocationAnswer',
  'pictureQuestionDateAnswer',
  'picatureQuestionDateRangeAnswer',
  'pictureQuestionNumericAnswer',
  'pictureAnswer'
 );

DROP TYPE IF EXISTS quiz_multiple_choice_options CASCADE;
CREATE TYPE quiz_multiple_choice_options AS (
   option_id  text,
   text_answer  text,
   picture_answer text
 );

DROP TABLE IF EXISTS Quizzes CASCADE;
CREATE TABLE Quizzes (
  id int PRIMARY KEY,
  brief_name text,
  title text,
  config jsonb
);

DROP TABLE IF EXISTS QuizTemplates CASCADE;
CREATE TABLE QuizTemplates (
  id int PRIMARY KEY,
  name text,
  description text
);

DROP TABLE IF EXISTS QuizQuestions CASCADE;
CREATE TABLE QuizQuestions (
  id int PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  quiz_template int REFERENCES QuizTemplates,
  text_question text,
  picture_question text,
  question_type quiz_question_type,
  options quiz_multiple_choice_options,
  boolean_correct_answer boolean,
  correct_answer text,
  location_correct_answers point[],
  date_correct_answer date,
  date_start_correct_answer date,
  date_end_correct_answer date,
  integer_correct_answer int,
  real_correct_answer real
);

DROP TABLE IF EXISTS QuizResults CASCADE;
CREATE TABLE QuizResults ( 
  id int PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  date_taken date,
  quiz_duration interval
);

DROP TABLE IF EXISTS QuizAnswers CASCADE;
CREATE TABLE QuizAnswers (
  id int PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  question_id int REFERENCES QuizQuestions,
  quiz_results int REFERENCES QuizResults,
  text_answer text,
  boolean_answer boolean,
  date_answer date,
  date_start_answer date,
  date_end_answer date,
  location_answers point[],
  integer_answer int,
  real_answer real,
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
  id int PRIMARY KEY,
  brief_name text,
  title text,
  config jsonb
);

DROP TABLE IF EXISTS SurveyTemplates CASCADE;
CREATE TABLE SurveyTemplates (
  id int PRIMARY KEY,
  name text,
  description text
);

DROP TABLE IF EXISTS SurveyQuestions CASCADE;
CREATE TABLE SurveyQuestions (
  id int PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  survey_template_id int REFERENCES SurveyTemplates,
  text_question text,
  picture_question text,
  question_type quiz_question_type,
  options quiz_multiple_choice_options
);

DROP TABLE IF EXISTS SurveyResults CASCADE;
CREATE TABLE SurveyResults ( 
  id int PRIMARY KEY,
  survey_id int REFERENCES Surveys,
  date_taken date,
  survey_duration interval
);   

DROP TABLE IF EXISTS SurveyAnswers CASCADE;
CREATE TABLE SurveyAnswers (
  id int PRIMARY KEY,
  quiz_id int REFERENCES Quizzes,
  question_id int REFERENCES QuizQuestions,
  survey_results int REFERENCES SurveyResults,
  text_answer text,
  boolean_answer boolean,
  date_answer date,
  date_start_answer date,
  date_end_answer date,
  location_answers point[],
  integer_answer int,
  real_answer real,
  time_to_answer interval
);

--Admin Users  
DROP TABLE IF EXISTS AdminUsers CASCADE;
CREATE TABLE AdminUsers (
  id int PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  password text
);  