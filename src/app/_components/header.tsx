import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';

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
          <Button variant='outline' size='icon' className='size-8'>
            <MenuIcon size={18} />
          </Button>
        </CardContent>
      </Card>
    </header>
  );
}
