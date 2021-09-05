const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./itsuki.js')
nocache('./itsuki.js', module => console.log(`${module} is now updated!`))

const starts = async (itsuki = new WAConnection()) => {
    itsuki.logger.level = 'warn'
    console.log(banner.string)
    itsuki.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./itsuki.json') && itsuki.loadAuthInfo('./itsuki.json')
    itsuki.on('connecting', () => {
        start('2', '2..')
    })
    itsuki.on('open', () => {
        success('2', '2..')
    })
    await itsuki.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./itsuki.json', JSON.stringify(itsuki.base64EncodedAuthInfo(), null, '\t'))

    itsuki.on('chat-update', async (message) => {
        require('./itsuki.js')(itsuki, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'Telah dipantau oleh kang bakso wkwk')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
