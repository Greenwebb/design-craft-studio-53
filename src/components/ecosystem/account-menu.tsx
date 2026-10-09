import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, ShoppingBag, Palette, Check, User, Settings, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/site';
import { useEcosystem } from './context';
import { useSignOut } from '@/components/settings/hub';
import { scenarioLabels, type PreviewScenario } from '@/data/ecosystem';
import type { PreviewState } from '@/data/dashboard';
export function AccountMenu({ context = 'public', artist = 'painter' }: { context?: 'public' | 'creator' | 'customer'; artist?: PreviewState }) {
  const { user, scenario, setScenario, setContext } = useEcosystem();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const creator = context === 'creator';
  return <DropdownMenu><DropdownMenuTrigger asChild><IconButton ariaLabel="Account menu" title="Account" className="h-9 w-9 border-0"><User size={20}/></IconButton></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64 bg-background p-2">
    <div className="px-3 py-3"><p className="text-sm font-semibold">{user.displayName}</p><p className="mt-1 text-xs text-muted-foreground">Preview account · Sample data</p></div><DropdownMenuSeparator/>
    <DropdownMenuItem asChild>{creator ? <Link to="/creator/settings/$page" params={{page:'account'}} search={{artist}}><User size={18}/>Account</Link> : <Link to="/account/settings/$page" params={{page:'account'}}><User size={18}/>Account</Link>}</DropdownMenuItem>
    <DropdownMenuItem asChild>{creator ? <Link to="/creator/settings" search={{artist}}><Settings size={18}/>Settings</Link> : <Link to="/account/settings"><Settings size={18}/>Settings</Link>}</DropdownMenuItem>
    {user.creatorProfile && <DropdownMenuItem asChild><Link to="/artists/$slug" params={{slug:user.creatorProfile.slug}}>View public profile<ArrowUpRight className="ml-auto" size={16}/></Link></DropdownMenuItem>}
    {context !== 'customer' && <DropdownMenuItem asChild><Link to="/account" onClick={() => setContext('customer')}><ShoppingBag size={18}/>{creator ? 'Switch to Buying' : 'Buying'}</Link></DropdownMenuItem>}
    {context !== 'creator' && (user.roles.includes('creator') ? <DropdownMenuItem asChild><Link to="/creator" search={{ artist: scenario === 'creator' ? 'portfolio' : 'painter' }} onClick={() => setContext('creator')}><Palette size={18}/>{context === 'customer' ? 'Switch to Creating' : 'Creating'}</Link></DropdownMenuItem> : <DropdownMenuItem asChild><Link to="/join"><Palette size={18}/>Join as Artist</Link></DropdownMenuItem>)}
    <DropdownMenuItem onSelect={() => void signOut()}><LogOut size={18}/>Sign out</DropdownMenuItem><DropdownMenuSeparator/>
    <p className="px-3 py-2 text-[12px] uppercase text-muted-foreground">Experience previews</p>
    {(Object.keys(scenarioLabels) as PreviewScenario[]).map(value => <DropdownMenuItem key={value} onSelect={() => { setScenario(value); void navigate({to:'/account'}); }}>{scenarioLabels[value]}{value === scenario && <Check size={16} className="ml-auto"/>}</DropdownMenuItem>)}
  </DropdownMenuContent></DropdownMenu>;
}
