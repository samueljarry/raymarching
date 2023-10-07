import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import SDF from '../SDF/SDF';
import * as THREE from 'three';
import './styles.scss';

function Scene({ DPR = 1, children }: { DPR?: number; children: ReactNode }) {
  const childrenProps = { DPR }
  return ( 
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
   );
}

export default Scene;