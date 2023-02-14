import path from 'node:path'
import {copyFile} from 'cp-file'
import {deleteAsync} from 'del'

async function copyFiles(files) {
  await Promise.all(
    files.map(async ({source, destination, destinationRelative, exists}) => {
      if (source) {
        return copyFile(source, destination)
      }

      if (!exists) {
        return
      }

      await copyFile(
        destination,
        path.resolve(`.deleted/${destinationRelative}`),
      )
      await deleteAsync(destination)
    }),
  )
}

export default copyFiles
