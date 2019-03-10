const {flat: nativeFlat} = Array.prototype

function flatWithNative(arr) {
  return arr.flat()
}

function flat(arr) {
  return arr.reduce(
    (acc, current) => [
      ...acc,
      ...(Array.isArray(current) ? current : [current]),
    ],
    []
  )
}

export default (nativeFlat ? flatWithNative : flat)
