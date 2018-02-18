const axios = require('axios')
const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object().keys({
  path: Joi.string().required(),
  accessToken: Joi.string().required(),
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
  userAgent: Joi.string().required(),
  method: Joi.string()
    .valid(['get', 'delete', 'head', 'options', 'post', 'put', 'patch'])
    .required(),
  params: Joi.object(),
  data: Joi.object(),
})

module.exports = ({ githubApiUrl }) => async ({
  path,
  accessToken,
  params = {},
  data = {},
  page = 1,
  pageSize = 30,
  userAgent = 'Payload',
  method = 'get',
}) => {
  try {
    await validate({
      value: {
        path,
        accessToken,
        page,
        pageSize,
        userAgent,
        method,
        params,
        data,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  const { status, statusText, data: responseData, headers } = await axios({
    method,
    url: `${githubApiUrl}${path}`,
    responseType: 'json',
    headers: {
      'User-Agent': userAgent,
      Authorization: `token ${accessToken}`,
    },
    params: {
      page,
      per_page: pageSize,
      ...params,
    },
    data,
    validateStatus: status => status < 500,
  })
  return {
    status,
    statusText,
    data: responseData,
    headers,
  }
}
