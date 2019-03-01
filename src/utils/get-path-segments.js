import isUndefined from './is-undefined'

function getPathSegments(keys) {
  if (Array.isArray(keys)) {
    return keys
  }
  const re = /(?:\[(['"`]?)(.*?)\1\])|(?:(?:^|\.)([^.]+?)(?=$|\.|\[))/g

  const parts = []

  let res
  while ((res = re.exec(keys))) {
    let prop = res[2]
    if (isUndefined(prop)) {
      prop = res[3]
    }
    parts.push(prop)
  }

  return parts
}

export default getPathSegments
