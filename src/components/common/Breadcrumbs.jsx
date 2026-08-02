import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Capitalize route items
  const formatLabel = (str) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <nav className="flex items-center gap-2 text-xs font-bold text-textMuted select-none mb-3">
      <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = formatLabel(value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {isLast ? (
              <span className="text-primary truncate max-w-[160px] font-black">{label}</span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors truncate max-w-[120px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
