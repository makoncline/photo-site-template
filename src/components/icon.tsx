import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Moon,
  MoreVertical,
  Plus,
  Settings,
  SunMedium,
  User,
  X,
  Laptop,
  Image,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icon = {
  logo: Image,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  settings: Settings,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  sun: SunMedium,
  moon: Moon,
  check: Check,
  laptop: Laptop,
};
