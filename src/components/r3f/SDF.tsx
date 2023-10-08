import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, type MutableRefObject, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import vertex from '@shaders/vertex.glsl';
import { useControls } from 'leva';
import useScene from '@lib/useScene';

function SDF({ DPR, scene }: { DPR: number; scene: string }) {
  const { viewport } = useThree();
  const { 
    fragment, 
    uniforms: sceneUniforms, 
    params, 
    values
  } = useScene(scene);
  
  const uniforms: { [key:string]: THREE.Uniform } = useMemo(() => ({
    uTime: new THREE.Uniform(0.0),
    uResolution: new THREE.Uniform(new THREE.Vector2(
      window.innerWidth * DPR,
      window.innerHeight * DPR
    )),
    ...sceneUniforms
  }), []);

  const mesh = useRef<ShaderMesh<typeof uniforms>>(null) as MutableRefObject<ShaderMesh<typeof uniforms>>;

  const controls: typeof params = useControls(params);

  useFrame((_, delta) => {
    mesh.current.material.uniforms.uTime.value += delta;
  });

  useEffect(() => {
    mesh.current.material.uniforms.uResolution.value = new THREE.Vector2(
      window.innerWidth * DPR,
      window.innerHeight * DPR
    );
  }, [viewport]);

  useEffect(() => {
    for(const param of Object.keys(params)) {
      const value = controls[param]
      
      if(typeof value === 'string') {
        const result = values[param][value];
        for(const key of Object.keys(result)) {
          mesh.current.material.uniforms[key] = result[key];
        }
      }

      if(typeof value === 'number') {
        mesh.current.material.uniforms[param].value = value;
      }
    }
  }, [controls])

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