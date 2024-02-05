'use client';

import { Prisma } from '@prisma/client';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { cancelBooking } from '../_actions/cancel-booking';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import ServiceDetails from './ui/service-details';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    // include joined tables in type
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

export default function BookingItem({ booking }: BookingItemProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingFinished = isPast(booking.date);

  async function handleCancelBookingClick() {
    setIsDeleteLoading(true);

    try {
      await cancelBooking(booking.id);
      toast.success('Reserva cancelada com sucesso');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card>
          <CardContent className='flex p-0'>
            <div className='flex flex-col gap-2 flex-[3] p-5'>
              <Badge
                variant={isBookingFinished ? 'secondary' : 'default'}
                className='w-fit'
              >
                {isBookingFinished ? 'Finalizado' : 'Confirmado'}
              </Badge>
              <h2 className='font-bold whitespace-nowrap'>
                {booking.service.name}
              </h2>

              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <h3 className='text-sm whitespace-nowrap'>
                  {booking.barbershop.name}
                </h3>
              </div>
            </div>

            <div className='flex flex-col flex-1 items-center justify-center border-l border-solid border-secondary px-5 my-5'>
              <p className='text-sm capitalize'>
                {format(booking.date, `MMMM`, { locale: ptBR })}
              </p>
              <p className='text-2xl'>{format(booking.date, `d`)}</p>
              <p className='text-sm'>{format(booking.date, `hh:mm'`)}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className='py-0 overflow-y-auto hide-scrollbar'>
        <SheetHeader className='text-start py-6 border-b border-solid border-secondary'>
          <SheetTitle>Informacões da Reserva</SheetTitle>
        </SheetHeader>

        <div className='relative h-[180px] w-full mt-3'>
          <Image
            alt={booking.barbershop.name}
            src={'/barbershop-map.png'}
            fill
            className='object-contain'
          />

          <div className='w-full absolute bottom-4 left-0 p-5'>
            <Card>
              <CardContent className='flex p-3 gap-2'>
                <Avatar>
                  <AvatarImage src={booking.barbershop.imageUrl} />
                </Avatar>

                <div>
                  <h2 className='text-sm font-bold'>
                    {booking.barbershop.name}
                  </h2>
                  <h3 className='text-xs text-gray-400 overflow-hidden text-nowrap text-ellipsis'>
                    {booking.barbershop.address}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Badge
          variant={isBookingFinished ? 'secondary' : 'default'}
          className='w-fit mt-3 mb-6'
        >
          {isBookingFinished ? 'Finalizado' : 'Confirmado'}
        </Badge>

        <ServiceDetails
          barbershop={booking.barbershop}
          service={booking.service}
          date={booking.date}
          hour={format(booking.date, 'HH:mm')}
        />

        <SheetFooter className='flex flex-row gap-3 mt-6'>
          <SheetClose asChild>
            <Button variant='secondary' className='w-full'>
              Voltar
            </Button>
          </SheetClose>
          {!isBookingFinished && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={isBookingFinished || isDeleteLoading}
                  variant='destructive'
                  className='w-full'
                >
                  {isDeleteLoading && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='w-[90%]'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar a reserva?
                    <br />
                    (Esta ação não poderá ser desfeita)
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-row gap-3'>
                  <AlertDialogCancel className='w-full mt-0'>
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleteLoading}
                    onClick={handleCancelBookingClick}
                    className='w-full'
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
