const { router, get } = require('microrouter')

const healthHandler = () => 'OK'

module.exports = router(get('/healthz', healthHandler))
