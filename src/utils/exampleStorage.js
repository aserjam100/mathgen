// localStorage utility for managing training examples
// Hardcoded to "Number and Algebra" strand for POC

const STORAGE_KEY = 'mathgen_training_examples';
export const HARDCODED_STRAND = 'Number and Algebra';

/**
 * Generate a unique ID for examples
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all examples from localStorage
 * @returns {Object} All examples organized by topic hierarchy
 */
function getAllStorageData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
}

/**
 * Save all examples to localStorage
 * @param {Object} data - Complete examples data structure
 */
function saveAllStorageData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some examples to free up space.');
    }
    throw new Error(`Failed to save examples: ${error.message}`);
  }
}

/**
 * Validate a single example question format
 * @param {Object} example - Example question to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateExampleFormat(example) {
  const errors = [];

  // Check if example is an object
  if (!example || typeof example !== 'object') {
    errors.push('Example must be an object');
    return { isValid: false, errors };
  }

  // Validate question field
  if (!example.question || typeof example.question !== 'string' || example.question.trim() === '') {
    errors.push('Missing or invalid "question" field (must be a non-empty string)');
  }

  // Validate options field
  if (!example.options || typeof example.options !== 'object') {
    errors.push('Missing or invalid "options" field (must be an object)');
  } else {
    const requiredOptions = ['A', 'B', 'C', 'D'];
    for (const opt of requiredOptions) {
      if (!example.options[opt] || typeof example.options[opt] !== 'string') {
        errors.push(`Missing or invalid option "${opt}"`);
      }
    }
  }

  // Validate correctAnswer field
  if (!example.correctAnswer || !['A', 'B', 'C', 'D'].includes(example.correctAnswer)) {
    errors.push('Invalid "correctAnswer" - must be one of: A, B, C, or D');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get examples for a specific topic
 * @param {string} subStrand - Sub-strand name
 * @param {string} learningObjective - Learning objective name
 * @param {string} description - Description name
 * @returns {Array} Array of example questions, or empty array if none exist
 */
export function getExamples(subStrand, learningObjective, description) {
  const data = getAllStorageData();

  if (!data[subStrand] ||
      !data[subStrand][learningObjective] ||
      !data[subStrand][learningObjective][description]) {
    return [];
  }

  return data[subStrand][learningObjective][description] || [];
}

/**
 * Save examples for a specific topic
 * @param {string} subStrand - Sub-strand name
 * @param {string} learningObjective - Learning objective name
 * @param {string} description - Description name
 * @param {Array|Object} examples - Single example or array of examples to save
 * @returns {Object} { success: boolean, message: string, addedCount: number }
 */
export function saveExamples(subStrand, learningObjective, description, examples) {
  // Normalize input to array
  const exampleArray = Array.isArray(examples) ? examples : [examples];

  // Validate all examples
  const validationResults = exampleArray.map(ex => validateExampleFormat(ex));
  const invalidExamples = validationResults.filter(r => !r.isValid);

  if (invalidExamples.length > 0) {
    const allErrors = invalidExamples.flatMap(r => r.errors);
    return {
      success: false,
      message: `Validation failed:\n${allErrors.join('\n')}`,
      addedCount: 0
    };
  }

  // Get existing data
  const data = getAllStorageData();

  // Initialize nested structure if needed
  if (!data[subStrand]) {
    data[subStrand] = {};
  }
  if (!data[subStrand][learningObjective]) {
    data[subStrand][learningObjective] = {};
  }
  if (!data[subStrand][learningObjective][description]) {
    data[subStrand][learningObjective][description] = [];
  }

  // Add metadata to each example
  const examplesWithMetadata = exampleArray.map(ex => ({
    ...ex,
    id: generateId(),
    createdAt: new Date().toISOString()
  }));

  // Append new examples
  data[subStrand][learningObjective][description].push(...examplesWithMetadata);

  // Save to localStorage
  try {
    saveAllStorageData(data);
    return {
      success: true,
      message: `Successfully saved ${examplesWithMetadata.length} example(s)`,
      addedCount: examplesWithMetadata.length
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      addedCount: 0
    };
  }
}

/**
 * Delete a specific example
 * @param {string} subStrand - Sub-strand name
 * @param {string} learningObjective - Learning objective name
 * @param {string} description - Description name
 * @param {string} exampleId - ID of the example to delete
 * @returns {Object} { success: boolean, message: string }
 */
export function deleteExample(subStrand, learningObjective, description, exampleId) {
  const data = getAllStorageData();

  // Check if path exists
  if (!data[subStrand] ||
      !data[subStrand][learningObjective] ||
      !data[subStrand][learningObjective][description]) {
    return {
      success: false,
      message: 'Example not found'
    };
  }

  const examples = data[subStrand][learningObjective][description];
  const initialLength = examples.length;

  // Filter out the example with matching ID
  data[subStrand][learningObjective][description] = examples.filter(ex => ex.id !== exampleId);

  const finalLength = data[subStrand][learningObjective][description].length;

  if (initialLength === finalLength) {
    return {
      success: false,
      message: 'Example not found'
    };
  }

  // Clean up empty structures
  if (data[subStrand][learningObjective][description].length === 0) {
    delete data[subStrand][learningObjective][description];
  }
  if (Object.keys(data[subStrand][learningObjective]).length === 0) {
    delete data[subStrand][learningObjective];
  }
  if (Object.keys(data[subStrand]).length === 0) {
    delete data[subStrand];
  }

  try {
    saveAllStorageData(data);
    return {
      success: true,
      message: 'Example deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Get all examples (for display/management)
 * @returns {Object} All examples organized by topic hierarchy
 */
export function getAllExamples() {
  return getAllStorageData();
}

/**
 * Clear all examples
 * @returns {Object} { success: boolean, message: string }
 */
export function clearAllExamples() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return {
      success: true,
      message: 'All examples cleared successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Get count of examples for a specific topic
 * @param {string} subStrand - Sub-strand name
 * @param {string} learningObjective - Learning objective name
 * @param {string} description - Description name
 * @returns {number} Count of examples
 */
export function getExampleCount(subStrand, learningObjective, description) {
  const examples = getExamples(subStrand, learningObjective, description);
  return examples.length;
}
