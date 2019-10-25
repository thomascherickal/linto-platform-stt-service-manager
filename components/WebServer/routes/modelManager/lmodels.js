const debug = require('debug')('app:router:lmodels')

function answer(out, res) {
    if (out.bool) res.json(out.msg)
    else { res.status(400); res.json({ status: out.msg }) }
}

module.exports = (webserver) => {
    return [{
        path: '/',
        method: 'get',
        requireAuth: false,
        controller:
            (req, res, next) => {
                webserver.emit("getLModels", (ans) => { answer(ans, res) })
            }
    }]
}