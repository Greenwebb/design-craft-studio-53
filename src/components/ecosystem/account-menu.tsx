import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, ShoppingBag, Palette, Check, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/site';
import { useEcosystem } from './context';
import { scenarioLabels, type PreviewScenario } from '@/data/ecosystem';
export function AccountMenu({ context = 'public' }: { context?: 'public' | 'creator' | 'customer' }) {
 const { user, scenario, setScenario, setContext } = useEcosystem();
 const navigate = useNavigate();
 return <DropdownMenu><DropdownMenuTrigger asChild><IconButton ariaLabel="Account menu" title="Account" className="h-9 w-9 border-0"><User size={18}/></IconButton></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64 bg-background p-2">
 <div className="px-3 py-3"><p className="text-sm font-semibold">{user.displayName}</p><p className="mt-1 text-xs text-muted-foreground">Preview account · Sample data</p></div><DropdownMenuSeparator/>
 <DropdownMenuItem asChild><Link to="/account" onClick={() => setContext('customer')}><ShoppingBag size={16}/>{context === 'creator' ? 'Switch to Buying' : 'Buying'}<ArrowUpRight className="ml-auto" size={14}/></Link></DropdownMenuItem>
 {user.roles.includes('creator') ? <DropdownMenuItem asChild><Link to="/creator" search={{ artist: scenario === 'creator' ? 'portfolio' : 'painter' }} onClick={() => setContext('creator')}><Palette size={16}/>{context === 'customer' ? 'Switch to Creating' : 'Creating'}<ArrowUpRight className="ml-auto" size={14}/></Link></DropdownMenuItem> : <DropdownMenuItem asChild><Link to="/join"><Palette size={16}/>Join as Artist<ArrowUpRight className="ml-auto" size={14}/></Link></DropdownMenuItem>}
 <DropdownMenuItem asChild><Link to="/account/$section" params={{section:'settings'}}>Account settings</Link></DropdownMenuItem>
 <DropdownMenuItem asChild><Link to="/auth"><LogIn size={16}/>Sign in with Google</Link></DropdownMenuItem><DropdownMenuSeparator/>
 <p className="px-3 py-2 text-[10px] uppercase text-muted-foreground">Experience previews</p>
 {(Object.keys(scenarioLabels) as PreviewScenario[]).map(value => <DropdownMenuItem key={value} onSelect={() => { setScenario(value); void navigate({to:'/account'}); }}>{scenarioLabels[value]}{value === scenario && <Check size={14} className="ml-auto"/>}</DropdownMenuItem>)}
 </DropdownMenuContent></DropdownMenu>;
}
