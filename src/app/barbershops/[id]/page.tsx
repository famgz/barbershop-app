import ServiceItem from '@/app/(home)/_components/service-item';
import { db } from '@/app/_lib/prisma';
import BarbershopInfo from './_components/barbershop-info';

interface BarbershopDetailsProps {
  params: {
    id?: string;
  };
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsProps) {
  // invalid id, redirect to home page
  if (!params.id) {
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true, // fetch associated data in Services table
    },
  });

  if (!barbershop) {
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className='flex flex-col gap-4 px-5 py-6'>
        {barbershop.services.map((s) => (
          <ServiceItem key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
