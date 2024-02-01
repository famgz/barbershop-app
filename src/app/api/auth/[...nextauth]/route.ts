import { db } from '@/app/_lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

const options = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };

