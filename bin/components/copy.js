import path from 'path'
import fastglob from 'fast-glob'
import fs from 'fs'

const { async: glob } = fastglob;

export default async (
    src,
    dest,
    cwd,
    {
        rename = x => x,
        skip = _ => false,
        parents = true,
    } = {}
) => {
    const source = typeof src === 'string' ? [src] : src

    if (source.length === 0 || !dest || !cwd) {
        throw new TypeError('`src`, `cwd` and `dest` are required')
    }

    const sourceFiles = await glob(source, {
        cwd,
        dot: true,
        absolute: false,
        stats: false,
    })

    const destRelativeToCwd = cwd ? path.resolve(cwd, dest) : dest

    return Promise.all(
        sourceFiles.map(async (p) => {
            if (skip(path.join(cwd, p))) {
                return null;
            }

            const dirname = path.dirname(p)
            const basename = rename(path.basename(p))

            const from = cwd ? path.resolve(cwd, p) : p
            const to = parents
                ? path.join(destRelativeToCwd, dirname, basename)
                : path.join(destRelativeToCwd, basename)

            // Ensure the destination directory exists
            await fs.promises.mkdir(path.dirname(to), { recursive: true })

            return fs.promises.copyFile(from, to)
        })
    )
}
