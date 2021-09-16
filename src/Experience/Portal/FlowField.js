import * as THREE from 'three'

import vertex from '../shaders/flowField/vertex.glsl'
import fragment from '../shaders/flowField/fragment.glsl'

export default class FlowField {
  constructor(_count) {
    this.experience = window.experience;
    this.renderer = this.experience.renderer;
    this.count = _count
    this.width = 256
    this.height =  Math.ceil(this.count / this.width)

    this.setRenderTargets()
    this.setEnvironment()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setRenderTargets() {
    this.renderTargets = {}
    this.renderTargets.a = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        generateMipmaps: false, 
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        anisotropy: 1,
        encoding: THREE.LinearEncoding,
        depthBuffer: false,
        stencilBuffer: false
      }
    )

    this.renderTargets.b = this.renderTargets.a.clone()
    this.renderTargets.primary = this.renderTargets.a
  }

  setEnvironment() {
    this.environment = {}
    this.environment.scene = new THREE.Scene()
    this.environment.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.environment.scene.add(this.mesh)
  }

  update() {

  }
}