// @flow

declare module 'api-types' {
  declare export type Repo = {
    activating?: boolean,
    active: boolean,
    owner: number,
    repo: boolean,
    _id: boolean,
  }

  declare export type RepoList = Array<Repo>
}
