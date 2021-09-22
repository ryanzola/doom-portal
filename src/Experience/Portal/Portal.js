import Particles from "./Particles"
import Halo from './Halo'

export default class Portal {
  constructor() {
    this.setParticles()
    this.setHalo()
  }

  setParticles() {
    this.particles = new Particles()
  }

  setHalo() {
    this.halo = new Halo()
  }

  update() {
    if(this.particles)
      this.particles.update()

    if(this.halo)
      this.halo.update()
  }
}