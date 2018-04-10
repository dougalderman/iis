DROP DATABASE IF EXISTS `IIS`;
CREATE DATABASE `IIS`;
USE `IIS`;

DROP TABLE IF EXISTS `Quizzes`;
CREATE TABLE `Quizzes` (
  `id` int PRIMARY KEY,
  `brief_name` text,
  'title' text,
  'config' jsonb
);

DROP TABLE IF EXISTS `QuizQuestions`;
CREATE TABLE `QuizQuestions` (
  `id` int PRIMARY KEY,
  'quiz_id' int REFERENCES Quizzes,
  'text_question' text,
  'picture_question' text,
  'type' [enum],
  'options' [jsonb?],
  'boolean_correct_answer' boolean,
  'correct_answer' text,
  'location_correct_answer' point,
  'location_answer_error_range' real,
  'date_correct_answer' date,
  'date_start_correct_answer' date,
  'date_end_correct_answer' date
);


