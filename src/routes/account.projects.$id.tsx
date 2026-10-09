import { createFileRoute,Link } from '@tanstack/react-router';
import { CustomerProjectWorkspace } from '@/components/ecosystem/project-workspace';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/account/projects/$id')({head:()=>pageHead('Your creative collaboration','Concepts, milestones and conversations with your artist.',true),component:Page});
function Page(){const {id}=Route.useParams();return <><Link to="/account/$section" params={{section:'projects'}} className="mb-7 inline-block text-xs text-muted-foreground">← Projects</Link><CustomerProjectWorkspace id={id}/></>;}
