
const wordSplitter = (pattern, token) => pattern.split(token).map(word => word.trim())

const matchFiles = (files, pattern) => {
    // check if pattern contains a logical operator
    // Logical operators are: AND, OR. Only one operator can be used at a time for now.
    if (pattern.includes('AND')) {
        const words = wordSplitter(pattern, 'AND') 
        return words.reduce((reducedList, word) => {
            return reducedList.filter(file => file.includes(word))
        }, files)
    }
    if (pattern.includes('OR')) {
        const words = wordSplitter(pattern, 'OR')
        return words.reduce((reducedList, word) => {
            return reducedList.concat(files.filter(file => file.includes(word)))
        }, [])
    }
    return files.filter(file => file.includes(pattern))
}

module.exports = { matchFiles }