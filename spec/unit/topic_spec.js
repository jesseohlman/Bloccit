const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        this.user;

        sequelize.sync({force: true})
        .then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

            Topic.create({
                title: "Expeditions to Alpha Centauri",
                description: "A complication of reports from recent visits to the start system.",

                posts: [{
                    title: "My first visit to Proxima Centauri b",
                    body: "I saw some rocks.",
                    userId: this.user.id
                }]
            }, {
                include: {
                    model: Post,
                    as: "posts"
                }
            })
                .then((topic) => {
                    this.topic = topic;
                    this.post = topic.posts[0];
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
              })
            })
        });

    describe("#create()", () => {

        it("should create a new topic and store it", (done) => {
            Topic.create({
                title: "A dive into the unconscious",
                description: "I saw some archetypes and complexes."
            })
            .then((topic) => {
                expect(topic.title).toBe("A dive into the unconscious");
                expect(topic.description).toBe("I saw some archetypes and complexes.");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#getPosts()", () => {

        it("should return an array of all the posts associated with the topic", (done) => {
            this.topic.getPosts()
            .then((posts) => {
                expect(posts.length).toBe(1);
                expect(posts[0].body).toBe("I saw some rocks.");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
});
