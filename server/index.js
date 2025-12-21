import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Generate questions endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { strand, subStrand, learningObjective, description, numberOfQuestions } = req.body;

    // Validate request
    if (!strand || !subStrand || !learningObjective || !description || !numberOfQuestions) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    const prompt = `Generate ${numberOfQuestions} multiple choice math questions for Singapore Math curriculum with the following specifications:

Strand: ${strand}
Sub-Strand: ${subStrand}
Learning Objective: ${learningObjective}
Description: ${description}

For each question, provide:
1. The question text
2. Four options (A, B, C, D)
3. The correct answer (A, B, C, or D)

Return ONLY a valid JSON object in this exact format:
{
  "metadata": {
    "strand": "${strand}",
    "subStrand": "${subStrand}",
    "learningObjective": "${learningObjective}",
    "description": "${description}"
  },
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correctAnswer": "A"
    }
  ]
}

Make sure the questions are age-appropriate and follow Singapore Math methodology. The difficulty should match the learning objective.`;

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Singapore Math curriculum specialist. Generate clear, accurate multiple choice questions. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to generate questions'
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsedData = JSON.parse(content);

    res.json(parsedData);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
