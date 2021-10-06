import * as THREE from 'three'

import vertex from '../shaders/portalHalo/vertex.glsl'
import fragment from '../shaders/portalHalo/fragment.glsl'

export default class Halo {
  constructor(_options) {
    this.experience = window.experience
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.time = this.experience.time

    if(this.debug)
    {
      this.debugFolder = this.debug.addFolder({
        title: 'halo'
      })
    }

    this.setColors()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setColors() {
    this.colors = {}

    this.colors.a = {}
    this.colors.a.value = '#130000'
    this.colors.a.instance = new THREE.Color(this.colors.a.value)

    this.colors.b = {}
    this.colors.b.value = '#ff3e00'
    this.colors.b.instance = new THREE.Color(this.colors.b.value)

    this.colors.c = {}
    this.colors.c.value = '#ff791e'
    this.colors.c.instance = new THREE.Color(this.colors.c.value)

    if(this.debug) {
      this.debugFolder.addInput(
        this.colors.a,
        'value'
      )
      .on('change', () => {
        this.colors.a.instance.set(this.colors.a.value)
      })

      this.debugFolder.addInput(
        this.colors.b,
        'value'
      )
      .on('change', () => {
        this.colors.b.instance.set(this.colors.b.value)
      })

      this.debugFolder.addInput(
        this.colors.c,
        'value'
      )
      .on('change', () => {
        this.colors.c.instance.set(this.colors.c.value)
      })
    }
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