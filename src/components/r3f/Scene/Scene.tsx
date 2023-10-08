import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import SDF from '../SDF';
import './styles.scss';
import { Leva } from 'leva';

function Scene({ DPR = 2, scene, children }: { DPR?: number; scene: string; children?: ReactNode }) {
  const childrenProps = { DPR, scene }
  
  return ( 
    <>
      <Leva />
      <Canvas 
        camera={{
          position: [ 0, 0, -6 ],
        }}
        className="webgl"
        dpr={ DPR }
      >
        <Suspense fallback={ null }>
          <SDF { ...childrenProps } />
        </Suspense>
      </Canvas>
    </>
   );
}

export default Scene;