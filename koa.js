const Koa = require("koa");
const r = require("koa-route");

const app = new Koa();

app.use(async function (ctx, next) {

  // errors from the middleware stack get routed to ctx.onerror, which has some
  // default behavior for sending an error response. However, we are going to
  // rethrow the error so it can be caught and routed back to the enclosing
  // application
  ctx.onerror = err => { if (err) throw err }

  // koa sets res.statusCode to 404 automatically, so first, undo that
  // (you need to bypass ctx because its setter does a validity check)
  ctx.res.statusCode = null;
  await next()

  // now, if at the end of the middleware chain status is still null, tell koa
  // not to respond to this request
  if (ctx.status == null) {
    ctx.respond = false;
    // reset the status to its initial value, otherwise downstream handlers will
    // fail unless they explicitly set status
    ctx.status = 200;
  }
});

app.use(r.get("/koa/hello", async ctx => {
  ctx.status = 200;
  ctx.body = { hello: "koa" };
}));

app.use(r.get("/koa/not_found", async ctx => {
  ctx.status = 404;
  ctx.body = { error: "not found" };
}));

app.use(r.get("/koa/throw_error", async ctx => {
  throw new Error("Kaboom!");
}));

const handle = app.callback();

// export a function compatible with express's middleware signature
module.exports = async function middleware (req, res, next) {
  try {
    await handle(req, res);
    // if koa has not sent the response already, give control back to express
    if (!res.headersSent) next();
  } catch (err) { next(err) }
}
