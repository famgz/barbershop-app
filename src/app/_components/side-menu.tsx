'use client';

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserCircle2
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  SheetHeader,
  SheetTitle
} from './ui/sheet';

export default function SideMenu({}) {
  const { data } = useSession();

  function handleLoginClick() {
    signIn('google');
  }

  function handleLogoutClick() {
    signOut();
  }

  return (
    <>
      <SheetHeader className='p-5 text-left border-b border-solid border-secondary'>
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        // Logged in
        <div className='flex justify-between px-5 py-6'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={data.user?.image ?? ''} />
            </Avatar>
            <h2 className='font-bold'>{data.user.name}</h2>
          </div>

          <Button onClick={handleLogoutClick} variant='secondary' size='icon'>
            <LogOutIcon />
          </Button>
        </div>
      ) : (
        // Not logged in
        <div className='flex flex-col gap-4 px-5 py-6'>
          <div className='flex items-center gap-3 '>
            <UserCircle2 size={40} className='text-gray-500' />
            <h2 className='font-bold'>Olá. Faça seu login!</h2>
          </div>
          <Button onClick={handleLoginClick} className='w-full justify-start'>
            <LogInIcon className='mr-2' size={18} />
            Fazer Login
          </Button>
        </div>
      )}

      <div className='flex flex-col gap-3 px-5'>
        <Button variant='outline' className='justify-start' asChild>
          <Link href='/'>
            <HomeIcon size={18} className='mr-2' />
            Início
          </Link>
        </Button>

        {/* Agendamentos */}
        {data?.user && (
          <Button variant='outline' className='justify-start' asChild>
            <Link href='/bookings'>
              <CalendarIcon size={18} className='mr-2' />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
