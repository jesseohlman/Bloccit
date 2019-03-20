const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {

    beforeEach((done) => {
        this.flair = Flair;
        this.topic = Topic;

        sequelize.sync({force: true}).then((res) => {
    

            Topic.create({
              title: "Old Toys",
              description: "I like old toys better."
            })
            .then((topic) => {
              this.topic = topic;
                
              Flair.create({
                  name: "I Love Toys!",
                  color: "red",
                  topicId = this.topicId
              })
              .then((flair) => {
                  this.flair = flair;
                  done();
              })
              .catch((err) => {
                  console.log(err);
                  done();
              });
            });
        });
    });

 /*   describe("GET /topics/create/flairs/new", () => {

        it("should render a new flair form", (done) => {
          request.get(`${base}/:topicId/flairs/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Falir");
            done();
          });
        });
      });*/

    describe("POST /topics/:topicId/flairs/create", () => {

        it("should create a new flair and redirect", (done) => {
            const options = {
                url: `${base}/:topicId/flairs/create`,
                form: {
                    name: "Toys",
                    color: "Yellow"
                }
            };
            request.post(options, (err, res, body) => {
                Post.findOne({where: {name: "Toys"}})
                .then((flair) => {
                    expect(flair).not.toBeNull();
                    expect(flair.name).toBe("Toys");
                    expect(flair.color).toBe("Yellow");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
      });

})
