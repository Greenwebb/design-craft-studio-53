import { createFileRoute } from '@tanstack/react-router';
import { PublicSearch } from '@/components/ecosystem/discovery';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/_public/search')({head:()=>pageHead('Search the marketplace','Discover artists, works, services and considered collections.'),component:PublicSearch});

