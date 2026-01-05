import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { getAllExamples, deleteExample, HARDCODED_STRAND } from '@/utils/exampleStorage';
import { Trash2, AlertCircle } from 'lucide-react';

export function ExampleList({ refreshTrigger }) {
  const [examples, setExamples] = useState({});
  const [deleteStatus, setDeleteStatus] = useState('');

  const loadExamples = () => {
    const data = getAllExamples();
    setExamples(data);
  };

  useEffect(() => {
    loadExamples();
  }, [refreshTrigger]);

  const handleDelete = (subStrand, learningObjective, description, exampleId, questionPreview) => {
    if (window.confirm(`Are you sure you want to delete this example?\n\n"${questionPreview}"`)) {
      const result = deleteExample(subStrand, learningObjective, description, exampleId);

      if (result.success) {
        setDeleteStatus('Example deleted successfully');
        loadExamples(); // Reload examples after deletion
        setTimeout(() => setDeleteStatus(''), 3000);
      } else {
        setDeleteStatus(`Error: ${result.message}`);
        setTimeout(() => setDeleteStatus(''), 5000);
      }
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTotalCount = () => {
    let count = 0;
    Object.values(examples).forEach(subStrandData => {
      Object.values(subStrandData).forEach(objectiveData => {
        Object.values(objectiveData).forEach(descExamples => {
          count += descExamples.length;
        });
      });
    });
    return count;
  };

  const isEmpty = Object.keys(examples).length === 0;
  const totalCount = getTotalCount();

  if (isEmpty) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg">No training examples yet</p>
        <p className="text-sm mt-2">Add examples using the "Add Examples" tab</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{HARDCODED_STRAND}</h3>
          <p className="text-sm text-muted-foreground">
            {totalCount} total example{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {deleteStatus && (
        <Alert>
          <AlertDescription>{deleteStatus}</AlertDescription>
        </Alert>
      )}

      <Accordion type="multiple" className="w-full">
        {Object.entries(examples).map(([subStrand, subStrandData]) => (
          <AccordionItem key={subStrand} value={subStrand}>
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{subStrand}</span>
                <Badge variant="secondary">
                  {Object.values(subStrandData).reduce((acc, obj) =>
                    acc + Object.values(obj).reduce((sum, arr) => sum + arr.length, 0), 0
                  )}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="w-full pl-4">
                {Object.entries(subStrandData).map(([learningObjective, objectiveData]) => (
                  <AccordionItem key={learningObjective} value={learningObjective}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{learningObjective}</span>
                        <Badge variant="outline">
                          {Object.values(objectiveData).reduce((sum, arr) => sum + arr.length, 0)}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="multiple" className="w-full pl-4">
                        {Object.entries(objectiveData).map(([description, descExamples]) => (
                          <AccordionItem key={description} value={description}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center gap-2">
                                <span>{description}</span>
                                <Badge>{descExamples.length}</Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pl-4">
                                {descExamples.map((example) => (
                                  <div
                                    key={example.id}
                                    className="rounded-md border p-4 space-y-2"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 space-y-2">
                                        <div className="font-medium">{example.question}</div>
                                        <div className="space-y-1 text-sm">
                                          {Object.entries(example.options).map(([key, value]) => (
                                            <div
                                              key={key}
                                              className={
                                                example.correctAnswer === key
                                                  ? 'font-semibold text-green-600'
                                                  : 'text-muted-foreground'
                                              }
                                            >
                                              {key}: {value}
                                              {example.correctAnswer === key && ' ✓'}
                                            </div>
                                          ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground pt-2">
                                          Added: {formatDate(example.createdAt)}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDelete(
                                            subStrand,
                                            learningObjective,
                                            description,
                                            example.id,
                                            example.question.slice(0, 50) + (example.question.length > 50 ? '...' : '')
                                          )
                                        }
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
