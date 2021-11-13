import * as THREE from 'three'
import Experience from '../Experience'
import Particles from "./Particles"
import Halo from './Halo'
import EventHorizon from "./EventHorizon"
import Smoke from './Smoke'

export default class Portal {
  constructor(_options) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug

    if(this.debug)
    {
      this.debugFolder = this.debug.addFolder({
        title: 'portal',
        expanded: false
      })
    }

    this.colorSettings = _options.colors

    this.group = new THREE.Group()
    this.scene.add(this.group)

    this.setColors()
    this.setParticles()
    this.setHalo()
    this.setEventHorizon()
    this.setSmoke()
    this.setBacking()
  }

  setColors() {
    this.colors = {}

    for(let _colorName in this.colorSettings) {
      const color = {}
      color.value = this.colorSettings[_colorName]
      color.instance = new THREE.Color(color.value)

      this.colors[_colorName] = color
    }

    if(this.debug)
    {
        for(const _colorName in this.colors)
        {
            const color = this.colors[_colorName]

            this.debugFolder.addInput(
              color,
              'value',
              { label: _colorName, view: 'color' }
            )
            .on('change', () => {
              color.instance.set(color.value)
            })
        }
    }
  }

  setParticles() {
    this.particles = new Particles({ debugFolder: this.debugFolder, colors: this.colors })
    this.group.add(this.particles.points)
  }

  setHalo() {
    this.halo = new Halo({ debugFolder: this.debugFolder, colors: this.colors })
    this.group.add(this.halo.mesh)
  }

  setEventHorizon() {
    this.eventHorizon = new EventHorizon({ debugFolder: this.debugFolder, colors: this.colors })
    this.group.add(this.eventHorizon.mesh)
  }

  setSmoke() {
    this.smoke = new Smoke({ debugFolder: this.debugFolder, colors: this.colors })
    this.group.add(this.smoke.group)
  }

  setBacking() {
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

    this.circle = {} 
    this.circle.geometry = new THREE.CircleGeometry(1, 32)

    this.circle.mesh = new THREE.Mesh(this.circle.geometry, circleMaterial)
    this.circle.mesh.position.z = -0.001

    this.group.add(this.circle.mesh)
  }

  update() {
    if(this.particles)
      this.particles.update()

    if(this.halo)
      this.halo.update()

    if(this.eventHorizon)
      this.eventHorizon.update()

    if(this.smoke)
      this.smoke.update()
  }
}