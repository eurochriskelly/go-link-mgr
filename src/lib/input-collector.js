/**
    The input collector is an interface that takes care of gathering user input for this tool.  It's operations include:
 */
const { bb } = require('./colors')


const getFilePattern = () => {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        readline.question('Enter the file pattern: ', filePattern => {
            readline.close()
            resolve(filePattern)
        })
    })
}

const getSearchString = () => {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        readline.question('Enter the search string: ', searchString => {
            readline.close()
            resolve(searchString)
        })
    })
}

const getSelection = (prompt) => {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        readline.question(prompt, numRange => {
            readline.close()
            resolve(numRange.split(',')
                .map(x => x.trim())
                .filter(x => x)
                .map(x => +x)
                .map(x => x - 1))
        })
    })

}

module.exports = { getFilePattern, getSearchString, getSelection } 