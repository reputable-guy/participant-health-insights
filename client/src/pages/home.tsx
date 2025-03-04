import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Heart, Activity } from "lucide-react";

const Home = () => {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to the insights page if we want to automatically show it
    // setLocation("/insights");
  }, [setLocation]);
  
  return (
    <div className="p-4 min-h-screen pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track and monitor your comprehensive health metrics
        </p>
      </header>
      
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Welcome to Your Health Journey</h2>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your health dashboard provides insights into sleep, activity, cardiovascular health, and stress recovery.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setLocation("/insights")}
            >
              View Your Insights
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Sun className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Daily Activity</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                9,842 steps today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Moon className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Sleep Quality</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                7.5 hours last night
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Heart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Heart Health</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                HRV: 95 ms
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center">
              <Diamond className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-center">Stress Level</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Low: Score 23
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
