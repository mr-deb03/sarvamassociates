import {
  Armchair,
  BookOpen,
  Car,
  GraduationCap,
  HeartHandshake,
  Home,
  Palmtree,
  Target,
  type LucideIcon,
} from "lucide-react";
import { GOAL_TYPE_META, type GoalType } from "@/lib/plan/catalog";

/**
 * Goal tile icons.
 *
 * An explicit map rather than a dynamic lookup on the lucide namespace: the
 * map is what lets the bundler drop the other thousand-odd icons, and a typo
 * in catalog.ts becomes a type error here rather than a blank square at
 * runtime.
 */
const ICONS: Record<string, LucideIcon> = {
  Car,
  HeartHandshake,
  GraduationCap,
  Palmtree,
  Home,
  Armchair,
  BookOpen,
  Target,
};

export function GoalIcon({
  type,
  className,
}: {
  type: GoalType;
  className?: string;
}) {
  const Icon = ICONS[GOAL_TYPE_META[type].icon] ?? Target;
  return <Icon aria-hidden strokeWidth={1.5} className={className} />;
}
