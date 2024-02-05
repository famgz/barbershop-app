import { Barbershop, Booking } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BookingItem from '../_components/booking-item';
import { db } from '../_lib/prisma';
import BarbershopItem from './_components/barbershop-item';
import Search from './_components/search';
import Header from '../_components/header';
import { getServerSession } from 'next-auth';
import { sortAndFilterBookings } from '../_lib/utils';
import { authOptions } from '../_lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // parallel queries
  let [barbershops, bookings] = await Promise.all([
    db.barbershop.findMany({}),

    session?.user
      ? await db.booking.findMany({
          where: {
            userId: (session.user as any).id,
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : [],
  ]);

  barbershops = JSON.parse(JSON.stringify(barbershops))
  bookings = JSON.parse(JSON.stringify(barbershops))

  const sortedBookings = sortAndFilterBookings(bookings);

  return (
    <div>
      <Header />
      <div className='px-5 pt-5'>
        <h2 className='text-xl font-bold'>Olá, {session?.user?.name?.split(' ')[0] || 'visitante'}</h2>
        <p className='capitalize text-xs text-gray-300 mt-2'>
          {format(new Date(), `EEEE',' dd 'de' MMMM`, { locale: ptBR })}
        </p>
        <p className='mt-3'>Vamos agendar um corte hoje?</p>
      </div>

      <div className='px-5 mt-6'>
        <Search />
      </div>

      {/* Confirmed bookings */}
      {sortedBookings.confirmed?.length > 0 && (
        <div className='mt-6'>
          <h2 className='section-title px-5'>Agendamentos</h2>
          <div className='flex px-5 gap-2 overflow-x-auto hide-scrollbar'>
            {sortedBookings.confirmed.map((bk: Booking) => (
              <BookingItem key={bk.id} booking={bk} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended barbershops */}
      <div className='mt-6'>
        <h2 className='section-title px-5'>Recomendados</h2>
        <div className='flex px-5 gap-2 overflow-x-auto hide-scrollbar'>
          {barbershops.map((bs: Barbershop) => (
            <BarbershopItem key={bs.id} barbershop={bs} />
          ))}
        </div>
      </div>

      {/* Popular barbershops */}
      <div className='mt-6 mb-[4.5rem]'>
        <h2 className='section-title px-5'>Populares</h2>
        <div className='flex px-5 gap-2 overflow-x-auto hide-scrollbar'>
          {barbershops.map((bs: Barbershop) => (
            <BarbershopItem key={bs.id} barbershop={bs} />
          ))}
        </div>
      </div>
    </div>
  );
}
