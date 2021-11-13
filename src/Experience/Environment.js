import * as THREE from 'three'
import Experience from './Experience'
import Floor from './Floor'

export default class Environment {
  constructor(_options) {
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.debug = this.experience.debug

    if(this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'Environment'
      })
    }

    this.setFloor()
    this.setLights()
  }

  setFloor() {
    this.floor = new Floor()
  }

  setLights() {
    this.lights = {}

    this.lights.items = {}

    this.lights.items.a = {}
    this.lights.items.a.color = '#ff0a00'
    this.lights.items.a.instance = new THREE.RectAreaLight(this.lights.items.a.color, 10, 1.03 , 2)
    this.lights.items.a.instance.rotation.y = Math.PI
    this.lights.items.a.instance.position.z = - 2.001



    this.lights.items.b = {}
    this.lights.items.b.color = '#0059ff'
    this.lights.items.b.instance = new THREE.RectAreaLight(this.lights.items.b.color, 10, 1.03 , 2)
    this.lights.items.b.instance.position.x = - 2
    this.lights.items.b.instance.rotation.y = - Math.PI * 0.5

    if(this.debug) {
      const lightsFolder = this.debugFolder.addFolder({
        title: 'Lights'
      })

      for(const _lightName in this.lights.items) {
        // light a
        lightsFolder.addInput(
          this.lights.items[_lightName],
          'color',
          { label: `color ${_lightName}`}
        ).on('change', () => {
          this.lights.items[_lightName].instance.color.set(this.lights.items[_lightName].color)
        })
  
        lightsFolder.addInput(
          this.lights.items[_lightName].instance,
          'intensity',
          { label: 'intensity a', min: 0, max: 20, step: 0.01 }
        )
  
        lightsFolder.addInput(
          this.lights.items[_lightName].instance,
          'width',
          { label: 'width a', min: 0, max: 1, step: 0.01 }
        )
      }
    }

    this.scene.add(this.lights.items.a.instance, this.lights.items.b.instance)
  }

  update() {}
}