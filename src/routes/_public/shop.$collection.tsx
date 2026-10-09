import { createFileRoute } from '@tanstack/react-router';
import { CollectionPage } from '@/components/ecosystem/discovery';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/_public/shop/$collection')({head:()=>pageHead('Curated collections','Original works brought together through shared stories.'),component:Page});
function Page(){const {collection}=Route.useParams();return <CollectionPage slug={collection}/>;}
