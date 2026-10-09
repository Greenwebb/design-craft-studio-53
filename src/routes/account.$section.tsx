import { createFileRoute } from '@tanstack/react-router';
import { AccountDestination } from '@/components/account/destination';
import { accountSections } from '@/components/account/shell';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/account/$section')({head:({params})=>pageHead(accountSections[params.section as keyof typeof accountSections]??'Your account',`Your personal ${params.section} on I Am An Artist.`,true),component:Page});
function Page(){const {section}=Route.useParams();return <AccountDestination key={section} section={section}/>;}
