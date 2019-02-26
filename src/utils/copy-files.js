import cpFile from 'cp-file'

async function copyFiles(files) {
  await Promise.all(files.map(({source, target}) => cpFile(source, target)))
}

export default copyFiles
