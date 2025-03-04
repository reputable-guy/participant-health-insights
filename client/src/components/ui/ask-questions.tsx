import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageSquare, ArrowUp, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define sample FAQ questions and answers
const faqItems = [
  {
    question: "What does deep sleep do for my body?",
    answer: "Deep sleep is essential for physical recovery, memory consolidation, and immune system function. During this stage, your body repairs tissues, builds bone and muscle, and strengthens your immune system."
  },
  {
    question: "How much deep sleep should I be getting?",
    answer: "Most adults should aim for 1-2 hours of deep sleep per night, which is about 13-23% of your total sleep time. However, individual needs vary based on age, activity level, and overall health."
  },
  {
    question: "Why did my deep sleep improve with the acupressure mat?",
    answer: "Acupressure mats may help stimulate pressure points that promote relaxation and release of tension. This could reduce stress hormones like cortisol, which interfere with deep sleep. The pressure points may also increase production of sleep-promoting neurotransmitters."
  },
  {
    question: "Will my deep sleep stay improved after the study?",
    answer: "Research suggests that continued use of the intervention is likely needed to maintain benefits. Some people find that using acupressure mats 3-4 times per week is enough to sustain the improvements seen during daily use."
  }
];

interface AskQuestionsProps {
  studyName: string;
}

const AskQuestions = ({ studyName }: AskQuestionsProps) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [askedQuestions, setAskedQuestions] = useState<{question: string, answer: string}[]>([]);
  const [showAskForm, setShowAskForm] = useState(false);
  
  const handleAskQuestion = () => {
    if (!customQuestion.trim()) return;
    
    // In a real app, this would make an API call to get the answer
    // For this demo, we'll simulate a response
    const newQuestion = {
      question: customQuestion,
      answer: `Thank you for asking about "${customQuestion}". A member of our research team will review your question and respond within 1-2 business days.`
    };
    
    setAskedQuestions([newQuestion, ...askedQuestions]);
    setCustomQuestion("");
    setShowAskForm(false);
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold text-primary">Questions & Answers</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Common questions about your study results
          </p>
        </div>
        
        {/* FAQ section */}
        <div className="px-4 pt-4">
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between"
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                >
                  <span className="font-medium text-sm">{item.question}</span>
                  <ArrowUp className={`h-4 w-4 text-muted-foreground transition-transform ${
                    activeQuestion === index ? 'rotate-0' : 'rotate-180'
                  }`} />
                </button>
                
                {activeQuestion === index && (
                  <div className="px-4 py-3 bg-muted/20 text-sm border-t border-border">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Button to ask custom question */}
          {!showAskForm && (
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setShowAskForm(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask Your Own Question
            </Button>
          )}
          
          {/* Custom question form */}
          {showAskForm && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Have a specific question about your results? Our research team will respond within 1-2 business days.
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
                  disabled={!customQuestion.trim()}
                >
                  Submit Question
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom questions section */}
        {askedQuestions.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div className="px-4 pb-4">
              <div className="flex items-center mb-3">
                <MessageSquare className="h-4 w-4 text-primary mr-2" />
                <h4 className="font-medium">Your Questions</h4>
              </div>
              
              <div className="space-y-3">
                {askedQuestions.map((item, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3">
                    <p className="font-medium text-sm">{item.question}</p>
                    <p className="text-sm text-muted-foreground mt-2">{item.answer}</p>
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
                Participants who actively engage with their study results and ask questions are 3x more likely to make lasting health improvements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AskQuestions;