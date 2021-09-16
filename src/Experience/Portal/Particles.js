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
      position[i * 3 + 0] = (Math.random() - 0.5) * 5
      position[i * 3 + 1] = (Math.random() - 0.5) * 5
      position[i * 3 + 2] = (Math.random() - 0.5) * 5
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  }

  setMaterial() {
    this.material = new THREE.PointsMaterial({
      sizeAttenuation: true,
      size: 0.1
    })
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material)

    this.scene.add(this.points)
  }

  update() {
    if(this.flowField)
      this.flowField.update()
  }
}