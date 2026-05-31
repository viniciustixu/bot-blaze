import { useEffect } from 'react';
import errorSound from '../assets/pop.mp3';

function ErrorAlert({ mensagem, setErro }) {
  useEffect(() => {
    if (!mensagem) return;

    new Audio(errorSound).play();

    const timer = setTimeout(() => {
      setErro('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [mensagem, setErro]);

  if (!mensagem) return null;

  return (
    <div role='alert' className='alert alert-error fixed bottom-5 left-5'>
      <span className='font-bold'>{mensagem}</span>
    </div>
  );
}

export default ErrorAlert;
