import * as THREE from "three";

export class Bas3d {
  constructor({el}) {
    this.el = el;

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      canvas: el,
      antialias: true,
    });

    this.camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth/window.innerHeight,
      0.1,
      1000,
    );

    this.renderer.setPixelRatio(window.devicePixelRation);

    this.renderer.setSize(el.width, el.height);

    this.scene = new THREE.Scene();
  }

  update() {
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  setSize(w, h) {
    this.renderer.setSize(w, h);
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
  }
}
