'use client';

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserCircle2,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';

export default function Header() {
  const { data, status } = useSession();

  function handleLoginClick() {
    signIn('google');
  }

  function handleLogoutClick() {
    signOut();
  }

  return (
    <header>
      <Card>
        <CardContent className='py-8 px-5 flex items-center justify-between mt'>
          <Image
            src={'/logo.png'}
            alt='Logo Barbearia'
            height={22}
            width={120}
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='size-10'>
                <MenuIcon size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent className='p-0'>
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

                  <Button
                    onClick={handleLogoutClick}
                    variant='secondary'
                    size='icon'
                  >
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
                  <Button
                    onClick={handleLoginClick}
                    className='w-full justify-start'
                  >
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
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </header>
  );
}
