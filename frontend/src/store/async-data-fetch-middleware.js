import RPCClient from '@hharnisc/micro-rpc-client';
import {
  actions as fetchActions,
  actionTypes,
} from '@hharnisc/async-data-fetch';

// hax
export const actions = {
  fetch: ({ name, args, transform }) => ({
    type: actionTypes.FETCH,
    name,
    args,
    transform,
  })
}

export default ({
  rpcClientOptions
}) => (store) => {
  let counter = 0;
  const rpc = new RPCClient(rpcClientOptions);
  return next => (action) => {
    next(action);
    switch (action.type) {
      case actionTypes.FETCH: {
        const id = counter++; // eslint-disable-line no-plusplus
        const args = action.args || {};

        store.dispatch(fetchActions.fetchStart({
          name: action.name,
          args,
          id,
        }));

        rpc.call(action.name, args)
          .then(result => store.dispatch(fetchActions.fetchSuccess({
            name: action.name,
            args,
            id,
            // add transform option here
            result: action.transform ? action.transform(result) : result,
          })))
          .catch((error) => {
            store.dispatch(fetchActions.fetchFail({
              name: action.name,
              args,
              id,
              error: error.message,
            }));
          });
        break;
      }
      default:
        break;
    }
  };
};
