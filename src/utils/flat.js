const {flat} = Array.prototype

export default flat ? array => array.flat() : array => [].concat(...array)
