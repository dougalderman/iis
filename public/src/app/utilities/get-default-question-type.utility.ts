import { QUIZ_QUESTION_TYPES } from '../constants/quiz-question-types.constant';
import { SURVEY_QUESTION_TYPES } from '../constants/survey-question-types.constant';

export function getDefaultQuestionType(quizOrSurvey: string): string {
  let questionTypes: any[];
  let defaultQuestionType: any = {name: ''};

  if (quizOrSurvey === 'quiz') {
    questionTypes = QUIZ_QUESTION_TYPES;
  }
  else if (quizOrSurvey === 'survey') {
    questionTypes = SURVEY_QUESTION_TYPES;
  }

  if (questionTypes) {
    defaultQuestionType = questionTypes.find(
      (type: any) => {
        return type.default === true;
      }
    );
  }

  return defaultQuestionType.name;
}
