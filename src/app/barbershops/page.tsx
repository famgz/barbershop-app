import { Barbershop } from '@prisma/client';
import Header from '../_components/header';
import { db } from '../_lib/prisma';
import BarbershopItem from '../(home)/_components/barbershop-item';
import { redirect } from 'next/navigation';
import Search from '../(home)/_components/search';

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  if (!searchParams?.search) {
    return redirect('/');
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive',
      },
    },
  });

  return (
    <>
      <Header />
      <div className='px-5 py-6'>
        <div className=''>
          <Search
            defaultValues={{
              search: searchParams.search,
            }}
          />
        </div>

        <h1 className='text-gray-400 font-bold text-xs uppercase mt-6'>
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className='grid grid-cols-2 justify-center w-fit gap-4 items-center mt-5 mx-auto'>
          {barbershops.map((bs: Barbershop) => (
            <BarbershopItem key={bs.id} barbershop={bs} />
          ))}
        </div>
      </div>
    </>
  );
}
