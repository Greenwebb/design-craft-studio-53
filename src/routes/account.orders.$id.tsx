import { createFileRoute } from '@tanstack/react-router';
import { OrderDetail } from '@/components/account/destination';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/account/orders/$id')({head:()=>pageHead('Your order','Follow your collected work from the artist to its new home.',true),component:Page});
function Page(){const {id}=Route.useParams();return <OrderDetail id={id}/>;}
