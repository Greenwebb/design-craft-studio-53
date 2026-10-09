import { createFileRoute } from '@tanstack/react-router';
import { ServiceDetail } from '@/components/ecosystem/discovery';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/_public/services/$slug')({head:()=>pageHead('Creative services','Collaborate with independent artists and creatives.'),component:Page});
function Page(){const {slug}=Route.useParams();return <ServiceDetail slug={slug}/>;}
