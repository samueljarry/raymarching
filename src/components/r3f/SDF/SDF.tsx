import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, type MutableRefObject, useEffect } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

function SDF({ DPR }: { DPR: number }) {
  const { viewport } = useThree();
  
  const uniforms: { [key:string]: THREE.Uniform } = {
    uTime: new THREE.Uniform(0.0),
    uResolution: new THREE.Uniform(new THREE.Vector2(
      window.innerWidth * DPR,
      window.innerHeight * DPR
    ))
  }

  const mesh = useRef<ShaderMesh<typeof uniforms>>(null) as MutableRefObject<ShaderMesh<typeof uniforms>>;

  useFrame((_, delta) => {
    mesh.current.material.uniforms.uTime.value += delta;
  })

  useEffect(() => {
    mesh.current.material.uniforms.uResolution.value = new THREE.Vector2(
      window.innerWidth * DPR,
      window.innerHeight * DPR
    )
  }, [viewport])

  return ( 
    <mesh ref={ mesh } rotation-y={ Math.PI } scale={[ viewport.width, viewport.height, 1 ]}>
      <planeGeometry args={[1,1]} />
      <shaderMaterial
        key={ uuidv4() }
        fragmentShader={ fragment }
        vertexShader={ vertex }
        uniforms={ uniforms }
      />
    </mesh>
   );
}

export default SDF;