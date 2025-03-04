import { Medal, Users, BrainCircuit, Lightbulb, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface StudyImpactProps {
  totalParticipants: number;
  participantRank?: number; // Percentile rank among participants
  studyName: string;
  completionDate: string;
}

const StudyImpact = ({
  totalParticipants = 157,
  participantRank = 22, // Top 22%
  studyName,
  completionDate
}: StudyImpactProps) => {
  // Calculate recommended next studies based on current study
  const getRecommendedStudies = () => {
    if (studyName.toLowerCase().includes('sleep')) {
      return [
        { 
          title: "Morning Routine & Productivity", 
          description: "Discover how your morning habits affect your daily energy and focus",
          startDate: "April 15, 2025",
          compensation: "$125"
        },
        { 
          title: "Circadian Rhythm Reset", 
          description: "Test how light exposure timing can optimize your sleep-wake cycle",
          startDate: "May 3, 2025",
          compensation: "$150"
        }
      ];
    }
    
    // Default recommendations
    return [
      { 
        title: "Stress Recovery Techniques", 
        description: "Compare different methods to improve your body's recovery from stress",
        startDate: "April 10, 2025",
        compensation: "$175"
      },
      { 
        title: "Nutrition & Sleep Quality", 
        description: "Explore how specific foods affect your sleep architecture",
        startDate: "May 22, 2025",
        compensation: "$200"
      }
    ];
  };
  
  const recommendedStudies = getRecommendedStudies();
  
  // Get personalized insights based on study name
  const getPersonalizedInsight = () => {
    if (studyName.toLowerCase().includes('acupressure')) {
      return "Your data suggests that acupressure mats may be most effective when used 2-3 hours before bedtime rather than immediately before sleep.";
    }
    
    return "Based on your personal data patterns, your deep sleep quality seems most responsive to changes in your evening routine.";
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <h3 className="font-semibold text-primary">Your Study Impact</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How your participation contributes to science and what's next
          </p>
        </div>
        
        {/* Study stats */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col items-center bg-gray-800/30 p-3 rounded-lg">
              <Users className="h-5 w-5 text-primary mb-1" />
              <p className="text-xl font-semibold">{totalParticipants}</p>
              <p className="text-xs text-muted-foreground text-center">Total Participants</p>
            </div>
            <div className="flex flex-col items-center bg-gray-800/30 p-3 rounded-lg">
              <Medal className="h-5 w-5 text-primary mb-1" />
              <p className="text-xl font-semibold">Top {participantRank}%</p>
              <p className="text-xs text-muted-foreground text-center">Data Quality Ranking</p>
            </div>
          </div>
          
          <div className="mb-4 bg-primary/5 p-3 rounded-lg">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Personalized Insight</h4>
                <p className="text-sm text-muted-foreground">
                  {getPersonalizedInsight()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <BrainCircuit className="h-5 w-5 text-primary mr-2" />
              <h4 className="font-medium">Research Impact</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Your participation in this study helps researchers better understand how non-pharmaceutical 
              interventions can improve sleep quality. This data may contribute to new recommendations 
              for people with sleep disorders.
            </p>
          </div>
        </div>
        
        <Separator />
        
        {/* Recommended studies */}
        <div className="p-4">
          <h4 className="font-medium mb-3">Recommended Next Studies</h4>
          
          <div className="space-y-3">
            {recommendedStudies.map((study, index) => (
              <div key={index} className="bg-gray-800/30 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-sm">{study.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{study.description}</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded whitespace-nowrap">
                    ${study.compensation}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Starts {study.startDate}</span>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <span>Learn More</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button className="w-full">
              <span>Browse All Available Studies</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyImpact;