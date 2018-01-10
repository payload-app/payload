declare module 'payload-api-types' {
  declare export type listReposMethodType = () => listReposReturnType
  declare export type listReposReturnType = Array<{
    name: string,
    repoId: number,
    active: boolean
  }>

  declare export type activateRepoMethodType = (repoId: number) => string
  declare export type deactivateRepoMethodType = (repoId: number) => string
}
