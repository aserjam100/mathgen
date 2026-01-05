import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { curriculumData } from '@/data/curriculum';
import { saveExamples, validateExampleFormat, HARDCODED_STRAND } from '@/utils/exampleStorage';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const EXAMPLE_TEMPLATE = `{
  "question": "Mary has 3 apples. John gives her 5 more. How many does she have?",
  "options": {
    "A": "6",
    "B": "8",
    "C": "9",
    "D": "10"
  },
  "correctAnswer": "B"
}`;

export function ExampleInput({ onExampleSaved }) {
  const [selectedSubStrand, setSelectedSubStrand] = useState('');
  const [selectedLearningObjective, setSelectedLearningObjective] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewExamples, setPreviewExamples] = useState(null);

  // Get curriculum data for "Number and Algebra" strand only
  const numberAlgebraData = curriculumData[HARDCODED_STRAND] || {};
  const subStrands = Object.keys(numberAlgebraData);
  const learningObjectives = selectedSubStrand ? Object.keys(numberAlgebraData[selectedSubStrand]) : [];
  const descriptions =
    selectedSubStrand && selectedLearningObjective
      ? numberAlgebraData[selectedSubStrand][selectedLearningObjective]
      : [];

  const handleSubStrandChange = (value) => {
    setSelectedSubStrand(value);
    setSelectedLearningObjective('');
    setSelectedDescription('');
    clearMessages();
  };

  const handleLearningObjectiveChange = (value) => {
    setSelectedLearningObjective(value);
    setSelectedDescription('');
    clearMessages();
  };

  const handleDescriptionChange = (value) => {
    setSelectedDescription(value);
    clearMessages();
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    clearMessages();
    setPreviewExamples(null);
  };

  const clearMessages = () => {
    setValidationError('');
    setSuccessMessage('');
  };

  const handleShowTemplate = () => {
    setJsonInput(EXAMPLE_TEMPLATE);
    clearMessages();
  };

  const handlePreview = () => {
    clearMessages();
    setPreviewExamples(null);

    if (!jsonInput.trim()) {
      setValidationError('Please enter JSON content');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const examples = Array.isArray(parsed) ? parsed : [parsed];

      // Validate all examples
      const validationResults = examples.map(ex => validateExampleFormat(ex));
      const invalidExamples = validationResults.filter(r => !r.isValid);

      if (invalidExamples.length > 0) {
        const allErrors = invalidExamples.flatMap(r => r.errors);
        setValidationError(`Validation errors:\n${allErrors.join('\n')}`);
        return;
      }

      setPreviewExamples(examples);
      setSuccessMessage(`Preview: ${examples.length} valid example(s)`);
    } catch (error) {
      setValidationError(`JSON parse error: ${error.message}`);
    }
  };

  const handleSave = () => {
    clearMessages();

    // Validate topic selection
    if (!selectedSubStrand || !selectedLearningObjective || !selectedDescription) {
      setValidationError('Please select a topic (Sub-Strand, Learning Objective, and Description)');
      return;
    }

    if (!jsonInput.trim()) {
      setValidationError('Please enter JSON content');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const result = saveExamples(
        selectedSubStrand,
        selectedLearningObjective,
        selectedDescription,
        parsed
      );

      if (result.success) {
        setSuccessMessage(result.message);
        setJsonInput('');
        setPreviewExamples(null);

        // Notify parent component if callback provided
        if (onExampleSaved) {
          onExampleSaved();
        }
      } else {
        setValidationError(result.message);
      }
    } catch (error) {
      setValidationError(`JSON parse error: ${error.message}`);
    }
  };

  const isFormValid =
    selectedSubStrand && selectedLearningObjective && selectedDescription && jsonInput.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Training examples for: <strong>{HARDCODED_STRAND}</strong>
        </div>

        <div className="space-y-2">
          <Label htmlFor="substrand">Sub-Strand</Label>
          <Select value={selectedSubStrand} onValueChange={handleSubStrandChange}>
            <SelectTrigger id="substrand">
              <SelectValue placeholder="Select a sub-strand" />
            </SelectTrigger>
            <SelectContent>
              {subStrands.map((subStrand) => (
                <SelectItem key={subStrand} value={subStrand}>
                  {subStrand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">Learning Objective</Label>
          <Select
            value={selectedLearningObjective}
            onValueChange={handleLearningObjectiveChange}
            disabled={!selectedSubStrand}
          >
            <SelectTrigger id="objective">
              <SelectValue placeholder="Select a learning objective" />
            </SelectTrigger>
            <SelectContent>
              {learningObjectives.map((objective) => (
                <SelectItem key={objective} value={objective}>
                  {objective}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Select
            value={selectedDescription}
            onValueChange={handleDescriptionChange}
            disabled={!selectedLearningObjective}
          >
            <SelectTrigger id="description">
              <SelectValue placeholder="Select a description" />
            </SelectTrigger>
            <SelectContent>
              {descriptions.map((desc) => (
                <SelectItem key={desc} value={desc}>
                  {desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="json-input">Example Question JSON</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShowTemplate}
          >
            Show Template
          </Button>
        </div>
        <Textarea
          id="json-input"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder="Paste example question JSON here (single object or array)"
          rows={12}
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground">
          Paste a single question object or an array of questions
        </div>
      </div>

      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-wrap">{validationError}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {previewExamples && (
        <div className="rounded-md border p-4 space-y-2">
          <div className="font-semibold text-sm">Preview ({previewExamples.length} example{previewExamples.length > 1 ? 's' : ''})</div>
          {previewExamples.map((ex, index) => (
            <div key={index} className="text-sm space-y-1 border-l-2 pl-3 py-1">
              <div className="font-medium">{index + 1}. {ex.question}</div>
              <div className="text-muted-foreground space-y-0.5">
                {Object.entries(ex.options).map(([key, value]) => (
                  <div key={key} className={ex.correctAnswer === key ? 'font-semibold text-green-600' : ''}>
                    {key}: {value} {ex.correctAnswer === key && '✓'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreview}
          disabled={!jsonInput.trim()}
        >
          Preview
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          Save Example(s)
        </Button>
      </div>
    </div>
  );
}
