import { Outlet } from '@tanstack/react-router';
import { Nav, Footer, Cursor, Grain } from '@/components/site';
export function PublicShell() { return <div className="bg-background text-foreground"><Nav/><Cursor/><Grain/><Outlet/><Footer/></div>; }
