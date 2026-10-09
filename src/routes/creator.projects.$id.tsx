import { createFileRoute,Link } from '@tanstack/react-router';
import { ProjectWorkspace } from '@/components/dashboard/projects';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/creator/projects/$id')({head:()=>pageHead('Your studio project','Your client, concepts and creative project milestones.',true),component:Page});
function Page(){const {id}=Route.useParams();return <ProjectWorkspace id={id}/>;}
