function StatusAnimation() {
  return (
    <>
      <div className='inline-grid *:[grid-area:1/1]'>
        <div className='status status-error animate-ping'></div>
        <div className='status status-error'></div>
      </div>
    </>
  );
}

export default StatusAnimation;
