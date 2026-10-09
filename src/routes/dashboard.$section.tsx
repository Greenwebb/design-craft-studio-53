import { createFileRoute, redirect } from '@tanstack/react-router';
export const Route=createFileRoute('/dashboard/$section')({beforeLoad:({params})=>{throw redirect({to:'/creator/$section',params:{section:params.section},search:{artist:'painter'},replace:true});}});
