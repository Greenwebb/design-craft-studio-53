import { createFileRoute } from '@tanstack/react-router';
import { ArtForSpaces } from '@/components/ecosystem/discovery';
import { pageHead } from '@/lib/page-head';
export const Route=createFileRoute('/_public/art-for-spaces')({head:()=>pageHead('Art for Spaces','Original art and creative collaborations for considered interiors.'),component:ArtForSpaces});

