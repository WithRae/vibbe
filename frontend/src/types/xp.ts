// ── XP & Level ──────────────────────────────────────────────────────────────

export interface XpState {
  total: number;
  level: number;
  current_level_xp: number;
  next_level_xp: number;
  progress_percent: number;
  is_max_level: boolean;
}

export interface XpTransaction {
  id: number;
  user_id: number;
  amount: number;
  source: XpSource;
  source_id: number | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type XpSource =
  | 'streak_milestone'
  | 'task_completed'
  | 'microtask_completed'
  | 'focus_session'
  | 'bonus'
  | 'manual'
  | 'penalty';

export interface XpHistoryPage {
  transactions: XpTransaction[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

// ── Source labels for UI display ─────────────────────────────────────────────

export const XP_SOURCE_LABELS: Record<XpSource, string> = {
  streak_milestone:    'Streak Milestone',
  task_completed:      'Task Completed',
  microtask_completed: 'Microtask Completed',
  focus_session:       'Focus Session',
  bonus:               'Bonus',
  manual:              'Manual Award',
  penalty:             'Penalty',
};

export const XP_SOURCE_ICONS: Record<XpSource, string> = {
  streak_milestone:    '🔥',
  task_completed:      '✅',
  microtask_completed: '⚡',
  focus_session:       '🎯',
  bonus:               '🎁',
  manual:              '🛠',
  penalty:             '⚠️',
};

// ── Level thresholds (mirrors backend LevelService) ──────────────────────────

export const LEVEL_THRESHOLDS: Record<number, number> = {
  1:  0,
  2:  100,
  3:  300,
  4:  600,
  5:  1000,
  6:  1500,
  7:  2200,
  8:  3000,
  9:  4000,
  10: 5500,
};

export const MAX_LEVEL = 10;