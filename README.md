# koa-within-express

A [recent change](https://github.com/koajs/koa/pull/848) to Koa makes interop with Express much easier. This repo contains a tiny example of how to have Express handle some routes, pass control to Koa, and then have Koa pass control back to Express if it can't handle a request.
