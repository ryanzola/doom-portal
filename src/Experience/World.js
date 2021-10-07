import * as THREE from 'three'
import Experience from './Experience'
import Portal from './Portal/Portal.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPortals()
            }
        })
    }

    setPortals() {
        this.portalA = new Portal({
            colors:
            {
                a: '#130000',
                b: '#ff000a',
                c: '#ff661e',
            }
        })
        this.portalA.group.position.z = - 1.5

        this.portalB = new Portal({
            colors:
            {
                a: '#000813',
                b: '#0078ff',
                c: '#279fff',
            }
        })
        this.portalB.group.position.z = 1.5
    }

    resize()
    {
    }

    update()
    {
        if(this.portalA)
            this.portalA.update()

        if(this.portalB)
            this.portalB.update()
    }

    destroy()
    {
    }
}