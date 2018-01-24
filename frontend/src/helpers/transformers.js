// @flow
export const arrayToKeyedObj = (
  array: Array<any>,
  cb: Object => string | number,
): {} => {
  return array.reduce((acc, item) => {
    const key = cb(item)
    acc[key] = item
    return acc
  }, {})
}

export const toValues = (obj: Object) => Object.keys(obj).map(key => obj[key])
