import { useEffect } from 'react';

function BackgroundParticles() {
  useEffect(() => {
    window.tsParticles.load('tsparticles', {
      particles: {
        number: { value: 100 },
        color: { value: '#ca00e0' },
        shape: { type: 'circle' },
        opacity: { value: 0.1 },
        size: { value: 3 },
        links: { enable: true, distance: 150, color: '#28013d', opacity: 0.2 },
        move: { enable: true, speed: 4 },
      },
    });
  }, []);

  return <div id='tsparticles' className='absolute inset-0 pointer-events-none -z-10' />;
}

export default BackgroundParticles;
