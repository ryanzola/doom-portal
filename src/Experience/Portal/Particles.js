import * as THREE from 'three'
import Experience from '../Experience'
import FlowField from "./FlowField"

import vertex from '../shaders/portalParticles/vertex.glsl'
import fragment from '../shaders/portalParticles/fragment.glsl'

export default class Particles {
  constructor(_options) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.config = this.experience.config
    this.resources = this.experience.resources
    this.colors = _options.colors
    this.debug = _options.debugFolder

    this.ringCount = 5000
    this.insideCount = 5000
    this.count = this.ringCount + this.insideCount

    if(this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'particles'
      })

      this.debugFolder.addInput(
        this,
        'ringCount',
        {
            min: 100, max: 50000, step: 100
        }
      )
      .on('change', () => {
          this.reset()
      })

      this.debugFolder.addInput(
        this,
        'insideCount',
        { min: 100, max: 50000, step: 100 }
        )
        .on('change', () => {
          this.reset()
        })
    }



    this.setPositions()
    this.setFlowField()
    this.setGeometry()
    this.setMaterial()
    this.setPoints()
  }

  reset() {
    this.flowField.dispose()
    this.geometry.dispose()

    this.setPositions()
    this.setFlowField()
    this.setGeometry()

    this.points.geometry = this.geometry
  }

  setPositions() {
    this.positions = new Float32Array(this.count * 3)

    let i = 0
    for(i = 0; i < this.ringCount; i++) {
      const angle = Math.random() * Math.PI * 2

      this.positions[i * 3 + 0] = Math.sin(angle)
      this.positions[i * 3 + 1] = Math.cos(angle)
      this.positions[i * 3 + 2] = 0
    }

    for(; i < this.count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.pow(Math.random(), 2) * 1

      this.positions[i * 3 + 0] = Math.sin(angle) * radius + Math.random() * 0.2
      this.positions[i * 3 + 1] =  Math.cos(angle) * radius + Math.random() * 0.2
      this.positions[i * 3 + 2] = 0
    }
  }

  setFlowField() {
    this.flowField = new FlowField({ positions: this.positions, debugFolder: this.debugFolder })
  }

  setGeometry() {
    const sizes = new Float32Array(this.count)

    for(let i = 0; i < this.count; i++) {
      sizes[i] = 0.2 + Math.random() * 0.8
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uColor: { value: this.colors.c.instance },
        uSize: { value: 10 * this.config.pixelRatio },
        uMaskTexture: { value: this.resources.items.particleMaskTexture },
        uFBOTexture: { value: this.flowField.texture }
      }
    })

    if(this.debug) {
      this.debugFolder.addInput(
        this.material.uniforms.uSize,
        'value',
        { label: 'uSize', min: 1, max: 100, step: 1 }
      )
    }
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