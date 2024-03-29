import ServiceItem from '@/app/(home)/_components/service-item';
import { db } from '@/app/_lib/prisma';
import BarbershopInfo from './_components/barbershop-info';
import { getServerSession } from 'next-auth';
import { Service } from '@prisma/client';
import { authOptions } from '@/app/_lib/auth';

interface BarbershopDetailsProps {
  params: {
    id?: string;
  };
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsProps) {
  // cannot run useSession in server components
  const session = await getServerSession(authOptions);

  // invalid id, redirect to home page
  if (!params.id) {
    return null;
  }

  let barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true, // fetch associated data in Services table
    },
  });

  // convert to plain Object
  barbershop = JSON.parse(JSON.stringify(barbershop));

  if (!barbershop) {
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className='flex flex-col gap-4 px-5 py-6'>
        {barbershop.services.map((s: Service) => (
          <ServiceItem
            key={s.id}
            barbershop={barbershop}
            service={s}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
}
