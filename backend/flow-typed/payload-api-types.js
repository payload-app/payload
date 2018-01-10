declare module 'payload-api-types' {
  declare export type listReposMethodType = () => listReposReturnType
  declare export type listReposReturnType = Array<{
    name: string,
    repoId: number,
    active: boolean
  }>
}
