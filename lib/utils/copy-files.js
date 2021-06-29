import cpFile from 'cp-file'
import del from 'del'

async function copyFiles(files) {
  await Promise.all(
    files.map(({source, destination}) => {
      if (source) {
        return cpFile(source, destination)
      }

      return del(destination)
    })
  )
}

export default copyFiles
