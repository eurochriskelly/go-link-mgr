#!/usr/bin/env node

const { findByName, findByContent } = require('./lib/find-files')

const ARGS = {}

const main = () => {
    processArgs()
    switch (ARGS.command) {
        case 'find-by-name':
            findByName(ARGS)
            break

        case 'find-by-content':
            findByContent(ARGS)
            break

        default:
            console.log('Invalid command: ' + ARGS.command)
            break;
    }
}

const processArgs = () => {
    process.argv.forEach((val, index) => {
        if (index > 1) {
            const [key, value] = val.split('=')
            ARGS[key] = value ? value.trim() : null
            switch (key) {
                case '--find-by-name':
                case '--find-by-content':
                    ARGS.command = key.replace('--', '')
    
                    break
                default:
                    break
            }
        }
    })
}

main()
