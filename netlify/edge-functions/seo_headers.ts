type EdgeContext = {
  next: () => Promise<Response>
}

export default async (request: Request, context: EdgeContext) => {
  const response = await context.next()
  const host = new URL(request.url).hostname

  if (host !== 'betterternate.netlify.app') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}
