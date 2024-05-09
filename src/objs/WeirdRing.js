import * as THREE from "three";

export class Rod extends THREE.BufferGeometry {
  constructor(w, h, d, segments, twist) {
    super();

    let hinc = h / segments;

    let positions = [];

    let normals = [];

    for (let i=0; i < segments+1; i++) {

      let x1 = -w/2.0;
      let x2 = +w/2.0;
      let z1 = -d/2.0;
      let z2 = +d/2.0;

      let y = hinc*i - h/2.0;

      // Circle
      for (let j=0; j < 4; j++) {
        let theta = j/4 * 2 * Math.PI;
        let x = w*Math.cos(-theta+twist*i);
        let y = hinc*i - h/2.0;
        let z = w*Math.sin(-theta+twist*i);
        positions.push(x, y, z);
      }

      /*
      positions.push(
        x1, y, z1, // 0
        x1, y, z2, // 1
        x2, y, z2, // 2
        x2, y, z1, // 3
      );
      */

      normals.push(
        x1, 0, z1, // 0
        x1, 0, z2, // 1
        x2, 0, z2, // 2
        x2, 0, z1, // 3
      );

    }

    let indices = []

    for (let i=0; i < segments; i++) {
      let j = 4*i;
      indices.push(
        // Face 1
        j+0, j+1, j+4,
        j+1, j+5, j+4,

        // Face 2
        j+1, j+2, j+5,
        j+2, j+6, j+5,

        // Face 3
        j+2, j+3, j+7,
        j+2, j+7, j+6,

        // Face 4
        j+3, j+0, j+7,
        j+0, j+4, j+7,
      );
    }

    this.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    // this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    this.setIndex(indices);
    this.computeVertexNormals();
  }
}

export class WeirdRing extends THREE.Object3D {
  constructor() {
    super();
  }
}
