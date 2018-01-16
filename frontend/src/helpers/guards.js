// @flow
export const getElementById = (elementName: string) => {
  const root = document.getElementById(elementName)
  if (root === null) {
    throw new Error(`Element ${elementName} does not exist`)
  }
  return root
}
