import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface CategoryHeaderProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const CategoryHeader = ({ title, icon, children }: CategoryHeaderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="text-primary mr-2">{icon}</div>
          <h2 className="font-semibold">{title}</h2>
        </div>
        <button 
          className="text-muted-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className={`space-y-3 transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </section>
  );
};

export default CategoryHeader;
