import * as THREE from 'three';
import bounceFragment from '@shaders/bounceFragment.glsl';
import fragment2 from '@shaders/fragment2.glsl';
const defaultSceneColors = {
  sunset: {
    uColor1: new THREE.Uniform(new THREE.Vector3(0.92, 0.38, 0.26)),
    uColor2: new THREE.Uniform(new THREE.Vector3(0.94, 0.61, 0.47))
  },
  night: {
    uColor1: new THREE.Uniform(new THREE.Vector3(0.11, 0.16, 0.24)),
    uColor2: new THREE.Uniform(new THREE.Vector3(0.18, 0.23, 0.3))
  },
}

type SceneParams = {
  [key: string]: {
    fragment: string;
    uniforms: {
      [key: string]: THREE.Uniform<unknown>
    };
    params: any;
    values?: any;
  }
}

export const scenes: SceneParams = {
  bounce: {
    fragment: bounceFragment,
    uniforms: {
      ...defaultSceneColors.sunset,
      uSpeed: new THREE.Uniform(1.5)
    },
    params: {
      colors: {
        value: 'sunset',
        options: Object.keys(defaultSceneColors),
      },
      uSpeed: {
        value: 1.5,
        step: 0.001,
        max: 3,
        min: 0,
      }
    },
    values: {
      colors: defaultSceneColors
    },
  },
  'bounce-night': {
    fragment: bounceFragment,
    uniforms: {
      ...defaultSceneColors.night,
      uSpeed: new THREE.Uniform(1.5)
    },
    params: {
      colors: {
        value: 'night',
        options: Object.keys(defaultSceneColors),
      },
      uSpeed: {
        value: 1.5,
        step: 0.001,
        max: 3,
        min: 0,
      }
    },
    values: {
      colors: defaultSceneColors
    },
  },
  temp: {
    fragment: fragment2,
    uniforms: {},
    params: {}
  }
}

function useScene(name: string) {
  return scenes[name];
}

export default useScene;