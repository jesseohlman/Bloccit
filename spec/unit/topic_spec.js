const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const sequelize = require("../../src/db/models/index").sequelize;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        sequelize.sync({force: true})
        .then((res) => {

            Topic.create({
                title: "Expeditions to Alpha Centauri",
                description: "A complication of reports from recent visits to the start system."
            })
            .then((topic) => {
                this.topic = topic;

                Post.create({
                    title: "A dive into the unconscious",
                    body: "I saw some archetypes and complexes.",

                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
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
                expect(posts[0].body).toBe("I saw some archetypes and complexes.");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
});