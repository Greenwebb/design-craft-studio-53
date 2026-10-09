import { createFileRoute } from '@tanstack/react-router';
import { AccountHome } from '@/components/account/home';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/account/')({head:()=>pageHead('Your collection & connections','A personal home for collected works, orders and creative collaborations.',true),component:AccountHome});
