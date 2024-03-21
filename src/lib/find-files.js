const { lstat, readlinkSync, readdirSync, mkdirSync, symlinkSync, lstatSync, link } = require('fs')
const fs = require('fs').promises
const { resolve, basename, extname, join } = require('path')
const { homedir } = require('os')
const simpleGit = require('simple-git')
const { matchFiles } = require('./matcher')
const { getFilePattern, getSelection } = require('./input-collector')
const { rr, yy, gg, bb, ww } = require('./colors')

const findByName = async (ARGS) => {
    const filePattern = ARGS['--file-pattern'] || await getFilePattern()
    console.log(gg(`Finding files with pattern: ${filePattern} starting from base-dir [${ARGS['--base-dir'] || '.'}]`))
    const startPath = resolve(ARGS['--base-dir'].replace('~', homedir()) || '.')
    // for each directory in startPath, check if it is a git repo
    const dirs = readdirSync(startPath, { withFileTypes: true })
    var index = 1
    const filterList = []
    dirs.forEach(async dir => {
        if (dir.isDirectory()) {
            const git = simpleGit(resolve(startPath, dir.name))
            await git.checkIsRepo(async (err, isRepo) => {
                if (isRepo) {
                    const files = (await git.raw(['ls-files'])).split('\n')
                    const matches = matchFiles(files, filePattern)
                    if (matches.length > 0) {
                        console.log(yy(`Matches in repo: ${dir.name}:`))
                        matches.forEach(match => {
                            console.log(`  ${index++}: ${match}`)
                            filterList.push({ 
                                dir: dir.name, startPath, file: match,
                                absolutePath: resolve(startPath, dir.name, match)
                             })
                        })
                    } 
                }
            })
        }
    })
    const selection = await getSelection('Please select a file or list of files to link (e.g. 2,3,9):')
    filterList
        .filter((item, index) => selection.includes(index))
        .forEach(async item => {
            const localDir = resolve('.', 'links', item.dir)
            mkdirSync(localDir, { recursive: true })
            const fileList = await (await listPathsInDirectory(localDir))
            const absList = fileList.map(x => x.resolved)
            const linkList = fileList.map(x => x.original)
            const count = Math.max(1, ...linkList
                .map(x => x.split('/').pop())
                .map(x => +(x.split('_')[0]))
            )
            const ext = extname(item.file)
            // the file name should be {NUMBER}_{BASENAME}#{LOCAL_PATH_WITH_%}.{EXT}
            const num = `${count+1}`.padStart(2, '0')
            const base = basename(item.file, ext)
            let localPart = item.file
                .replace(basename(item.file), '')
                .replace(/\//g, '%')
            if (localPart.endsWith('%')) {
                localPart = localPart.slice(0, -1)
            }
            const localName = `${num}_${base}#${localPart}${ext}`
            console.log(yy(`Linking: ${item.absolutePath} to dir [${localDir}] with name [${localName}]`), item)
            // make directory localDir if it doesn't exist
            // create a symbolic link to the file in the localDir
            const linkPath = resolve(localDir, localName)
            // only create the link if it doesn't already exist
            if (!absList.includes(item.absolutePath)) {
                console.log(`Creating link: ${linkPath}`)
                symlinkSync(item.absolutePath, linkPath)
            } else {
                console.log('Link already exists, skipping')
            }
        })
}

const findByContent = async (ARGS) => {
    const searchString = ARGS['--search-string'] || await IC.getSearchString()
    console.log(`Finding files with pattern: ${filePattern} and containing the string: ${searchString}`)
}

async function listPathsInDirectory(directory) {
    const files = await fs.readdir(directory);
    const paths = [];

    for (const file of files) {
        const filePath = join(directory, file);
        const stats = await fs.lstat(filePath);

        if (stats.isSymbolicLink()) {
            const resolvedPath = await fs.readlink(filePath);
            paths.push({ original: filePath, resolved: resolve(directory, resolvedPath) });
        } else {
            paths.push({ original: filePath, resolved: filePath });
        }
    }

    return paths;
}

module.exports = { findByName, findByContent }