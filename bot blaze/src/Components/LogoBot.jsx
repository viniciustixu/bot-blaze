import kirby from '../assets/kirby.png';

function LogoBot() {
  return (
    <div className='flex gap-12  items-center z-10'>
      <img src={kirby} className='w-40 h-40' />
      <h1 className='text-7xl font-bold text-[rgb(255,20,255)] drop-shadow-lg'>Bot Blaze 2</h1>
    </div>
  );
}
export default LogoBot;
