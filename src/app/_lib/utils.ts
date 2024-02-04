import { Booking } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { isFuture, isPast } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToReal(n: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

export function sortAndFilterBookings(bookings: Booking[]) {
  let confirmedBookings: Booking[] = [];
  let finishedBookings: Booking[] = [];

  if (bookings?.length) {
    const sortedBookings = bookings.sort(
      (a: Booking, b: Booking) => a.date - b.date
    );
    confirmedBookings = sortedBookings.filter((b: Booking) => isFuture(b.date));
    finishedBookings = sortedBookings.filter((b: Booking) => isPast(b.date));
  }

  return {
    confirmed: confirmedBookings,
    finished: finishedBookings,
  };
}
