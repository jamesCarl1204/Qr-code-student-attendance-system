export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

// express-validator errors -> { fieldName: 'message' } (first error lang)
export function firstError(errors) {
  if (!errors || errors.length === 0) return {}
  return { [errors[0].path]: errors[0].msg }
}
