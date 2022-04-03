const {createLogger,transport,format } = require('winston');
const logger = createLogger({
    transports:[
        new transport.Console({
            level: 'info'
        })
    ]
})

module.exports = logger;