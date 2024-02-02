import {
  MenuIcon
} from 'lucide-react';
import Image from 'next/image';
import SideMenu from './side-menu';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from './ui/sheet';

export default function Header() {
  return (
    <header>
      <Card>
        <CardContent className='py-8 px-5 flex items-center justify-between mt'>
          <Image
            src={'/logo.png'}
            alt='Logo Barbearia'
            height={22}
            width={120}
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='size-10'>
                <MenuIcon size={20} />
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
