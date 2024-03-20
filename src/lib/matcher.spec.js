const SUT = require('./matcher');

describe('matcher', () => {
    it('matches files containing a simple pattern', () => {
        const files = ['file1', 'file2', 'file3']
        const pattern = 'file'
        const result = SUT.matchFiles(files, pattern)
        expect(result.length).toBe(3)
    })
    it('matches files containing a AND logic in the pattern', () => {
        const files = ['file1/bar', 'file2/bar', 'file3']
        const pattern = 'file AND bar'
        const result = SUT.matchFiles(files, pattern)
        expect(result.length).toBe(2)
        expect(result[0]).toBe('file1/bar')
        expect(result[1]).toBe('file2/bar')
    })
    it('matches no files if AND logic in the pattern is not satisfied', () => {
        const files = ['file1/bar', 'file2/bar', 'baz']
        const pattern = 'file AND baz'
        const result = SUT.matchFiles(files, pattern)
        expect(result.length).toBe(0)
    })
    it('matches multiple files if OR logic in the pattern is satisfied', () => {
        const files = ['file1/bar', 'file2/bar', 'baz']
        const pattern = 'file OR baz'
        const result = SUT.matchFiles(files, pattern)
        expect(result.length).toBe(3)
    })
})