import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageSquare, ArrowUp, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";

interface SuggestedQuestion {
  question: string;
}

interface AskQuestionsProps {
  studyName: string;
}

const AskQuestions = ({ studyName }: AskQuestionsProps) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [askedQuestions, setAskedQuestions] = useState<{question: string, answer: string}[]>([]);
  const [showAskForm, setShowAskForm] = useState(false);
  
  // Fetch suggested questions from OpenAI
  const { 
    data: suggestedQuestionsData, 
    isLoading: isLoadingSuggestions,
    isError: isSuggestionsError
  } = useQuery({
    queryKey: [`/api/suggested-questions`, studyName],
    queryFn: async ({ queryKey }) => {
      const [_, studyName] = queryKey;
      const response = await fetch(`/api/suggested-questions?studyName=${encodeURIComponent(studyName)}`);
      if (!response.ok) throw new Error('Failed to fetch suggested questions');
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for an hour
  });
  
  // Mutation for asking questions
  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest('/api/ask-question', {
        method: 'POST',
        body: JSON.stringify({ 
          question,
          studyName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    },
    onSuccess: (data) => {
      const newQuestion = {
        question: data.question,
        answer: data.answer
      };
      setAskedQuestions(prev => [newQuestion, ...prev]);
      setCustomQuestion("");
      setShowAskForm(false);
    }
  });
  
  // Fallback questions in case API fails
  const fallbackQuestions = [
    "What does deep sleep do for my body?",
    "How much deep sleep should I be getting?",
    "Why did my deep sleep improve with the acupressure mat?",
    "Will my deep sleep stay improved after the study?",
    "How can I maintain my improved sleep quality?"
  ];
  
  // Questions to display - either from API or fallback
  const suggestedQuestions = suggestedQuestionsData?.questions || fallbackQuestions;
  
  const handleAskQuestion = () => {
    if (!customQuestion.trim()) return;
    askQuestionMutation.mutate(customQuestion);
  };
  
  const handleSuggestedQuestionClick = (question: string) => {
    askQuestionMutation.mutate(question);
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold text-primary">AI-Powered Answers</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Get immediate answers about your study results
          </p>
        </div>
        
        {/* Suggested questions section */}
        <div className="px-4 pt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Suggested Questions
          </h4>
          
          {isLoadingSuggestions ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-2 px-3 text-left"
                  onClick={() => handleSuggestedQuestionClick(
                    typeof question === 'string' ? question : question.question
                  )}
                >
                  <span className="text-sm">
                    {typeof question === 'string' ? question : question.question}
                  </span>
                </Button>
              ))}
            </div>
          )}
          
          {/* Button to ask custom question */}
          {!showAskForm && (
            <Button 
              variant="default" 
              className="w-full mt-2 mb-4"
              onClick={() => setShowAskForm(true)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Ask Your Own Question
            </Button>
          )}
          
          {/* Custom question form */}
          {showAskForm && (
            <div className="mt-4 space-y-3 mb-4">
              <p className="text-sm text-muted-foreground">
                Have a specific question about your results? Our AI will provide an immediate answer based on your study data.
              </p>
              <Textarea
                placeholder={`For example: "Why did my ${studyName.toLowerCase()} results improve so much on weekends?"`}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAskForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleAskQuestion}
                  disabled={!customQuestion.trim() || askQuestionMutation.isPending}
                >
                  {askQuestionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : 'Submit Question'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom questions section */}
        {askedQuestions.length > 0 && (
          <>
            <Separator className="my-2" />
            
            <div className="px-4 pb-4">
              <div className="flex items-center mb-3">
                <MessageSquare className="h-4 w-4 text-primary mr-2" />
                <h4 className="font-medium">Your Questions</h4>
              </div>
              
              <div className="space-y-3">
                {askedQuestions.map((item, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3">
                    <p className="font-medium text-sm">{item.question}</p>
                    <Separator className="my-2 opacity-30" />
                    <p className="text-sm mt-2">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Did you know section */}
        <div className="bg-gray-800/30 p-4">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Did you know?</h4>
              <p className="text-sm text-muted-foreground">
                This AI assistant is trained on the latest medical research and can answer questions specific to your study results. All answers are generated to be scientifically accurate and participant-friendly.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AskQuestions;