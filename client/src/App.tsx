import { Switch, Route } from "wouter";
import Insights from "@/pages/insights";
import Home from "@/pages/home";
import Instructions from "@/pages/instructions";
import NotFound from "@/pages/not-found";
import NavBar from "@/components/nav-bar";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/insights" component={Insights} />
        <Route path="/instructions" component={Instructions} />
        <Route component={NotFound} />
      </Switch>
      <NavBar />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
