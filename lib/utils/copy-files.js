import path from 'node:path'
import cpFile from 'cp-file'
import del from 'del'

async function copyFiles(files) {
  await Promise.all(
    files.map(async ({source, destination, destinationRelative, exists}) => {
      if (source) {
        return cpFile(source, destination)
      }

      if (!exists) {
        return
      }

      await cpFile(destination, path.resolve(`.deleted/${destinationRelative}`))
      await del(destination)
    }),
  )
}

export default copyFiles
