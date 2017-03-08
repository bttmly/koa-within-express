const Koa = require("koa");
const app = new Koa();

app.use(async function (ctx, next) {
  // koa sets res.statusCode to 404 automatically, so first, undo that
  // (you need to bypass ctx because it does a check for valid status code)
  ctx.res.statusCode = null;
  await next()
  // now, if at the end of the middleware chain status is still null, tell koa
  // not to respond to this request
  if (ctx.status == null) {
    ctx.respond = false;
  }
});

app.use(function (ctx) {
  if (ctx.url === "/hello") {
    ctx.status = 200;
    ctx.body = { hello: "koa" };
  }
});

const cb = app.callback();

// export a function compatible with express's middleware signature
module.exports = async function middleware (req, res, next) {
  await cb(req, res);
  // if koa has not sent the response already, give control back to express
  if (!res.headersSent) next();
}
