import * as THREE from 'three'

import vertex from '../shaders/flowField/vertex.glsl'
import fragment from '../shaders/flowField/fragment.glsl'

export default class FlowField {
  constructor(_count) {
    this.experience = window.experience
    this.scene = this.experience.scene
    this.renderer = this.experience.renderer
    this.texture = null
    this.count = _count
    this.width = 256
    this.height =  Math.ceil(this.count / this.width)

    this.setBaseTexture()
    this.setRenderTargets()
    this.setEnvironment()
    this.setPlane()
    this.setDebugPlane()
    this.setFBOUv()
  }

  setBaseTexture() {
      const size = this.width * this.height
      const data = new Float32Array( size * 4 )
    
      for ( let i = 0; i < size; i ++ ) {
        data[i * 4 + 0] = Math.random()
        data[i * 4 + 1] = Math.random()
        data[i * 4 + 2] = Math.random()
        data[i * 4 + 3] = Math.random()
      }
      
      // used the buffer to create a DataTexture
      
      this.baseTexture = new THREE.DataTexture(
        data,
        this.width,
        this.height,
        THREE.RGBAFormat,
        THREE.FloatType
      )

      this.baseTexture.minFilter = THREE.NearestFilter
      this.baseTexture.magFilter = THREE.NearestFilter
      this.baseTexture.generateMipmaps = false
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
    this.renderTargets.secondary = this.renderTargets.b
  }

  setEnvironment() {
    this.environment = {}
    this.environment.scene = new THREE.Scene()
    this.environment.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10)
    this.environment.camera.position.z = 1
  }

  setPlane() {
    this.plane = {}

    // geometry
    this.plane.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

    // material
    this.plane.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uBaseTexture: { value: this.baseTexture },
        uTexture: { value: null },
      }
    })

    // mesh
    this.plane.mesh = new THREE.Mesh(this.plane.geometry, this.plane.material)

    this.environment.scene.add(this.plane.mesh)
  }

  setDebugPlane() {
    this.debugPlane = {}

    // geometry
    this.debugPlane.geometry = new THREE.PlaneGeometry(1, this.height/this.width, 1, 1)

    // material
    this.debugPlane.material = new THREE.MeshBasicMaterial({ transparent: true })

    // mesh
    this.debugPlane.mesh = new THREE.Mesh(this.debugPlane.geometry, this.debugPlane.material)

    this.scene.add(this.debugPlane.mesh)
  }

  setFBOUv() {  
    this.fboUv = {} 
    
    this.fboUv.data  = new Float32Array(this.count * 2)
    const halfExtentX = 1 / this.width / 2
    const halfExtentY = 1 / this.height / 2

    for(let i = 0; i < this.count; i++) {

      const x = (i % this.width / this.width) + halfExtentX
      const y = Math.floor(i / this.width) / this.height + halfExtentY

      this.fboUv.data[i * 2 + 0] = x
      this.fboUv.data[i * 2 + 1] = y
    }

    this.fboUv.attribute = new THREE.BufferAttribute(this.fboUv.data, 2)
  }

  update() {
    // update material
    this.plane.material.uniforms.uTexture.value = this.renderTargets.secondary.texture


    // render
    this.renderer.instance.setRenderTarget(this.renderTargets.primary)
    this.renderer.instance.render(this.environment.scene, this.environment.camera)
    this.renderer.instance.setRenderTarget(null)

    //swap
    const temp = this.renderTargets.primary
    this.renderTargets.primary = this.renderTargets.secondary
    this.renderTargets.secondary = temp

    // update texture
    this.texture = this.renderTargets.secondary.texture

    // update debug plane
    this.debugPlane.material.map = this.texture
  }
}