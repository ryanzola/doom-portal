import * as THREE from 'three'
import Experience from '../Experience'
import vertex from '../shaders/portalEventHorizon/vertex.glsl'
import fragment from '../shaders/portalEventHorizon/fragment.glsl'

export default class EventHorizon {
  constructor(_options) {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.colors = _options.colors
    this.debug = _options.debugFolder

    if(this.debug)
    {
      this.debugFolder = this.debug.addFolder({
        title: 'event horizon'
      })
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }



  setGeometry()
  {
      this.geometry = new THREE.PlaneGeometry(3, 3, 1, 1)
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
        uColorStart: { value: this.colors.b.instance },
        uColorEnd: { value: this.colors.c.instance }
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