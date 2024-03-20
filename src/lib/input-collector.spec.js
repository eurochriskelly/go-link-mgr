// Import the functions you want to test
const { getFilePattern, getSearchString, getSelection } = require('./input-collector'); // Replace './yourModule' with the path to your module

// Mock `readline`
const mockAnswers = {
    'Enter the file pattern: ': 'test*.js',
    'Enter the search string: ': 'mockSearchString',
    'Select items (comma-separated): #1': '1,2,3',
    'Select items (comma-separated): #2': '1, 8,, ,',
};
jest.mock('readline', () => {
    return {
        createInterface: jest.fn().mockReturnValue({
            question: (query, cb) => {
                cb(mockAnswers[query]);
            },
            close: jest.fn()
        })
    };
});

describe('getFilePattern', () => {
    test('returns user input for file pattern', async () => {
        const filePattern = await getFilePattern();
        expect(filePattern).toBe('test*.js');
    });
});

describe('getSearchString', () => {
    test('returns user input for search string', async () => {
        const searchString = await getSearchString();
        expect(searchString).toBe('mockSearchString');
    });
});

describe('getSelection', () => {
    test('gets user single selection', async () => {
        const selection = await getSelection(Object.keys(mockAnswers)[2]);
        expect(selection).toContain(1)
        expect(selection.length).toBe(3)
    })

    test('Works with a badly formed string', async () => {
        const selection = await getSelection(Object.keys(mockAnswers)[3]);
        expect(selection).toContain(7)
        expect(selection.length).toBe(2)
    })
})