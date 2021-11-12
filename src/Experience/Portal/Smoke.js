import * as THREE from 'three'
import Experience from '../Experience'

export default class Smoke {
  constructor(_options) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.config = this.experience.config
    this.resources = this.experience.resources
    this.colors = _options.colors
    this.debug = _options.debugFolder

    // if(this.debug) {
    //   this.debugFolder = this.debug.addFolder({
    //     title: 'smoke'
    //   })
    // }

    this.count = 40;
    this.group = new THREE.Group()

    this.scene.add(this.group)

    this.setGeometry()
    this.setItems()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
  }
  
  setItems() {
    this.items = []

    for(let i = 0; i < this.count; i++) {
      const item = {}

      item.floatingSpeed = Math.random() * 0.5
      item.rotationSpeed = (Math.random() - 0.5) * Math.random() * 0.0002 + 0.0002
      item.progress = Math.random()

      item.material = new THREE.MeshBasicMaterial({
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        alphaMap: this.resources.items.smokeTexture,
        opacity: 0.05 + Math.random() * 0.2
        // opacity: 1,
      })


      item.material.color = this.colors.b.instance

      // angle
      item.angle = Math.random() * Math.PI * 2

      // scale
      item.scale = 0.2 + Math.random() * 0.5

      // mesh
      item.mesh = new THREE.Mesh(this.geometry, item.material)
      item.mesh.position.z = i * 0.0001

      // save
      this.group.add(item.mesh)
      this.items.push(item)
    }
  } 

  resize() {

  }

  update() {
    const elapsedTime = this.time.elapsed + 123456789.123

    for(const _item of this.items) { 
      _item.progress += this.time.delta * 0.0001

      if(_item.progress > 1)
        _item.progress = 0

      _item.material.opacity = Math.min((1 - _item.progress) * 2, _item.progress * 4)
      _item.material.opacity = Math.min(_item.material.opacity, 1)
      _item.material.opacity *= 0.15

      let scaleProgress = Math.min(_item.progress * 4, 1) * _item.scale
      scaleProgress = 1 - Math.pow(1 - scaleProgress, 4)
      
      const scale = scaleProgress * _item.scale

      _item.mesh.scale.set(scale, scale, scale)
      _item.mesh.rotation.z = elapsedTime * _item.rotationSpeed
      // _item.mesh.position.y = Math.sin(elapsedTime * _item.floatingSpeed)

      const radius = 1 - _item.progress * _item.floatingSpeed
      _item.mesh.position.x = Math.sin(_item.angle) * radius
      _item.mesh.position.y = Math.cos(_item.angle) * radius
    }
  }
} 