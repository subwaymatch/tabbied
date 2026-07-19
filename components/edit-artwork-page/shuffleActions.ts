import { Palette, RefreshCw, Shuffle, type LucideIcon } from 'lucide-react';

// The three shuffle scopes, shared by the desktop split button
// (ShuffleMenuButton) and the mobile inline panel (7d). "Layout" reseeds the
// pattern, "Colors" rerolls the palette, and "Shuffle" does both.
export type ShuffleAction = 'all' | 'layout' | 'colors';

export const SHUFFLE_STORAGE_KEY = 'tabbied.shuffleAction.v1';

export const SHUFFLE_ACTIONS: {
  id: ShuffleAction;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: 'all', label: 'Shuffle', Icon: Shuffle },
  { id: 'layout', label: 'Shuffle layout', Icon: RefreshCw },
  { id: 'colors', label: 'Shuffle colors', Icon: Palette },
];

export const isShuffleAction = (value: unknown): value is ShuffleAction =>
  value === 'all' || value === 'layout' || value === 'colors';
