function getPathSegments(keys) {
  if (Array.isArray(keys)) {
    return keys
  }
  const re = /\[(["'`]?)(.*?)\1]|(?:^|\.)([^.]+?)(?=$|\.|\[)/g

  const parts = []

  let result
  while ((result = re.exec(keys))) {
    let property = result[2]
    if (property === undefined) {
      property = result[3]
    }
    parts.push(property)
  }

  return parts
}

export default getPathSegments
