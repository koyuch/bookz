import chai from "chai";
import chaiHttp = require("chai-http");
chai.use(chaiHttp);
import "mocha";
import app, {sequelize} from "../app";
import DbHandler from "./DbHandler";
const expect = chai.expect;
const token = "hele";

describe("books requests", () => {
  const dbHandler = new DbHandler();
  before(() => {
    dbHandler.recreateDb();
  });

  after(() => {
    dbHandler.dropDb();
  });

  it("should fall on authorization", () => {
    return chai.request(app).get("/books")
    .then(res => {
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include({
        error: "AuthorizationException",
        message: "You are not allowed to use this API",
      });
    });
  });

  it("should return all books", () => {
    return chai.request(app).get("/books")
      .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        const dict = JSON.parse(res.text);
        expect(dict).to.have.length(3);
      });
  });

  it("get 1 book", () => {
    return chai.request(app).get("/books/1")
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.keys(["id", "title", "description", "authors"]);
    });
  });

  it("search books", () => {
    return chai.request(app).get("/books")
    .query({title: "mo"})
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.length(1);
      expect(dict[0]).to.not.empty;
    });
  });

  it("search books - author", () => {
    return chai.request(app).get("/books")
    .query({author: {lastName: "spa"}})
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.length(3);
      expect(dict[0]).to.not.empty;
    });
  });

  it("search books - books & author", () => {
    return chai.request(app).get("/books")
    .query({title: "mo", author: {lastName: "spa"}})
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.have.length(3);
      expect(dict[0]).to.not.empty;
    });
  });

  it("create book", () => {
    const data: any = {title: "Ma laska", description: "O zivote, svete a vobec.", authors: [{firstName: "Jan", lastName: "Kladivo"}]};
    return chai.request(app).post("/books")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      data.id = 4;
      data.authors[0].id = 3;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("create book duplicate", () => {
    const data: any = {title: "Ma laska", description: "O zivote, svete a vobec.", authors: [{id: 1, firstName: "Jan", lastName: "Kladivo"}]};
    return chai.request(app).post("/books")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include({name: "SequelizeUniqueConstraintError"});
    });
  });

  it("create book 2", () => {
    const data: any = {title: "Moj svet", description: "O zivote, svete a vobec.", authors: [{id: 1, firstName: "Jan", lastName: "Kladivo"}]};
    return chai.request(app).post("/books")
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      data.id = 6;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("create book validation error", () => {
    const data: any = {title: "", id: 2, hele: 1, description: "O zivote, svete a vobec.", authors: [{id: 1, firstName: "Jan"}]};
    return chai.request(app).post("/books")
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
            keyword: "minLength",
            dataPath: ".title",
            schemaPath: "#/properties/title/minLength",
            params: {limit: 1},
            message: "should NOT be shorter than 1 characters"
          },
          {
            keyword: "required",
            dataPath: ".authors[0]",
            schemaPath: "#/properties/authors/items/required",
            params: {missingProperty: "lastName"},
            message: "should have required property 'lastName'"
          }
        ]
      });
    });
  });

  it("update book", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    const data: any = {title: "Tvoj zivot", description: "O zivote a nezivote"};
    return agent.put("/books/" + id)
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include(data);
      });
  });

  it("update book 2", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    const data: any = {id, title: "Moj zivot",
      authors: [{id: 1, lastName: "Hurmikak"}, {id: 2, firstName: "Fero", lastName: "Liptak"}]};
    return agent.put("/books/" + id)
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("update book 3", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    const data: any = {id, title: "Moj zivot",
      authors: [{lastName: "Hurmikak"}, {firstName: "Fero", lastName: "Liptak"}]};
    return agent.put("/books/" + id)
    .send(data)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.deep.include(data);
    });
  });

  it("delete book", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    return agent.delete("/books/" + id)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(204);

      return agent.get("/books/" + id)
      .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
      .then(res => {
        expect(res).to.have.status(404);
      });
    });
  });

  it("delete book missing", () => {
    const agent = chai.request.agent(app);
    const id = 1;
    return agent.delete("/books/" + id)
    .set("Authorization", "Bearer " + process.env.BEARER_TOKEN)
    .then(res => {
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      const dict = JSON.parse(res.text);
      expect(dict).to.include({
        error: "NotFoundException",
        message: "Entity Book with id 1 not found",
      });
    });
  });

});
