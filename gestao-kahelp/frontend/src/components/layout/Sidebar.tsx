import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  ListTodo,
  History,
  FolderKanban,
  Users,
  LogOut,
  Zap,
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
  { name: 'Histórico', href: '/history', icon: History },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-2 border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SprintControl</h1>
            <p className="text-[10px] text-primary-400 font-semibold uppercase tracking-widest">Gestão Ágil</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.navLinkActive)
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`${styles.navLink} w-full text-red-400 hover:text-red-300 hover:bg-red-500/10`}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
