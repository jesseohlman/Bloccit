const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;
const User = require("../../src/db/models").User;
const Post = require("../../src/db/models").Post;


describe("routes : flairs", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;
        this.flair
    
        sequelize.sync({force: true}).then((res) => {
          User.create({
            email: "starman@tesla.com",
            password: "Trekkie4lyfe",
            role: "admin"
          })
          .then((user) => {
            this.user = user;
    
          Topic.create({
            title: "Winter Games",
            description: "Post your Winter Games stories.",
        })
          .then((topic) => {
            this.topic = topic;
            
            Post.create({
                title: "Snowball Fighting",
                body: "So much snow!",
                userId: this.user.id,
                topicId: this.topic.id,    
            })
            .then((post) => {
                this.post = post;

                Flair.create({
                    name:"I love snow!",
                    color: "white",
                    postId: this.post.id
                })
                .then((flair) => {
                    this.flair = flair
                    done();
                })
            })
            })
            })
            .catch((err) => {
                console.log(err);
                done();
                })
            })
          });
          

    describe("GET /topics/:topicId/posts/:id/flairs/new", () => {

        it("should render a new flair form", (done) => {
          request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Flair");
            done();
          });
        });
      });

    describe("POST /topics/:topicId/flairs/create", () => {

        it("should create a new flair and redirect", (done) => {
            const options = {
                url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
                form: {
                    name: "Toys",
                    color: "Yellow"
                }
            };
            request.post(options, (err, res, body) => {
                Flair.findOne({where: {name: "Toys"}})
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

      describe("GET /topics/:topicId/posts/:id/flairs/flairId/edit", () => {
  
        it("should not render a view with an edit flair form", (done) => {
          request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Flair");
            expect(body).toContain("I love snow!");
            done();
          });
        });
      });
    
      describe("POST /topics/:topicId/posts/:id/flairs/:flairId/update", () => {

        it("should not update the flair with the given values", (done) => {
          const options = {
            url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
            form: {
              name: "I hate snow!"
            }
          };
          request.post(options, (err, res, body) => {

            expect(err).toBeNull();

            Flair.findOne({
              where: {id: this.flair.id}
            })
            .then((flair) => {
              expect(flair.name).toBe("I hate snow!");
              done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
          });
        });
      });

      
    describe("GET /topics/:topicId/posts/:id/flairs/:flairId", () => {

      it("should render a view with the selected flair", (done) => {
          request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
              expect(res.statusCode).toBe(200);
              expect(err).toBeNull();
              expect(body).toContain("I love snow!");
              done();
          });
      });
    });

    describe("POST /topics/:topicId/posts/:id/flairs/:flairId/destroy", () => {

      it("should delete the flair with the associated ID", (done) => {
    
        expect(this.flair.id).toBe(1);
        
        request.post(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`, (err, res, body) => {
    
          Flair.findById(1)
          .then((flair) => {
            expect(err).toBeNull();
            expect(flair).toBeNull();
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
