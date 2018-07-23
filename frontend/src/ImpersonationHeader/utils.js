const getCookieByName = ({ name }) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

export const userIsImpersonating = () => {
  return !!getCookieByName({ name: 'impersonate_payload_session_token' })
}
