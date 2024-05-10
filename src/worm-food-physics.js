import * as THREE from "three";

import {Bas3d} from "/Bas3d.js";

import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class WormFoodPhysics extends Bas3d {
    constructor({ el }) {
        super({ el: el });
        this.load();
    }

    async load() {

        // load physics
        this.physics = await AmmoPhysics(this.scene);
        this.position = new THREE.Vector3();

        // setup this camera like whoa
        this.camera.position.set( - 1, 1.5, 2 );
        this.camera.lookAt( 0, 0.5, 0 );

        // scene tweaks
        this.scene.background = new THREE.Color( 0x000033 );


        this.scene.add(new THREE.Mesh(
            new THREE.BoxGeometry( 1, 1, 1 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } ),
        ));

    }

    update() {
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    tweak() {
    }
}