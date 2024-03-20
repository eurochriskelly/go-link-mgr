const rr = msg => `\x1b[31m${msg}\x1b[0m`
const yy = msg => `\x1b[33m${msg}\x1b[0m`
const gg = msg => `\x1b[32m${msg}\x1b[0m`
const bb = msg => `\x1b[34m${msg}\x1b[0m`
const ww = msg => `\x1b[37m${msg}\x1b[0m`

module.exports = { rr, yy, gg, bb, ww }