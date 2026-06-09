import StatusAnimation from './StatusAnimation';
import StatusAnimatioff from './StatusAnimatioff';

function StartButton({ status, onClick }) {
  return (
    <div className='flex justify-center mt-15'>
      <button
        className='btn btn-xl rounded-full w-[140px] disabled:opacity-100 bg-white disabled:bg-white text-black z-10'
        onClick={onClick}
        disabled={status === 'starting'}>
        {status === 'starting' ? (
          <span className='loading loading-spinner loading-xs'></span>
        ) : status === 'off' ? (
          <div className='flex gap-2 items-center'>
            <StatusAnimation />
            <p>Iniciar</p>
          </div>
        ) : (
          <>
            <div className='flex gap-2 items-center'>
              <StatusAnimatioff />
              <p>Parar</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

export default StartButton;
