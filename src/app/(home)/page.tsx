import { format } from 'date-fns';
export default function Home() {
  return (
    <div>
      <div className='px-5 pt-5'>
        <h2 className='text-xl font-bold'>Ola, Aluno!</h2>
        <p className='capitalize text-sm'>
          {format(new Date(), `EEEE',' dd 'de' MMMM`)}
        </p>
      </div>
    </div>
  );
}
