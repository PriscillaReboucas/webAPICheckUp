const assert = require("assert");
const request = require("supertest");

const api = require("./api.js");

describe("developer API should have endpoints to", () => {
  it("get all addresses", function (done) {
    request(api)
      .get("/api/addresses")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        assert.strictEqual(res.body.length, 8);
      })
      .expect(200, done);
  });

  it("add a new address", function (done) {
    request(api)
      .post("/api/addresses/")
      .set("Accept", "application/json")
      .send({ name:"Maria", street: "Boa Viagem", city: "Recife", state:"Pernambuco" })
      .expect("Content-Type", /json/)
      .expect("location", /\/api\/addresses\//)
      .expect((res) => {
        assert.strictEqual(res.body.name, "Maria");
        assert.strictEqual(res.body.street, "Boa Viagem");
        assert.strictEqual(res.body.city, "Recife");
        assert.strictEqual(res.body.state, "Pernambuco");
      })
      .expect(201, done);
  });

  it("delete the address with id 2 ", function (done) {
    request(api).del("/api/addresses/2").expect(204, done);
  });

  it("update the address with id 4 ", function (done) {
    request(api)
      .patch("/api/addresses/4")
      .set("Accept", "application/json")
      .send({ street: "Lustgårdsgatan" })
      .expect(200, done)
      .expect((res) => {
        assert.strictEqual(res.body.street, "Lustgårdsgatan");
      });
  });
});