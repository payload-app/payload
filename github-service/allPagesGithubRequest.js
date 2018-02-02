const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
  parsedResponse,
  range,
  parseLastPage,
} = require('./utils')
const githubRequest = require('./githubRequest')

const schema = Joi.object().keys({
  path: Joi.string().required(),
  accessToken: Joi.string().required(),
  pageSize: Joi.number().required(),
  userAgent: Joi.string().required(),
  method: Joi.string()
    .valid(['get', 'delete', 'head', 'options', 'post', 'put', 'patch'])
    .required(),
})

module.exports = ({ githubApiUrl }) => async ({
  path,
  accessToken,
  pageSize = 30,
  userAgent = 'Payload',
  method = 'get',
}) => {
  try {
    await validate({
      value: {
        path,
        accessToken,
        pageSize,
        userAgent,
        method,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const ghRequest = githubRequest({ githubApiUrl })
  const githubArgs = {
    path,
    accessToken,
    githubApiUrl,
    userAgent,
    method,
    page: 1,
    pageSize,
  }
  const response = await ghRequest(githubArgs)
  if (response.status !== 200) {
    return [parsedResponse({ response })]
  }
  const linkHeader = response.headers.link
  if (!linkHeader) {
    return [parsedResponse({ response })]
  }
  const responses = [parsedResponse({ response })]
  for (let page of range(2, parseLastPage({ linkHeader }))) {
    console.log('page', page)
    const response = await ghRequest({
      ...githubArgs,
      page,
    })
    responses.push({
      ...parsedResponse({ response }),
      page,
    })
  }
  console.log(responses)
  return responses
}
