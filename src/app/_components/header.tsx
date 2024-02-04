import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import SideMenu from './side-menu';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <Card>
        <CardContent className='py-4 px-5 flex items-center justify-between mt'>
          <Link href={'/'}>
            <Image
              src={'/logo.svg'}
              alt='Logo Barbearia'
              height={22}
              width={180}
            />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='size-8'>
                <MenuIcon size={16} />
              </Button>
            </SheetTrigger>

            <SheetContent className='p-0'>
              <SideMenu />
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </header>
  );
}
