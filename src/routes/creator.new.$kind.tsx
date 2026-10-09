import { createFileRoute } from '@tanstack/react-router';
import { CreateWorkflow } from '@/components/dashboard/create-workflow';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/creator/new/$kind')({head:({params})=>pageHead(`Create ${params.kind==='work'?'a work':params.kind==='service'?'a service':'a portfolio project'}`,'Shape and preview your next creative offer or portfolio project in your studio.',true),component:Page});
function Page(){const {kind}=Route.useParams();return <CreateWorkflow key={kind} kind={kind}/>}
