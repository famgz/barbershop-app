'use client'

import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Service } from '@prisma/client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface ServiceItemProps {
  service: Service;
  isAuthenticated?: boolean;
}

export default function ServiceItem({
  service,
  isAuthenticated,
}: ServiceItemProps) {
  function handleBookingClick() {
    if (!isAuthenticated) {
      return signIn('google');
    }

    // TODO: open booking modal
  }

  return (
    <Card>
      <CardContent className='p-3'>
        <div className='flex gap-4 items-center'>
          <div className='relative min-h-[110px] max-h-[110px] min-w-[110px] max-w-[110px] rounded-lg overflow-hidden'>
            <Image
              alt={service.description}
              src={service.imageUrl}
              fill
              className='object-contain'
            />
          </div>

          <div className='flex flex-col grow'>
            <h2 className='font-bold'>{service.name}</h2>
            <p className='text-sm text-gray-500'>{service.description}</p>

            <div className='flex items-center justify-between mt-3'>
              <p className='text-primary text-sm font-bold'>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.price)}
              </p>
              <Button variant='secondary' onClick={handleBookingClick}>Reservar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
