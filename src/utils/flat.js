const {flat: nativeFlat} = Array.prototype

function flatWithNative(array) {
  return array.flat()
}

function flat(array) {
  return array.reduce(
    (acc, current) => [
      ...acc,
      ...(Array.isArray(current) ? current : [current]),
    ],
    []
  )
}

export default (nativeFlat ? flatWithNative : flat)
