// Reusable style constants for consistent design
export const styles = {
  glassCard: 'bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg',
  glassCardHover: 'bg-surface-card/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-lg hover:border-primary-500/30 hover:shadow-primary-500/5 transition-all duration-300',
  statusBadge: 'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full',
  navLink: 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-surface-hover transition-all duration-200 text-sm font-medium',
  navLinkActive: 'bg-primary-600/20 text-primary-400 border border-primary-500/20',
  inputField: 'w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all',
  btnPrimary: 'bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40',
  btnGhost: 'text-gray-400 hover:text-white hover:bg-surface-hover px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
  glowDot: 'w-2 h-2 rounded-full animate-pulse',
} as const;
