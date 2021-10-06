import * as THREE from 'three'

import vertex from '../shaders/portalEventHorizon/vertex.glsl'
import fragment from '../shaders/portalEventHorizon/fragment.glsl'

export default class EventHorizon {
  constructor(_options) {
    this.experience = window.experience
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.time = this.experience.time

    if(this.debug)
    {
      this.debugFolder = this.debug.addFolder({
        title: 'event horizon'
      })
    }

    console.log('what')

    this.setColors()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setColors() {
    this.colors = {}

    this.colors.start = {}
    this.colors.start.value = '#ff3e00'
    this.colors.start.instance = new THREE.Color(this.colors.start.value)

    this.colors.end = {}
    this.colors.end.value = '#ffda79'
    this.colors.end.instance = new THREE.Color(this.colors.end.value)

    if(this.debug) {
      this.debugFolder.addInput(
        this.colors.start,
        'value'
      )
      .on('change', () => {
        this.colors.start.instance.set(this.colors.start.value)
      })

      this.debugFolder.addInput(
        this.colors.end,
        'value'
      )
      .on('change', () => {
        this.colors.end.instance.set(this.colors.end.value)
      })
    }
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
        uColorStart: { value: this.colors.start.instance },
        uColorEnd: { value: this.colors.end.instance }
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