// Backend API URL - defaults to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function generateQuestions({
  strand,
  subStrand,
  learningObjective,
  description,
  numberOfQuestions,
}) {
  try {
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
