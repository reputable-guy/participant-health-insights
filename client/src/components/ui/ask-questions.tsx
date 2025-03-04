import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageSquare, ArrowUp, Lightbulb, Sparkles, Loader2, Book, Brain, Heart, ArrowRight, ThumbsUp, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

interface SuggestedQuestion {
  question: string;
}

interface AskQuestionsProps {
  studyName: string;
}

const getQuestionTopics = (studyName: string) => {
  return [
    {
      id: "results",
      label: "My Results",
      icon: <Brain className="h-4 w-4" />,
      questions: [
        `What do my ${studyName.toLowerCase()} results mean?`,
        `Why did my results change during the study?`,
        `How do my results compare to others?`,
        `What's the most significant change in my data?`
      ]
    },
    {
      id: "health",
      label: "Health Impact",
      icon: <Heart className="h-4 w-4" />,
      questions: [
        `What health benefits will I see from these changes?`,
        `Are my improvements clinically meaningful?`,
        `How can I maintain these health benefits?`,
        `Should I be concerned about any of my metrics?`
      ]
    },
    {
      id: "science",
      label: "Study Science",
      icon: <Book className="h-4 w-4" />,
      questions: [
        `How does ${studyName} work?`,
        `What scientific evidence supports these findings?`,
        `Why was this study designed this way?`,
        `What are the limitations of this study?`
      ]
    }
  ];
};

const AskQuestions = ({ studyName }: AskQuestionsProps) => {
  const [activeTab, setActiveTab] = useState("results");
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
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question,
          studyName
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send question');
      }
      return response.json();
    },
    onSuccess: (data: {question: string, answer: string}) => {
      const newQuestion = {
        question: data.question,
        answer: data.answer
      };
      setAskedQuestions(prev => [newQuestion, ...prev]);
      setCustomQuestion("");
      setShowAskForm(false);
    }
  });
  
  // Topics with suggested questions
  const questionTopics = getQuestionTopics(studyName);
  
  // Handle submitting custom question
  const handleAskQuestion = () => {
    if (!customQuestion.trim()) return;
    askQuestionMutation.mutate(customQuestion);
  };
  
  // Handle clicking a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    askQuestionMutation.mutate(question);
  };
  
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex items-start">
          <Sparkles className="h-6 w-6 text-primary mr-3 mt-0.5" />
          <div>
            <h2 className="font-semibold text-lg">
              Ask About Your Study Results
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Our AI assistant can answer your questions about the {studyName}, explain your results, 
              or provide health insights based on your specific data.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Ask Questions */}
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              {/* Custom question form - Always visible */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Ask your question</h3>
                  {askQuestionMutation.isPending && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating answer...
                    </div>
                  )}
                </div>
                <Textarea
                  placeholder={`For example: "Why did my deep sleep improve during the study?"`}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="min-h-[80px] mb-2"
                />
                <Button 
                  onClick={handleAskQuestion}
                  disabled={!customQuestion.trim() || askQuestionMutation.isPending}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </div>
              
              {/* Previous answers section */}
              {askedQuestions.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <History className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="font-medium">Previous Questions</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {askedQuestions.map((item, index) => (
                      <div key={index} className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 p-3">
                          <p className="font-medium text-sm flex items-start">
                            <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                            {item.question}
                          </p>
                        </div>
                        <div className="p-3">
                          <p className="text-sm whitespace-pre-line">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Suggested Questions */}
        <div className="col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Suggested Questions</h3>
              
              <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  {questionTopics.map(topic => (
                    <TabsTrigger key={topic.id} value={topic.id} className="flex items-center">
                      {topic.icon}
                      <span className="ml-2 hidden md:inline">{topic.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {questionTopics.map(topic => (
                  <TabsContent key={topic.id} value={topic.id} className="mt-0">
                    <div className="space-y-2">
                      {topic.questions.map((question, idx) => (
                        <Button 
                          key={idx}
                          variant="ghost"
                          className="w-full justify-start h-auto py-2 px-3 text-left hover:bg-muted/50 transition-colors"
                          onClick={() => handleSuggestedQuestionClick(question)}
                        >
                          <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="text-sm">{question}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    These questions are tailored to help you understand your particular study results and what they mean for your health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskQuestions;