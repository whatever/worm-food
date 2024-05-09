import * as THREE from "three";
import {Bas3d} from "/Bas3d.js";
import {Rod, WeirdRing} from "/objs/WeirdRing.js";

import {OBJLoader} from "three/examples/jsm/loaders/ObjLoader.js";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper.js";


export class WorldShadowGovernmentApp extends Bas3d {

  constructor({el}) {
    super({el: el});

    this.outsider = new THREE.PerspectiveCamera(
      80,
      window.innerWidth/window.innerHeight,
      0.1,
      1000,
    );

    const bloomParams = {
      exposure: 1.0,
      bloomStrength: 2.5,
      bloomThreshold: 0.2,
      bloomRadius: 3.0,
    };

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85,
    );

    const renderScene = new RenderPass(this.scene, this.outsider);
    
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);

    this.bloomPass.threshold = bloomParams.bloomThreshold;
    this.bloomPass.strength = bloomParams.bloomStrength;
    this.bloomPass.radius = bloomParams.bloomRadius;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let fake_props = {
      color: 0x775555,
      emissive: 0x000000,
      roughness: 0.524,
      metalness: 0.7,
      reflectivity: 0.8,
      clearcoat: 0.67,
      clearcoatRoughness: 0.0,
      // flatShading: true,
    };

    let props = {
      color: 0x000000,
      emissive: 0x000000,
      roughness: 0.524,
      metalness: 0.7,
      reflectivity: 0.8,
      clearcoat: 0.67,
      clearcoatRoughness: 0.0,
      // flatShading: true,
    };

    this.mat = new THREE.MeshPhysicalMaterial(props);

    let mat = new THREE.MeshPhysicalMaterial(props);

    let s = 3.0;

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0),
      mat,
    );

    // this.scene.add(this.mesh);

    let amb = new THREE.AmbientLight(0xCCCCCC);
    this.scene.add(amb);

    let intensity = 4.0;
    this.distance = 0.4;

    this.hot = new THREE.DirectionalLight(0xCC00CC, intensity);
    this.hot.position.set(10.0, 4.0, this.distance/2.0);
    this.scene.add(this.hot);

    this.cold = new THREE.DirectionalLight(0x00CCCC, intensity);
    this.cold.position.set(10.0, 4.0, -this.distance/2.0);
    this.scene.add(this.cold);

    this.rings = [];

    this.group = new THREE.Object3D();

    for (let i=0; i < 5; i++) {

      if (i == 2) {
        continue;
      }

      let radius = 6*(i+1);
      let mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, Math.sqrt(radius)/2.0, 16 , 128),
        // new THREE.MeshBasicMaterial({color: 0xFF00FF}),
        new THREE.MeshPhysicalMaterial(props),

      );
      mesh.receiveShadow = true;
      mesh.castShadow = true;

      this.rings.push(mesh);
      this.group.add(mesh);
    }

    this.scene.add(this.group);

    this.getHandObj();


    this.helpers = new THREE.Group();
    this.helpers.add(new THREE.CameraHelper(this.camera));
    this.scene.add(this.helpers);

    this.outsiderView = true;
    this.bloom = true;

    let testProps = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      emissive: 0x000000,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    // XXX: DEBUG CODE
    this.group.visible = true;
    this.ring = new THREE.Mesh(
      new Rod(1.0, 10.0, 1.0, 3, 3/2/Math.PI),
      props,
    );
    // this.ring.add(new VertexNormalsHelper(this.ring));


    this.scene.add(this.ring);
  }

  update() {

    this.composer.passes[0].camera = this.outsiderView ? this.outsider : this.camera;
    this.helpers.visible = this.outsiderView;

    let s = 40.0;
    this.camera.position.set(0.0, 0.0, 20.0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.outsider.position.set(s, s, s);
    this.outsider.lookAt(new THREE.Vector3(0, 0, 0));


    let t = +new Date();
    let u = t / 1000.0 / 30.0;

    this.ring.rotation.x = Math.PI/8;
    this.ring.rotation.y = +2*t/1000.0;

    this.mesh.rotation.set(3*u, -2*u, 1*u);

    this.rings.forEach((v, i) => {
      const c = t / 1000.0 / 69.0;
      const x =  (11*(i+0))%7 - 4;
      const y =  (17*(i+1))%7 - 4;
      const z =  (29*(i+2))%7 - 4;
      v.rotation.set(c*x, c*y, c*z);
    });
  }

  draw() {

    if (this.bloom) {
      this.composer.render(this.scene, undefined);
    } else {
      this.renderer.render(this.scene, this.composer.passes[0].camera);
    }
  }

  setSize(w, h) {
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    this.outsider.aspect = w/h;
    this.outsider.updateProjectionMatrix();
  }

  getHandObj() {

    const loader = new OBJLoader();

    // load a resource
    loader.load(
      // resource URL
      'hand.obj',

      (object) => {
        let geo = object.children[0].geometry;
        let mat = new THREE.MeshPhysicalMaterial({
          color: 0x000000,
          emissive: 0x000000,
          roughness: 0.524,
          metalness: 0.7,
          reflectivity: 0.8,
          clearcoat: 0.67,
          clearcoatRoughness: 0.0,
          // flatShading: true,
        });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(3, 3, 3);
        // this.scene.add(mesh);
      },
      (xhr) => {
      },
      (error) => {
        console.log(error);
      },
    );
  }

  tweak({bloomThreshold, bloomStrength, bloomRadius, outsiderView, bloom, hot, cold, distance}) {
    this.bloomPass["threshold"] = bloomThreshold;
    this.bloomPass["strength"] = bloomStrength;
    this.bloomPass["radius"] = bloomRadius;
    this.outsiderView = outsiderView;
    this.bloom = bloom;
    this.hot.intensity = hot;
    this.cold.intensity = cold;
    this.distance = distance;
    this.hot.position.set(10.0, 4.0, this.distance/2.0);
    this.cold.position.set(10.0, 4.0, -this.distance/2.0);
  }

}
