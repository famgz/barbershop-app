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
import { getDayBookings } from '@/app/barbershops/[id]/_actions/get-day-bookings';
import { saveBooking } from '@/app/barbershops/[id]/_actions/save-booking';
import { generateDayTimeList } from '@/app/barbershops/[id]/_helpers/hours';
import { Barbershop, Booking, Service } from '@prisma/client';
import { format, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

export default function ServiceItem({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) {
  const router = useRouter()
  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState<String | undefined>();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([])


  useEffect(() => {
    if(!date) {
      return
    }

    async function refreshAvailableHours() {
      const _dayBookings = await getDayBookings(barbershop.id, date)
      setDayBookings(_dayBookings)
    }

    refreshAvailableHours()
  }, [date, barbershop.id])

  const timeList = useMemo(() => {
    if(!date) {
      return []
    }

    // filter only available hours at given day
    return generateDayTimeList(date).filter(time => {
      const timeHour = Number(time.split(':')[0])
      const timeMinutes = Number(time.split(':')[1])

      const booking = dayBookings.find(b => {
        const bHour = b.date.getHours()
        const bMinutes = b.date.getMinutes()
        return bHour === timeHour && bMinutes === timeMinutes
      })

      if(!booking) {
        return true
      }
      return false
    })

  }, [date, dayBookings]);

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

  async function handleBookingSubmit() {
    if (!(date && hour && data?.user)) {
      return;
    }

    setIsSubmitLoading(true);

    try {
      const dateHour = Number(hour.split(':')[0]);
      const dateMinutes = Number(hour.split(':')[1]);
      const parsedDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: parsedDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      setHour(undefined)
      setDate(undefined)

      toast('Reserva realizada com sucesso!', {
        description: format(parsedDate, `'Para' dd 'de' MMMM 'às' HH':'mm'.'`, {
          locale: ptBR,
        }),
        action: {
          label: 'Visualizar',
          onClick: () => router.push('/bookings'),
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitLoading(false);
    }
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

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
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
                    {/* Confirmation button */}
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!(date && hour && !isSubmitLoading)}
                    >
                      {isSubmitLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Confirmar Reserva
                    </Button>
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
