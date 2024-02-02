'use server';

import { db } from '@/app/_lib/prisma';

interface saveBookingParams {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export async function saveBooking({
  barbershopId,
  serviceId,
  userId,
  date,
}: saveBookingParams) {
  await db.booking.create({
    data: {
      barbershopId,
      serviceId,
      date,
      userId,
    },
  });
}
