import cpFile from 'cp-file'

async function copyFiles(files) {
  await Promise.all(files.map(({source, dest}) => cpFile(source, dest)))
}

export default copyFiles
