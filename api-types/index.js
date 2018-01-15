// @flow

declare module 'api-types' {
  declare export type Repo = {
    name: string,
    repoId: number,
    active: boolean
  }

  declare export type RepoList = Array<Repo>
}
