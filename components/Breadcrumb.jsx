import { ChevronRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
export const Breadcrumb = ({ items }) => (
  <nav className="flex items-center text-sm text-gray-500 mb-4">
    {items.map((item, index) => (
      <div key={item.path} className="flex items-center">
        {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
        {item.isCurrent ? (
          <span className="font-medium text-gray-900">{item.label}</span>
        ) : (
          <Link to={item.path} className="hover:text-blue-600 hover:underline">
            {item.label}
          </Link>
        )}
      </div>
    ))}
  </nav>
);
