// Reusable style constants for consistent design
export const styles = {
  // Cards
  glassCard: 'bg-surface-card border border-white/[0.06] rounded-2xl shadow-lg shadow-black/20',
  glassCardHover: 'bg-surface-card border border-white/[0.06] rounded-2xl shadow-lg shadow-black/20 hover:border-primary-500/20 hover:shadow-primary-900/20 transition-all duration-300 card-shine',

  // Badges
  statusBadge: 'text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md',

  // Navigation
  navLink: 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200 text-sm font-medium',
  navLinkActive: 'bg-primary-600/[0.12] text-primary-300 border border-primary-500/[0.12]',

  // Inputs
  inputField: 'w-full bg-surface-3/80 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all',

  // Buttons
  btnPrimary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 active:scale-[0.98]',
  btnGhost: 'text-gray-400 hover:text-white hover:bg-white/[0.04] px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
  btnDanger: 'text-accent-red hover:bg-accent-red/10 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium',

  // Indicators
  glowDot: 'w-2 h-2 rounded-full animate-pulse',

  // Page header
  pageTitle: 'text-2xl font-bold text-white tracking-tight',
  pageSubtitle: 'text-gray-500 text-sm mt-1',

  // Labels
  label: 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2',

  // Section title
  sectionTitle: 'text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1',
} as const;
