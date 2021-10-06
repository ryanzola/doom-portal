import Particles from "./Particles"
import Halo from './Halo'
import EventHorizon from "./EventHorizon"
import Smoke from './Smoke'

export default class Portal {
  constructor() {
    this.setParticles()
    this.setHalo()
    this.setEventHorizon()
    this.setSmoke()
  }

  setParticles() {
    this.particles = new Particles()
  }

  setHalo() {
    this.halo = new Halo()
  }

  setEventHorizon() {
    this.eventHorizon = new EventHorizon()
  }

  setSmoke() {
    this.smoke = new Smoke()
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