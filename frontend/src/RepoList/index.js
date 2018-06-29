import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import RepoList from './components/RepoList'
import { selector } from './reducer'
import { generateRunRoute } from '../Routing'

export default connect(
  state => ({
    repos: state[selector].repos,
  }),
  dispatch => ({
    onActivateClick: ({ repo }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'activateRepo',
          args: {
            owner: repo.owner,
            repo: repo.repo,
            type: repo.type,
            planType: 'basic_20_usd', // TODO: we'll want a way to select this at some point
          },
        }),
      ),
    onRunClick: ({ repo }) =>
      dispatch(
        push(
          generateRunRoute({
            type: repo.type,
            ownerType: repo.ownerType,
            owner: repo.owner,
            repo: repo.repo,
            branch: repo.lastDefaultRun.branch,
            sha: repo.lastDefaultRun.sha,
          }),
        ),
      ),
  }),
)(RepoList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
