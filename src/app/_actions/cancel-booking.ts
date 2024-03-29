'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../_lib/prisma';

export async function cancelBooking(bookingId: string) {
  await db.booking.delete({
    where: {
      id: bookingId,
    },
  });

  // remove page cache and update
  revalidatePath('/');
  revalidatePath('/bookings');
}
