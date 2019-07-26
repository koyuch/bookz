import chai from "chai";
import chaiHttp = require("chai-http");
chai.use(chaiHttp);
import "mocha";
import app, {sequelize} from "../app";
import DbHandler from "./DbHandler";
const expect = chai.expect;

describe("authors requests", () => {

  const dbHandler = new DbHandler();
  before(() => {
    dbHandler.recreateDb();
  });

  after(() => {
    dbHandler.dropDb();
  });

  it("should return all authors", () => {
    return chai.request(app).get("/authors")
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.length(2);
      expect(dict[0]).to.not.empty;
    });
  });

  it("get author", () => {
    return chai.request(app).get("/authors/1")
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.keys(["id", "firstName", "lastName"]);
    });
  });

  it("search author", () => {
    return chai.request(app).get("/authors")
    .query({lastName: "spa"})
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.length(1);
      expect(dict[0]).to.not.empty;
    });
  });

  it("create author", () => {
    const data: any = {id: 3, firstName: "Jan", lastName: "Kladivo"};
    return chai.request(app).post("/authors")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("create author 2", () => {
    const data: any = {id: 4, firstName: "Jan", lastName: "Kladivo"};
    return chai.request(app).post("/authors")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("create author validation error", () => {
    const data: any = {id: 1, firstName: "Jan", hele: 2};
    return chai.request(app).post("/authors")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include({
        error: "ValidationException",
        message: "Input validation error",
        payload: [
          {
            keyword: "additionalProperties",
            dataPath: "",
            schemaPath: "#/additionalProperties",
            params: {additionalProperty: "hele"},
            message: "should NOT have additional properties"
          },
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: {missingProperty: "lastName"},
            message: "should have required property 'lastName'"
          }
        ]
      });
    });
  });

  it("update author", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    const data: any = {firstName: "Jan", lastName: "Kladivo"};
    return agent.put("/authors/" + id)
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include(data);
    });
  });

  it("delete author", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    return agent.delete("/authors/" + id)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(204);

      return agent.get("/authors/" + id)
      .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
      .then(res => {
        expect(res).to.have.status(404);
      });
    });
  });

  it("delete author missing", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    return agent.delete("/authors/" + id)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include({
        error: "NotFoundException",
        message: "Entity Author with id 1 not found",
      });
    });
  });

});
