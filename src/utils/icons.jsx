// Explicit icon map (keeps tree-shaking working — never `import *`).
import {
  Rocket,
  HelpCircle,
  Boxes,
  Code2,
  ArrowDownToLine,
  Database,
  RefreshCw,
  MousePointerClick,
  ListChecks,
  FormInput,
  Zap,
  CloudDownload,
  Anchor,
  Network,
  Puzzle,
  Cpu,
  Wrench,
  Brain,
  Atom,
} from 'lucide-react'

export const MODULE_ICONS = {
  Rocket,
  HelpCircle,
  Boxes,
  Code2,
  ArrowDownToLine,
  Database,
  RefreshCw,
  MousePointerClick,
  ListChecks,
  FormInput,
  Zap,
  CloudDownload,
  Anchor,
  Network,
  Puzzle,
  Cpu,
  Wrench,
  Brain,
}

export function ModuleIcon({ name, size = 20 }) {
  const Icon = MODULE_ICONS[name] || Atom
  return <Icon size={size} aria-hidden="true" />
}
