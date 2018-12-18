import { QUIZ_QUESTION_TYPES } from '../constants/quiz-question-types.constant';

export function getDefaultQuestionType(): string {
  const questionTypes: any[] = QUIZ_QUESTION_TYPES;

  const defaultQuestionType = questionTypes.find(
    (type: any) => {
      return type.default === true;
    }
  );
  return defaultQuestionType.name;
}
