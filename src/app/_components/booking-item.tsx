import { Prisma } from '@prisma/client';
import { format, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{  // include joined tables in type
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

export default function BookingItem({ booking }: BookingItemProps) {

  const isBookingFinished = isPast(booking.date)

  return (
    <Card>
      <CardContent className='flex p-0'>
        <div className='flex flex-col gap-2 flex-[3] p-5'>
          <Badge 
          variant={isBookingFinished ? 'secondary' : 'default'}          
          className='w-fit'>
            {isBookingFinished ? 'Finalizado': 'Confirmado'}
          </Badge>
          <h2 className='font-bold whitespace-nowrap'>{booking.service.name}</h2>

          <div className='flex items-center gap-2'>
            <Avatar className='size-6'>
              <AvatarImage src={booking.barbershop.imageUrl} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <h3 className='text-sm whitespace-nowrap'>{booking.barbershop.name}</h3>
          </div>
        </div>

        <div className='flex flex-col flex-1 items-center justify-center border-l border-solid border-secondary px-5 my-5'>
          <p className='text-sm capitalize'>{format(
            booking.date, `MMMM`, {locale: ptBR}
          )}</p>
          <p className='text-2xl'>{format(booking.date, `d`)}</p>
          <p className='text-sm'>{format(booking.date, `hh:mm'`)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
