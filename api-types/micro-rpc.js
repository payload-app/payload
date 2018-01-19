// @flow

declare module '@hharnisc/micro-rpc' {
  declare export function method<M>(name: string, method: M): any
  declare export function rpc(...methods: Array<any>): any
  declare export function createError({
    message: string,
    statusCode: number,
  }): any
}
