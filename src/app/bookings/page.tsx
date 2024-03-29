import { Booking } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import BookingItem from '../_components/booking-item';
import Header from '../_components/header';
import { authOptions } from '../_lib/auth';
import { db } from '../_lib/prisma';
import { sortAndFilterBookings } from '../_lib/utils';

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

  const sortedBookings = sortAndFilterBookings(bookings);

  return (
    <>
      <Header />
      <div className='px-5 py-6'>
        <h1 className='text-xl font-bold mb-6'>Agendamentos</h1>

        {/* Confirmed bookings */}
        {sortedBookings.confirmed?.length > 0 && (
          <>
            <h2 className='section-title mb-3'>Confirmados</h2>
            <div className='flex flex-col gap-3'>
              {sortedBookings.confirmed.map((b: Booking) => (
                <BookingItem key={b.id} booking={b} />
              ))}
            </div>
          </>
        )}

        {/* Finished bookings */}
        {sortedBookings.finished?.length > 0 && (
          <>
            <h2 className='section-title mt-6 mb-3'>Finalizados</h2>
            <div className='flex flex-col gap-3'>
              {sortedBookings.finished.map((b: Booking) => (
                <BookingItem key={b.id} booking={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
