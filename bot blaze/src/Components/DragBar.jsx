import CloseAppBtn from './CloseAppBtn';
import MinimizeAppBtn from './MinimizeAppBtn';

function DragBar() {
  return (
    <div className='text-2xl titlebar w-full h-15 text-center text-white flex justify-end items-center'>
      <MinimizeAppBtn />
      <CloseAppBtn />
    </div>
  );
}

export default DragBar;
