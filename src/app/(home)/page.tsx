import { Barbershop } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BookingItem from '../_components/booking-item';
import { db } from '../_lib/prisma';
import BarbershopItem from './_components/barbershop-item';
import Search from './_components/search';

export default async function Home() {
  const barbershops = await db.barbershop.findMany({});

  return (
    <div>
      <div className='px-5 pt-5'>
        <h2 className='text-xl font-bold'>Ola, Aluno!</h2>
        <p className='capitalize text-sm'>
          {format(new Date(), `EEEE',' dd 'de' MMMM`, { locale: ptBR })}
        </p>
      </div>

      <div className='px-5 mt-6'>
        <Search />
      </div>

      <div className='px-5 mt-6'>
        <h2 className='text-xs mb-3 uppercase text-gray-400 font-bold'>
          Agendamentos
        </h2>
        <BookingItem />
      </div>

      <div className='mt-6'>
        <h2 className='text-xs px-5 mb-3 uppercase text-gray-400 font-bold'>
          Recomendados
        </h2>
        <div className='flex px-5 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
          {barbershops.map((b: Barbershop) => (
            <BarbershopItem key={b.id} barbershop={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
