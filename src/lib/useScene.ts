import * as THREE from 'three';

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
    uniforms: {
      [key: string]: THREE.Uniform<unknown>
    };
    params: SchemaOrFn<Schema>;
    values?: any;
  }
}

function useScene(name: string) {
  const scenes: SceneParams = {
    default: {
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
    night: {
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
    }
  }
  
  return scenes[name];
}

export default useScene;