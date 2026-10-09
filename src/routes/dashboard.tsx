import { createFileRoute, redirect } from '@tanstack/react-router';
export const Route=createFileRoute('/dashboard')({beforeLoad:()=>{throw redirect({to:'/creator',search:{artist:'painter'},replace:true});}});
