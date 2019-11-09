import cpFile from 'cp-file'

async function copyFiles(files) {
  await Promise.all(
    files.map(({source, destination}) => cpFile(source, destination))
  )
}

export default copyFiles
