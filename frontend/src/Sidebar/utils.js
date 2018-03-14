export const getItems = ({ menus }) => menus.slice(-1).pop() || []
export const getValue = ({ menus, selections }) => {
  const lastMenu = getItems({ menus })
  if (!lastMenu.length) {
    return
  }
  const lastSelection = selections.slice(-1).pop()
  if (lastSelection === undefined) {
    return
  }
  return lastMenu[lastSelection]
}
