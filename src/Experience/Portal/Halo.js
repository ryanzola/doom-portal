import * as THREE from 'three'
import Experience from '../Experience'
import vertex from '../shaders/portalHalo/vertex.glsl'
import fragment from '../shaders/portalHalo/fragment.glsl'

export default class Halo {
  constructor(_options) {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.colors = _options.colors

    // this.debug = _options.debugFolder

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(3, 3 , 1, 1)
  } 

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: this.colors.a.instance },
        uColorB: { value: this.colors.b.instance },
        uColorC: { value: this.colors.c.instance }
      }
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed
  }
}