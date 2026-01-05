import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { curriculumData, questionNumbers } from '@/data/curriculum';
import { ExampleManager } from '@/components/ExampleManager';
import { getExampleCount, HARDCODED_STRAND } from '@/utils/exampleStorage';

export function QuestionForm({ onGenerateQuestions, isLoading }) {
  const [selectedStrand, setSelectedStrand] = useState('');
  const [selectedSubStrand, setSelectedSubStrand] = useState('');
  const [selectedLearningObjective, setSelectedLearningObjective] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [exampleCount, setExampleCount] = useState(0);

  const strands = Object.keys(curriculumData);
  const subStrands = selectedStrand ? Object.keys(curriculumData[selectedStrand]) : [];
  const learningObjectives =
    selectedStrand && selectedSubStrand
      ? Object.keys(curriculumData[selectedStrand][selectedSubStrand])
      : [];
  const descriptions =
    selectedStrand && selectedSubStrand && selectedLearningObjective
      ? curriculumData[selectedStrand][selectedSubStrand][selectedLearningObjective]
      : [];

  // Update example count when topic changes
  useEffect(() => {
    if (
      selectedStrand === HARDCODED_STRAND &&
      selectedSubStrand &&
      selectedLearningObjective &&
      selectedDescription
    ) {
      const count = getExampleCount(selectedSubStrand, selectedLearningObjective, selectedDescription);
      setExampleCount(count);
    } else {
      setExampleCount(0);
    }
  }, [selectedStrand, selectedSubStrand, selectedLearningObjective, selectedDescription]);

  const handleStrandChange = (value) => {
    setSelectedStrand(value);
    setSelectedSubStrand('');
    setSelectedLearningObjective('');
    setSelectedDescription('');
  };

  const handleSubStrandChange = (value) => {
    setSelectedSubStrand(value);
    setSelectedLearningObjective('');
    setSelectedDescription('');
  };

  const handleLearningObjectiveChange = (value) => {
    setSelectedLearningObjective(value);
    setSelectedDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      selectedStrand &&
      selectedSubStrand &&
      selectedLearningObjective &&
      selectedDescription &&
      numberOfQuestions
    ) {
      onGenerateQuestions({
        strand: selectedStrand,
        subStrand: selectedSubStrand,
        learningObjective: selectedLearningObjective,
        description: selectedDescription,
        numberOfQuestions: parseInt(numberOfQuestions),
      });
    }
  };

  const isFormValid =
    selectedStrand &&
    selectedSubStrand &&
    selectedLearningObjective &&
    selectedDescription &&
    numberOfQuestions;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Generate Math Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generate">Generate Questions</TabsTrigger>
            <TabsTrigger value="examples">Training Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="strand">Strand</Label>
            <Select value={selectedStrand} onValueChange={handleStrandChange}>
              <SelectTrigger id="strand">
                <SelectValue placeholder="Select a strand" />
              </SelectTrigger>
              <SelectContent>
                {strands.map((strand) => (
                  <SelectItem key={strand} value={strand}>
                    {strand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="substrand">Sub-Strand</Label>
            <Select
              value={selectedSubStrand}
              onValueChange={handleSubStrandChange}
              disabled={!selectedStrand}
            >
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
              onValueChange={setSelectedDescription}
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

          <div className="space-y-2">
            <Label htmlFor="numquestions">Number of Questions</Label>
            <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
              <SelectTrigger id="numquestions">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                {questionNumbers.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exampleCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {exampleCount} training example{exampleCount !== 1 ? 's' : ''} for this topic
              </Badge>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Generating Questions...' : 'Generate Questions'}
          </Button>
        </form>
          </TabsContent>

          <TabsContent value="examples">
            <ExampleManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
