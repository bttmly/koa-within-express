const request = require("supertest");
const expect = require("expect");

const app = require("./app.js");

process.on("unhandledRejection", err => { throw err })

describe("koa within express", () => {
  it("serves express requests", () => {
    return request(app)
      .get("/express/hello")
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual({ hello: "express" })
      })
  })

  it("serves koa requests", () => {
    return request(app)
      .get("/koa/hello")
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual({ hello: "koa" })
      })
  })

  it("koa can send explicit 404 requests", () => {
    return request(app)
      .get("/koa/not_found")
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({ error: "not found" })
      })
  })

  it("catches errors from koa and routes them to express", () => {
    return request(app)
      .get("/koa/throw_error")
      .expect(500)
      .then(({body}) => {
        expect(body).toEqual({
          message: "Express error handler: Kaboom!",
          error: {},
        })
      })
  });

  it("yields control back to express", () => {
    return request(app)
      .get("/express/hello_again")
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual({ hello_again: "express" })
      })
  })

  it("express fall-through handling works", () => {
    return request(app)
      .get("/no_such_route")
      .expect(404)
      .then(({body}) => {
        expect(body).toEqual({
          message: "Express error handler: Express says: Not Found!",
          error: { status: 404 },
        })
      })
  })
})
