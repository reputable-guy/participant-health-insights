import { Home, BarChart2, BookOpen } from "lucide-react";
import { useLocation, Link } from "wouter";

const NavBar = () => {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 w-full bg-surface border-t border-gray-800 py-2">
      <div className="flex justify-around">
        <Link href="/">
          <a className="flex flex-col items-center px-4">
            <Home 
              className={`h-6 w-6 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`} 
            />
            <span className={`text-xs ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </span>
          </a>
        </Link>
        <Link href="/insights">
          <a className="flex flex-col items-center px-4">
            <BarChart2 
              className={`h-6 w-6 ${location === '/insights' ? 'text-primary' : 'text-muted-foreground'}`} 
            />
            <span className={`text-xs ${location === '/insights' ? 'text-primary' : 'text-muted-foreground'}`}>
              Insights
            </span>
          </a>
        </Link>
        <Link href="/instructions">
          <a className="flex flex-col items-center px-4">
            <BookOpen 
              className={`h-6 w-6 ${location === '/instructions' ? 'text-primary' : 'text-muted-foreground'}`} 
            />
            <span className={`text-xs ${location === '/instructions' ? 'text-primary' : 'text-muted-foreground'}`}>
              Instructions
            </span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
