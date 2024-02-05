'use client'

import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Barbershop } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BarbershopItemProps {
  barbershop: Barbershop;
}

export default function BarbershopItem({ barbershop }: BarbershopItemProps) {
  const router = useRouter()
  
  function handleBookingClick () {
    router.push('/barbershops/' + barbershop.id)
  }

  // generate random decimal number between 3.0 and 5.0
  function getRandomRating() {
    return (Math.floor(Math.random() * 21) + 30) / 10
  }


  return (
    <Card className='min-w-[167px] max-w-[167px] rounded-2xl'>
      <CardContent className='p-1'>
        <div className='relative px-1 w-full h-[160px] rounded-2xl overflow-hidden'>
          <Badge variant='secondary' className='flex items-center gap-1 absolute opacity-90 top-2 left-2 z-50'>
            <StarIcon size={12} className='fill-primary text-primary'/>
            <span className='text-xs'>5.0</span>

          </Badge>
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className='object-cover'
          />
        </div>
        <div className='p-2'>
          <h2 className='font-bold mt-2 overflow-hidden text-ellipsis text-nowrap'>
            {barbershop.name}
          </h2>
          <p className='text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap'>
            {barbershop.address}
          </p>
          <Button 
          onClick={handleBookingClick}
          variant='secondary' className='w-full mt-3'>
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
