import { createFileRoute } from '@tanstack/react-router';
import { ArtistDirectory } from '@/components/ecosystem/discovery';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/_public/artists/')({head:()=>pageHead('Discover artists','Meet the creatives shaping contemporary Zambia.'),component:ArtistDirectory});

