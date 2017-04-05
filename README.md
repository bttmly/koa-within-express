# koa-within-express

A [recent change](https://github.com/koajs/koa/pull/848) to Koa makes interop with Express much easier. This repo contains a tiny example of how to have Express handle some routes, pass control to Koa, and then have Koa pass control back to Express if it can't handle a request.

## Notes
- Must override `ctx.onerror` to catch errors and pass them back to Express for handling
- Be sure not to call `next` if Koa handled the response
- Need some way of detecting if some handler in the Koa middleware stack is trying to send a response. Here the approach is to null out `res.statusCode` and see if it was set after the middleware stack has run.
- Be sure to reset the response status code to 200 if not handling the response
