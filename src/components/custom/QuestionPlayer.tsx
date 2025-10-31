import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionPlayerProps {
  questions: any[] | undefined;
}

export function QuestionPlayer({ questions }: QuestionPlayerProps) {
  const [current, setCurrent] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const technicalQuestions = questions || [];

  const pickRandom = () => {
    if (technicalQuestions.length === 0) return;
    const idx = Math.floor(Math.random() * technicalQuestions.length);
    setCurrent(idx);
    setSelected(null);
    setShowAnswer(false);
  };

  // auto pick first question when component mounts if none selected
  useMemo(() => {
    if (current === null && technicalQuestions.length > 0) pickRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technicalQuestions.length]);

  if (!technicalQuestions || technicalQuestions.length === 0) {
    return <div className="py-6">No technical questions available for this assessment.</div>;
  }

  const q = current !== null ? technicalQuestions[current] : undefined;

  const handleSubmitAnswer = () => {
    setShowAnswer(true);
  };

  const isCorrect = () => {
    if (!q) return false;
    if (!q.correctAnswer) return false;
    return selected === q.correctAnswer;
  };

  return (
    <div className="space-y-4">
      {q ? (
        <div>
          <h3 className="text-lg font-semibold">{q.question || q.questionText}</h3>
          <div className="mt-3 space-y-2">
            {(q.options || []).map((opt: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <RadioGroup value={selected ?? undefined} onValueChange={(v) => setSelected(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`${q.id}-opt-${i}`} />
                    <Label htmlFor={`${q.id}-opt-${i}`}>{opt}</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleSubmitAnswer} disabled={!selected}>
              Submit
            </Button>
            <Button variant="outline" onClick={pickRandom}>
              Next Random
            </Button>
            <Button variant="ghost" onClick={() => { setCurrent(null); pickRandom(); }}>
              Restart
            </Button>
          </div>

          {showAnswer && (
            <div className="mt-4">
              {q.correctAnswer ? (
                <div className={`p-3 rounded ${isCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="font-semibold">{isCorrect() ? 'Correct!' : 'Incorrect'}</div>
                  <div className="text-sm mt-1">Correct answer: {q.correctAnswer}</div>
                </div>
              ) : (
                <div className="p-3 rounded bg-yellow-50 border border-yellow-200">
                  <div className="font-semibold">No correct answer set for this question.</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-6">Pick a question to start.</div>
      )}
    </div>
  );
}

export default QuestionPlayer;
