import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  Settings,
  Search
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, path: '/', label: 'Home' },
    { icon: <Search size={24} />, path: '/search', label: 'Search' },
    { icon: <Calendar size={24} />, path: '/appointments', label: 'Appointments' },
    { icon: <ClipboardList size={24} />, path: '/records', label: 'Records' },
    { icon: <MessageSquare size={24} />, path: '/chat/list', label: 'Messages' },
    { icon: <User size={24} />, path: '/profile', label: 'Profile' },
  ];

  return (
    <aside className="sidebar-width bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8 z-50 shrink-0">
      <Link to="/" className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-100">
        M
      </Link>
      
      <nav className="flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`p-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-sky-50 text-sky-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <Link to="/settings" className="p-3 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
          <Settings size={24} />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
