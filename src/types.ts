export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  testId: string;
  code: string;
  options: Choice[];
  correctAnswer: string;
  explanation: string;
  category: string; // e.g., 'Postfix', 'Prefix', 'Side-effects', 'UB'
}

export interface Test {
  id: string;
  levelId: string;
  name: string;
  questions: Question[];
}

export interface Level {
  id: string;
  name: string;
  description: string;
  theory: string;
  tricks: string[];
  tests: Test[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface TestResult {
  testId: string;
  levelId: string;
  answers: UserAnswer[];
  score: number;
  total: number;
  timestamp: number;
}
