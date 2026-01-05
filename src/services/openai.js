// Backend API URL - uses same domain in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

import { getExamples, HARDCODED_STRAND } from '@/utils/exampleStorage';

export async function generateQuestions({
  strand,
  subStrand,
  learningObjective,
  description,
  numberOfQuestions,
}) {
  try {
    // Retrieve examples from localStorage (only for "Number and Algebra" strand)
    const examples = strand === HARDCODED_STRAND
      ? getExamples(subStrand, learningObjective, description)
      : [];

    const response = await fetch(`${API_URL}/api/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strand,
        subStrand,
        learningObjective,
        description,
        numberOfQuestions,
        examples, // Include examples in request
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate questions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}
