import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  ListTodo,
  History,
  FolderKanban,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Planejamento', href: '/planning', icon: ListTodo },
  { name: 'Sprints', href: '/sprints', icon: CalendarRange },
  { name: 'Projetos', href: '/projects', icon: FolderKanban },
  { name: 'Equipe', href: '/teams', icon: Users },
  { name: 'Historico', href: '/history', icon: History },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-2/90 backdrop-blur-xl border-r border-white/[0.04] flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.svg" alt="SprintControl" className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              Sprint<span className="text-primary-400">Control</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.2em] mt-0.5">Gestao Agil</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em] px-4 mb-2">Menu</p>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-600/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 text-sm font-medium w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
