const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;


describe("routes : posts", () => {

    

        describe("member user performing CRUD actions for Topic", () => {

          beforeEach((done) => {
            this.topic;
            this.post;
            this.user;
        
            sequelize.sync({force: true}).then((res) => {
              User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe",
                role: "member"
              })
              .then((user) => {
                this.user = user;
        
                User.create({
                  email: "tarman@tesla.com",
                  password: "Rekkie4lyfe",
                  role: "member"
                }).then((user) => {

              Topic.create({
                title: "Winter Games",
                description: "Post your Winter Games stories.",
              posts: [{
                title: "Snowball Fighting",
                body: "So much snow!",
                userId: 2
                //added one so the current user is not the owner
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

                request.get({
                  url: "http://localhost:3000/auth/fake",
                  form: {
                    role: this.user.role,
                    userId: this.user.id,
                    email: this.user.email
                  }
                },
                (err, res, body) => {
                  done();
                }) 
                })
                .catch((err) => {
                  console.log(err);
                  done();
                      })
                    })
                  })
                })
              });
              
        
  
          describe("GET /topics/:topicId/posts/new", () => {

            it("should render a new post form", (done) => {
              request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Post");
                done();
              });
            });
          });
    
        describe("POST /topics/:topicId/posts/create", () => {
    
            it("should create a new post and redirect", (done) => {
                const options = {
                    url: `${base}/${this.topic.id}/posts/create`,
                    form: {
                        title: "Watching snow melt",
                        body: "Without a doubt my favorite thing to do besides watching paint dry!"
                    }
                };
                request.post(options, (err, res, body) => {
                    Post.findOne({where: {title: "Watching snow melt"}})
                    .then((post) => {
                        expect(post).not.toBeNull();
                        expect(post.title).toBe("Watching snow melt");
                        expect(post.body).toBe("Without a doubt my favorite thing to do besides watching paint dry!");
                        expect(post.topicId).not.toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
    
            it("should not create a new post that fails validations", (done) => {
              const options = {
                url: `${base}/${this.topic.id}/posts/create`,
                form: {
                  title: "a",
                  body: "b"
                }
              };
    
              request.post(options, (err, res, body) => {
                Post.findOne({where: {title: "a"}})
                .then((post) => {
                  expect(post).toBeNull();
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
              });
            });
          });
  
          describe("GET /topics/:topicId/posts/:id/edit", () => {
  
            it("should not render a view with an edit post form", (done) => {
              request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).not.toContain("Edit Post");
                expect(body).toContain("Snowball Fighting");
                done();
              });
            });
          });
        
          describe("POST /topics/:topicId/posts/:id/update", () => {
  
            it("should not update the post with the given values", (done) => {
              const options = {
                url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                form: {
                  title: "Snowman Building Competition"
                }
              };
              request.post(options, (err, res, body) => {
  
                expect(err).toBeNull();
  
                Post.findOne({
                  where: {id: this.post.id}
                })
                .then((post) => {
                  expect(post.title).not.toBe("Snowman Building Competition");
                  done();
                });
              });
            });
          });
  
          
        describe("GET /topics/:topicId/posts/:id", () => {
  
          it("should render a view with the selected post", (done) => {
              request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                  expect(res.statusCode).toBe(200);
                  expect(err).toBeNull();
                  expect(body).toContain("Snowball Fighting");
                  done();
              });
          });
        });

        describe("POST /topics/:topicId/posts/:id/destroy", () => {

          it("should not delete the post with the associated ID", (done) => {
        
            expect(this.post.id).toBe(1);
            
            request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
        
              Post.findById(1)
              //edit posts/show view so that non-owners/admins don't see 
              //the delete option
              .then((post) => {
                expect(err).toBeNull();
                expect(post).not.toBeNull();
                done();
              })
            });
          });
        });

      });
 //end member section


 describe("owner user performing CRUD actions for Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        role: "member"
      })
      .then((user) => {
        this.user = user;

      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories.",
      posts: [{
        title: "Snowball Fighting",
        body: "So much snow!",
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

        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: this.user.role,
            userId: this.user.id,
            email: this.user.email
          }
        },
        (err, res, body) => {
          done();
        }) 
        })
        .catch((err) => {
          console.log(err);
          done();
            })
          })
        })
      });
      

  describe("GET /topics/:topicId/posts/:id/edit", () => {

    it("should render a view with an edit post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(this.post.userId).toBe(this.user.id);
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {

    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly."
        }
      }, (err, res, body) => {
        expect(this.post.userId).toBe(this.user.id);
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "So much snow!"
        }
      };
      request.post(options, (err, res, body) => {

        expect(err).toBeNull();

        Post.findOne({
          where: {id: this.post.id}
        })
        .then((post) => {
          expect(this.post.userId).toBe(this.user.id);
          expect(post.title).toBe("Snowman Building Competition");
          done();
        });
      });
    });
  });

  
describe("GET /topics/:topicId/posts/:id", () => {

  it("should render a view with the selected post", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
      });
  });
    it("should show a 0 for votes, if there are no votes", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
        expect(body).toContain("0");
        done();
      })
    })
  
    it("should show the sum of all the votes on the post", (done) => {
        User.create({
            email: "usaine@gmail.com",
            password: "borgon4"
          }).then((user) => {
            Vote.create({
                value: 1,
                userId: user.id,
                postId: this.post.id
            });
            Vote.create({
                value: 1,
                userId: this.user.id,
                postId: this.post.id
            }).then((vote) => {
              request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                expect(body).toContain("2");
                done();
              })
              })
              .catch((err) => {
                  console.log(err);
                  done();
              })
        })
    });

      it("should show 'You upvoted this post' if the user did", (done) => {
        Vote.create({
          value: 1,
          userId: this.user.id,
          postId: this.post.id
      }).then((vote) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(body).toContain("You upvoted this post");
          done();
        })
        })
        .catch((err) => {
            console.log(err);
            done();
        })
      });

      it("should show 'You downvoted this post' if the user did", (done) => {
        Vote.create({
          value: -1,
          userId: this.user.id,
          postId: this.post.id
      }).then((vote) => {
        request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(body).toContain("You downvoted this post");
          done();
        })
        })
        .catch((err) => {
            console.log(err);
            done();
        })
      });

});

describe("POST /topics/:topicId/posts/:id/destroy", () => {

  it("should delete the post with the associated ID", (done) => {

    expect(this.post.id).toBe(1);
    expect(this.post.userId).toBe(this.user.id);

    request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {

      Post.findById(1)
      .then((post) => {
        expect(err).toBeNull();
        expect(post).toBeNull();
        done();
      })
    });
  });
});
  
});

//end owner section


 describe("admin user performing CRUD actions for Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

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
      posts: [{
        title: "Snowball Fighting",
        body: "So much snow!",
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

        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: this.user.role,
            userId: this.user.id,
            email: this.user.email
          }
        },
        (err, res, body) => {
          done();
        }) 
        })
        .catch((err) => {
          console.log(err);
          done();
            })
          })
        })
      });
      

  describe("GET /topics/:topicId/posts/new", () => {

    it("should render a new post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

describe("POST /topics/:topicId/posts/create", () => {

    it("should create a new post and redirect", (done) => {
        const options = {
            url: `${base}/${this.topic.id}/posts/create`,
            form: {
                title: "Watching snow melt",
                body: "Without a doubt my favorite thing to do besides watching paint dry!"
            }
        };
        request.post(options, (err, res, body) => {
            Post.findOne({where: {title: "Watching snow melt"}})
            .then((post) => {
                expect(post).not.toBeNull();
                expect(post.title).toBe("Watching snow melt");
                expect(post.body).toBe("Without a doubt my favorite thing to do besides watching paint dry!");
                expect(post.topicId).not.toBeNull();
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    it("should not create a new post that fails validations", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "a",
          body: "b"
        }
      };

      request.post(options, (err, res, body) => {
        Post.findOne({where: {title: "a"}})
        .then((post) => {
          expect(post).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {

    it("should render a view with an edit post form", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {

    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly."
        }
      }, (err, res, body) => {
        expect(this.post.userId).toBe(this.user.id);
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the post with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "So much snow!"
        }
      };
      request.post(options, (err, res, body) => {

        expect(err).toBeNull();

        Post.findOne({
          where: {id: this.post.id}
        })
        .then((post) => {
          expect(post.title).toBe("Snowman Building Competition");
          done();
        });
      });
    });
  });
  
describe("GET /topics/:topicId/posts/:id", () => {

  it("should render a view with the selected post", (done) => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Snowball Fighting");
          done();
      });
  });
});

describe("POST /topics/:topicId/posts/:id/destroy", () => {

  it("should delete the post with the associated ID", (done) => {

    expect(this.post.id).toBe(1);

    request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {

      Post.findById(1)
      .then((post) => {
        expect(err).toBeNull();
        expect(post).toBeNull();
        done();
      })
    });
  });
});

 });
//end admin section


});

    

 

 