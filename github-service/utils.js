const { promisify } = require('util')
const { parse } = require('url')
const Joi = require('joi')

const validateWithPromise = promisify(Joi.validate)

const validate = async ({ value, schema, options = { abortEarly: false } }) =>
  validateWithPromise(value, schema, options)

const parseValidationErrorMessage = ({ error }) => {
  if (error.details && error.details.length) {
    return error.details.map(item => item.message).join(',')
  } else {
    return error.message
  }
}

const linkHeaderRegex = /\<(.*?)\>; rel="(.*?)"/
const parseLastPage = ({ linkHeader }) => {
  const links = linkHeader
    .split(',')
    .map(link => {
      const parsedLinkHeader = linkHeaderRegex.exec(link)
      if (parsedLinkHeader) {
        return {
          url: parsedLinkHeader[1],
          name: parsedLinkHeader[2],
        }
      }
    })
    .reduce((linksObject, currentItem) => {
      if (currentItem) {
        return {
          ...linksObject,
          [currentItem.name]: currentItem.url,
        }
      }
    }, {})
  return parseInt(parse(links.last, true).query.page)
}

const range = (start, end) =>
  Array.from({ length: end + 1 - start }, (v, k) => k + start)

const parsedResponse = ({ response }) => ({
  status: response.status,
  data: response.data,
  headers: response.headers,
  statusText: response.statusText,
})

module.exports = {
  validate,
  parseValidationErrorMessage,
  parseLastPage,
  range,
  parsedResponse,
}
