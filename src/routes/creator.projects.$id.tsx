import { createFileRoute,Link } from '@tanstack/react-router';
import { ProjectDetail } from '@/components/ecosystem/primitives';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/creator/projects/$id')({head:()=>pageHead('Your studio project','Your client, concepts and creative project milestones.',true),component:Page});
function Page(){const {id}=Route.useParams();return <><Link to="/creator/$section" params={{section:'projects'}} className="mb-7 inline-block text-xs text-muted-foreground">← Projects</Link><ProjectDetail id={id} context="creator"/></>;}
