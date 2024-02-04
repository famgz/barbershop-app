import { Card, CardContent } from '@/app/_components/ui/card';
import { formatToReal } from '@/app/_lib/utils';
import { Barbershop, Service } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceDetailProps {
  service: Service;
  barbershop: Barbershop;
  date: Date | undefined;
  hour: String | undefined;
}

export default function ServiceDetails({
  service,
  barbershop,
  date,
  hour,
}: ServiceDetailProps) {
  return (
    <Card>
      <CardContent className='flex flex-col p-3 gap-2'>
        {/* Service type and price */}
        <div className='flex justify-between items-center'>
          <h2 className='font-bold'>{service.name}</h2>
          <h3 className='font-bold text-sm'>{formatToReal(service.price)}</h3>
        </div>

        {/* Barbershop name */}
        <div className='flex justify-between items-center'>
          <h3 className='text-gray-400 text-sm'>Barbearia</h3>
          <h4 className='text-sm'>{barbershop.name}</h4>
        </div>

        {/* Scheduled date */}
        {date && (
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-400 text-sm'>Data</h3>
            <h4 className='text-sm'>
              {format(date, `dd 'de' MMMM`, {
                locale: ptBR,
              })}
            </h4>
          </div>
        )}

        {/* Scheduled hour */}
        {hour && (
          <div className='flex justify-between items-center'>
            <h3 className='text-gray-400 text-sm'>Horário</h3>
            <h4 className='text-sm'>{hour}</h4>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
