async function request(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return res.json()
}

export const getJson = (url) => request('GET', url)
export const postJson = (url, body) => request('POST', url, body)
export const patchJson = (url, body) => request('PATCH', url, body)
export const deleteJson = (url) => request('DELETE', url)

export function firstError(errors) {
  if (!errors || errors.length === 0) return {}
  return { [errors[0].path]: errors[0].msg }
}

export async function logout() {
  await postJson('/api/logout', {})
}