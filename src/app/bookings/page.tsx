import { Booking } from '@prisma/client';
import { isFuture, isPast } from 'date-fns';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import BookingItem from '../_components/booking-item';
import Header from '../_components/header';
import { db } from '../_lib/prisma';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/');
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const sortedBookings = bookings.sort(
    (a: Booking, b: Booking) => a.date - b.date
  );
  const confirmedBookings = sortedBookings.filter((b: Booking) =>
    isFuture(b.date)
  );
  const finishedBookings = sortedBookings.filter((b: Booking) =>
    isPast(b.date)
  );

  return (
    <>
      <Header />
      <div className='px-5 py-6'>
        <h1 className='text-xl font-bold'>Agendamentos</h1>

        <h2 className='section-title mt-6 mb-3'>Confirmados</h2>
        <div className='flex flex-col gap-3'>
          {confirmedBookings.map((b: Booking) => (
            <BookingItem key={b.id} booking={b} />
          ))}
        </div>

        <h2 className='section-title mt-6 mb-3'>Finalizados</h2>
        <div className='flex flex-col gap-3'>
          {finishedBookings.map((b: Booking) => (
            <BookingItem key={b.id} booking={b} />
          ))}
        </div>
      </div>
    </>
  );
}