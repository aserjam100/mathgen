import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function QuestionDisplay({ questionsData, onUpdateQuestion }) {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestionText, setEditedQuestionText] = useState('');
  const [editedOptions, setEditedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!questionsData) {
    return null;
  }

  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setEditedQuestionText(question.question);
    setEditedOptions({ ...question.options });
    setImagePreview(question.image || null);
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    const updatedQuestion = {
      ...editingQuestion,
      question: editedQuestionText,
      options: editedOptions,
      image: imagePreview,
    };
    onUpdateQuestion(updatedQuestion);
    setEditingQuestion(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedQuestionText('');
    setEditedOptions({});
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleOptionChange = (key, value) => {
    setEditedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Set Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Strand:</span>{' '}
              {questionsData.metadata.strand}
            </div>
            <div>
              <span className="font-semibold">Sub-Strand:</span>{' '}
              {questionsData.metadata.subStrand}
            </div>
            <div>
              <span className="font-semibold">Learning Objective:</span>{' '}
              {questionsData.metadata.learningObjective}
            </div>
            <div>
              <span className="font-semibold">Description:</span>{' '}
              {questionsData.metadata.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {questionsData.questions.map((question, index) => (
        <Card key={question.id || index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(question)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.image && (
              <div className="mb-4">
                <img
                  src={question.image}
                  alt="Question illustration"
                  className="max-w-md rounded-lg border"
                />
              </div>
            )}
            <p className="text-base font-medium">{question.question}</p>
            <div className="space-y-2">
              {Object.entries(question.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded border ${
                    key === question.correctAnswer
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{key}.</span> {value}
                  {key === question.correctAnswer && (
                    <span className="ml-2 text-green-600 text-sm font-semibold">
                      (Correct Answer)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editingQuestion} onOpenChange={handleCancelEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to the question text, options, or add an image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={editedQuestionText}
                onChange={(e) => setEditedQuestionText(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-image">Question Image (Optional)</Label>
              <Input
                id="question-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-sm rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Options</Label>
              {Object.entries(editedOptions).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`option-${key}`} className="text-sm">
                    Option {key}
                    {editingQuestion?.correctAnswer === key && (
                      <span className="ml-2 text-green-600">(Correct)</span>
                    )}
                  </Label>
                  <Input
                    id={`option-${key}`}
                    value={value}
                    onChange={(e) => handleOptionChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
