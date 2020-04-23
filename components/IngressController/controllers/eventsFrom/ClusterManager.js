const debug = require('debug')(`app:ingresscontroller:eventsFrom:ClusterManager`)

// this is bound to the component
module.exports = function () {
    if (!this.app.components['ClusterManager']) return

    if (process.env.INGRESS_CONTROLLER == "nginx") {
        this.app.components['ClusterManager'].on('serviceStarted', async (info) => {
            try {
                this.ingress.addUpStream(info)
                await this.ingress.reloadNginx()
            } catch (err) {
                console.error(err)
            }
        })
        this.app.components['ClusterManager'].on('serviceStopped', async (serviceId) => {
            try {
                this.ingress.removeUpStream(serviceId)
                await this.ingress.reloadNginx()
            } catch (err) {
                console.error(err)
            }
        })
        this.app.components['ClusterManager'].on('serviceScaled', async () => {
            try {
                await this.ingress.reloadNginx()
            } catch (err) {
                console.error(err)
            }
        })
        this.app.components['ClusterManager'].on('serviceReloaded', async () => {
        })
    }

    if (process.env.INGRESS_CONTROLLER == "traefik") {
        this.app.components['ClusterManager'].on('serviceStarted', async (info) => {
            try {
                await this.ingress.addLabels(info.service, info.tag)
            } catch (err) {
                console.error(err)
            }
        })
        this.app.components['ClusterManager'].on('serviceStopped', async (serviceId) => {
        })
        this.app.components['ClusterManager'].on('serviceScaled', async () => {
        })
        this.app.components['ClusterManager'].on('serviceReloaded', async () => {
        })
    }
}
