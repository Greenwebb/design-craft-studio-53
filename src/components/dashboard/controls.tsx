import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useStudio } from './context';
import type { ReactNode } from 'react';
export function StudioLink({ section, children, className = '' }: { section: string; children: ReactNode; className?: string }) { const {state} = useStudio(); return <Link to="/dashboard/$section" params={{section}} search={{artist:state}} className={`inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60 ${className}`}>{children}<ArrowRight size={16}/></Link>; }
export function SectionTitle({children,action}: {children:ReactNode;action?:ReactNode}) { return <div className="mb-6 flex items-center justify-between gap-3"><h2 className="text-[20px] font-semibold">{children}</h2>{action}</div>; }
