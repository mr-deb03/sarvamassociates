import {
  ClipboardCheck,
  FileCheck,
  FileSpreadsheet,
  Gem,
  HeartPulse,
  Landmark,
  MessageSquare,
  PenLine,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  Umbrella,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon-name → component map.
 *
 * Content modules store icon *names* as strings so they stay plain,
 * serialisable data that can cross a server/client boundary. The resolution to
 * an actual component happens here, at render.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  TrendingUp,
  Gem,
  Landmark,
  ShieldCheck,
  HeartPulse,
  Zap,
  Receipt,
  FileSpreadsheet,
  ClipboardCheck,
  Umbrella,
  MessageSquare,
  PenLine,
  FileCheck,
  RefreshCw,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Target;
  return <Icon aria-hidden className={className} />;
}
