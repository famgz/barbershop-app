import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export default function BookingItem() {
  return (
    <Card>
      <CardContent className='flex p-0'>
        <div className='flex flex-col gap-2 grow p-5'>
          <Badge className='bg-[#221c3d] text-primary hover:bg-[#221c3d] w-fit'>
            Confirmado
          </Badge>
          <h2 className='font-bold'>Corte de Cabelo</h2>

          <div className='flex items-center gap-2'>
            <Avatar className='size-6'>
              <AvatarImage src='https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png' />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <h3 className='text-sm'>Vintage Barber</h3>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center border-l border-solid border-secondary p-5'>
          <p className='text-sm'>Fevereiro</p>
          <p className='text-2xl'>06</p>
          <p className='text-sm'>09:45</p>
        </div>
      </CardContent>
    </Card>
  );
}
