import { TOKEN_FIELD } from './forms'

export type SubmitError = 'verification' | 'invalid' | 'network' | 'server'

/** POSTs JSON to a form endpoint. Resolves on { ok: true }, otherwise throws a SubmitError. */
export async function postForm(url: string, data: object, token: string): Promise<void> {
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, [TOKEN_FIELD]: token }),
    })
  } catch {
    throw 'network' satisfies SubmitError
  }
  if (res.ok) return
  throw (
    res.status === 403 ? 'verification' : res.status === 400 ? 'invalid' : 'server'
  ) satisfies SubmitError
}
