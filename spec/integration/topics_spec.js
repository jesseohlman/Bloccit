const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

describe("routes : topics", () => {

    beforeEach((done) => {
        this.topic;
        sequelize.sync({force: true}).then((res) => {
  
         Topic.create({
           title: "JS Frameworks",
           description: "There is a lot of them"
         })
          .then((topic) => {
            this.topic = topic;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
  
        });
  
      });


  describe("member user performing CRUD actions for Topic", () => {

    beforeEach((done) => {
      User.create({
        email: "member@example.com",
        password: "123456",
        role: "member"
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        },
        (err, res, body) => {
          done();
        })
      })
    });

    describe("GET /topics", () => {
  
      it("should return a status code 200 and all topics", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("GET /topics/new", () => {

     it("should not render a new topic form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("New Topic");
        done();
      });
     });
   });

   describe("POST /topics/create", () => {
     const options = {
       url: `${base}create`,
       form: {
         title: "blink-182 songs",
         description: "What's your favorite blink-182 song?"
       }
     };

     it("should not create a new topic", (done) => {

       request.post(options, (err, res, body) => {
         Topic.findOne({where: {title: "blink-182 songs"}})
         .then((topic) => {
           expect(topic).toBeNull();
           done();
         })
         .catch((err) => {
           console.log(err);
           done();
         });
       });
     });
   });

   describe("GET /topics/:id", () => {

     it("should render a view with a selected topic", (done) => {
       request.get(`${base}${this.topic.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });

   describe("POST /topics/:id/destroy", () => {

     it("should delete the topic with the associated ID", (done) => {

       Topic.all()
       .then((topics) => {
         const topicCountBeforeDelete = topics.length;

         expect(topicCountBeforeDelete).toBe(1);

         request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
           Topic.all()
           .then((topics) => {
             expect(topics.length).toBe(topicCountBeforeDelete);
             done();
           });
         });
       });
     });
   });

   describe("GET /topics/:id/edit", () => {

     it("should render a view with an edit topic form", (done) => {

       request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).not.toContain("Edit Topic");
         expect(body).toContain("JS Frameworks");
         done();
       });
     });
   });
   
   describe("POST /topics/:id/update", () => {

     it("should not update the topic with the given values", (done) => {
       const options = {
         url: `${base}${this.topic.id}/update`,
         form:{
           title: "JavaScript Frameworks",
           description: "There are a lot of them"
         }
       };

       request.post(options, (err, res, body) => {

         expect(err).toBeNull();

         Topic.findOne({
           where: { id: this.topic.id }
         })
         .then((topic) => {
           expect(topic.title).toBe("JS Frameworks");
           done();
         });
       });
     });
   });
  });


  describe("admin user performing CRUD actions for Topic", () => {

    beforeEach((done) => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      })
      .then((user) => {
        request.get({         
          url: "http://localhost:3000/auth/fake",
          form: {
            email: user.email,   
            userId: user.id,
            role: user.role,
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });
    });

 describe("GET /topics", () => {

   it("should return a status code 200 and all topics", (done) => {
     request.get(base, (err, res, body) => {
       expect(res.statusCode).toBe(200);
       expect(err).toBeNull();
       expect(body).toContain("Topics");
       expect(body).toContain("JS Frameworks");
       done();
     });
   });
 });

 describe("GET /topics/new", () => {

  it("should render a new topic form", (done) => {
   request.get(`${base}new`, (err, res, body) => {
     expect(err).toBeNull();
     expect(body).toContain("New Topic");
     done();
   });
  });
});

describe("POST /topics/create", () => {
  const options = {
    url: `${base}create`,
    form: {
      title: "blink-182 songs",
      description: "What's your favorite blink-182 song?"
    }
  };

  it("should create a new topic and redirect", (done) => {

    request.post(options, (err, res, body) => {
      Topic.findOne({where: {title: "blink-182 songs"}})
      .then((topic) => {
        expect(res.statusCode).toBe(303);
        expect(topic.title).toBe("blink-182 songs");
        expect(topic.description).toBe("What's your favorite blink-182 song?");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  it("should not create a new topic if validation fails", (done) => {
    const options = {
      url: `${base}create`,
      form: {
        title: "as",
        description: "bo"
      }
    };

    request.post(options,
      (err, res, body) => {

        Topic.findOne({where: {title: "as"}})
        .then((topic) => {
          expect(topic).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
  })
});

describe("GET /topics/:id", () => {

  it("should render a view with a selected topic", (done) => {
    request.get(`${base}${this.topic.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("JS Frameworks");
      done();
    });
  });
});

describe("POST /topics/:id/destroy", () => {

  it("should delete the topic with the associated ID", (done) => {

    Topic.all()
    .then((topics) => {
      const topicCountBeforeDelete = topics.length;

      expect(topicCountBeforeDelete).toBe(1);

      request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
        Topic.all()
        .then((topics) => {
          expect(err).toBeNull();
          expect(topics.length).toBe(topicCountBeforeDelete - 1);
          done();
        });
      });
    });
  });
});

describe("GET /topics/:id/edit", () => {

  it("should render a view with an edit topic form", (done) => {

    request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Topic");
      expect(body).toContain("JS Frameworks");
      done();
    });
  });
});

describe("POST /topics/:id/update", () => {

  it("should update the topic with the given values", (done) => {
    const options = {
      url: `${base}${this.topic.id}/update`,
      form:{
        title: "JavaScript Frameworks",
        description: "There are a lot of them"
      }
    };

    request.post(options, (err, res, body) => {

      expect(err).toBeNull();

      Topic.findOne({
        where: { id: this.topic.id }
      })
      .then((topic) => {
        expect(topic).not.toBeNull();
        expect(topic.title).toBe("JavaScript Frameworks");
        done();
      });
    });
  });
});
});


});