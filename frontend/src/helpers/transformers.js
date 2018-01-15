// @flow
export const arrayToKeyedObj = (array: Array<any>, key: string): {} => {
  return array.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
}
