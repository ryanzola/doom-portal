import * as THREE from 'three'
import Experience from './Experience'

export default class Floor {
  constructor(_options) {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.debug = this.experience.debug

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()  
  }

  setGeometry() {
    this.geometry = new THREE.BoxGeometry(4.025, 3, 4.025)
    // this.geometry.rotateX(- Math.PI * 0.5)

    this.geometry.setAttribute('uv2', this.geometry.attributes.uv)
  }

  setTexture() {
    this.textures = {}
    this.textures.color = this.experience.resources.items.metalColorTexture
    this.textures.color.encoding = THREE.sRGBEncoding
    this.textures.color.wrapS = THREE.RepeatWrapping
    this.textures.color.wrapT = THREE.RepeatWrapping
    this.textures.color.repeat.set(2, 1)

    this.textures.normal = this.experience.resources.items.metalNormalTexture
    this.textures.normal.wrapS = THREE.RepeatWrapping
    this.textures.normal.wrapT = THREE.RepeatWrapping
    this.textures.normal.repeat.set(2, 1) 
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial ({
      map: this.textures.color,
      normalMap: this.textures.normal,
      side: THREE.BackSide
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    // this.mesh.position.y = -0.95
    this.mesh.position.y = 0.55

    this.scene.add(this.mesh)
  }

  update() {}
}