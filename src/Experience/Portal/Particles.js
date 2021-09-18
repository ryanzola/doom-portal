import * as THREE from 'three'

import FlowField from "./FlowField"

import vertex from '../shaders/portalParticles/vertex.glsl'
import fragment from '../shaders/portalParticles/fragment.glsl'

export default class Particles {
  constructor(_options) {
    this.experience = window.experience
    this.scene = this.experience.scene

    this.count = 10000

    this.setFlowField()
    this.setGeometry()
    this.setMaterial()
    this.setPoints()
  }

  setFlowField() {
    this.flowField = new FlowField(this.count)
  }

  setGeometry() {
    const position = new Float32Array(this.count * 3)

    for(let i = 0; i < this.count; i++) {
      position[i * 3 + 0] = (Math.random() - 0.5) * 2
      position[i * 3 + 1] = (Math.random() - 0.5) * 2
      position[i * 3 + 2] = (Math.random() - 0.5) * 2
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute)

    console.log(this.geometry)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uFBOTexture: { value: this.flowField.texture }
      }
    })
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material)

    this.scene.add(this.points)
  }

  update() {
    this.flowField.update()
    this.material.uniforms.uFBOTexture.value = this.flowField.texture
  }
}