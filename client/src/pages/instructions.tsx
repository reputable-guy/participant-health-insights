import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, BookOpen, Sparkles } from "lucide-react";

const Instructions = () => {
  return (
    <div className="p-4 min-h-screen pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-primary" />
          Instructions
        </h1>
        <p className="text-muted-foreground mt-1">
          Understanding your health metrics dashboard
        </p>
      </header>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-5 w-5 text-primary mr-2" />
            Getting Started
          </CardTitle>
          <CardDescription>
            How to use your health dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            The dashboard displays comprehensive health metrics gathered from your wearable device. 
            Navigate between different categories using the tabs at the top to focus on specific 
            health aspects.
          </p>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="metrics">
          <AccordionTrigger className="text-base font-medium">
            Understanding Your Metrics
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-medium">Sleep Metrics</h3>
                <p className="text-muted-foreground">
                  Track your deep sleep, REM sleep, sleep efficiency, and more to understand your sleep quality.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Activity Metrics</h3>
                <p className="text-muted-foreground">
                  Monitor your steps, active calories, exercise minutes, and distance traveled.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Cardiovascular Health</h3>
                <p className="text-muted-foreground">
                  Check your heart rate variability (HRV), VO₂ max, resting heart rate, and other heart health indicators.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Stress & Recovery</h3>
                <p className="text-muted-foreground">
                  Understand your stress score, readiness level, and recovery status.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="colors">
          <AccordionTrigger className="text-base font-medium">
            Color Coding System
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#4CAF50] mr-2"></div>
                <p>
                  <span className="font-medium">Green:</span> Excellent progress or improvement
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#FF9800] mr-2"></div>
                <p>
                  <span className="font-medium">Orange:</span> Moderate progress or slight concerns
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#F44336] mr-2"></div>
                <p>
                  <span className="font-medium">Red:</span> Areas that need improvement
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            Tips For Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h3 className="font-medium">Better Sleep</h3>
            <p className="text-muted-foreground">
              Maintain a consistent sleep schedule, avoid screens before bedtime, and create a comfortable sleep environment.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Increased Activity</h3>
            <p className="text-muted-foreground">
              Aim for at least 30 minutes of moderate activity daily, take walking breaks, and find activities you enjoy.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Heart Health</h3>
            <p className="text-muted-foreground">
              Regular cardio exercise, stress management, and a balanced diet can improve cardiovascular metrics.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Stress Management</h3>
            <p className="text-muted-foreground">
              Practice meditation, deep breathing exercises, and ensure adequate recovery time between intense workouts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Instructions;
