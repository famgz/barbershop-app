'use client';

import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import { Card, CardContent } from '@/app/_components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/_components/ui/sheet';
import { formatToReal } from '@/app/_lib/utils';
import { generateDayTimeList } from '@/app/barbershops/[id]/_helpers/hours';
import { Barbershop, Service } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

function ServiceItem({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<String | undefined>();

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

  function handleDateClick(date: Date | undefined) {
    setDate(date);
    setHour(undefined);
  }

  function handleHourClick(time: string) {
    setHour(time);
  }

  function handleBookingClick() {
    if (!isAuthenticated) {
      return signIn();
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
                {formatToReal(service.price)}
              </p>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='secondary' onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className='p-0'>
                  <SheetHeader className='text-start px-5 py-6 border-b border-solid border-secondary'>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className='py-6'>
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={new Date()} // prevent past day selection
                      styles={{
                        head_cell: {
                          width: '100%',
                          textTransform: 'capitalize',
                        },
                        cell: {
                          width: '100%',
                        },
                        button: {
                          width: '100%',
                        },
                        nav_button_previous: {
                          width: '32px',
                          height: '32px',
                        },
                        nav_button_next: {
                          width: '32px',
                          height: '32px',
                        },
                        caption: {
                          textTransform: 'capitalize',
                        },
                      }}
                    />
                  </div>

                  {/* Only show schedules hours if selected date */}
                  {date && (
                    <div className='flex gap-3 overflow-x-auto hide-scrollbar py-6 px-5 border-t border-solid border-secondary'>
                      {timeList.map((t) => (
                        <Button
                          onClick={() => handleHourClick(t)}
                          key={t}
                          variant={t === hour ? 'default' : 'outline'}
                          className='rounded-full min-w-[75px]'
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className='py-6 px-5 border-t border-solid border-secondary'>
                    <Card>
                      <CardContent className='flex flex-col p-3 gap-3'>
                        {/* Service type and price */}
                        <div className='flex justify-between items-center'>
                          <h2 className='font-bold'>{service.name}</h2>
                          <h3 className='font-bold text-sm'>
                            {formatToReal(service.price)}
                          </h3>
                        </div>

                        {/* Barbershop name */}
                        <div className='flex justify-between items-center'>
                          <h3 className='text-gray-400 text-sm'>Barbearia</h3>
                          <h4 className='text-sm'>{barbershop.name}</h4>
                        </div>

                        {/* Scheduled date */}
                        {date && (
                          <div className='flex justify-between items-center'>
                            <h3 className='text-gray-400 text-sm'>Data</h3>
                            <h4 className='text-sm'>
                              {format(date, `dd 'de' MMMM`, {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {/* Scheduled hour */}
                        {hour && (
                          <div className='flex justify-between items-center'>
                            <h3 className='text-gray-400 text-sm'>Horário</h3>
                            <h4 className='text-sm'>{hour}</h4>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className='px-5'>
                    <Button
                      disabled={!(date && hour)}
                    >Confirmar Reserva</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;
