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
  });

  if (!barbershop) {
    return null;
  }

  return <BarbershopInfo barbershop={barbershop}/>;
}
