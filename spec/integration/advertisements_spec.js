const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";

const sequelize = require("../../src/db/models/index").sequelize;
const Ad = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {

    beforeEach((done) => {
        this.ad;
        sequelize.sync({force: true}).then((res) => {
  
        Ad.create({
           title: "JS Frameworks",
           description: "There is a lot of them"
         })
          .then((ad) => {
            this.ad = ad;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
  
        });
  
      });
  
     describe("GET /advertisements", () => {
  
       it("should return a status code 200 and all ads", (done) => {
         request.get(base, (err, res, body) => {
           expect(res.statusCode).toBe(200);
           expect(err).toBeNull();
           expect(body).toContain("Advertisements");
           expect(body).toContain("JS Frameworks");
           done();
         });
       });
     });

     describe("GET /advertisements/new", () => {

      it("should render a new ad form", (done) => {
       request.get(`${base}new`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("New Advertisement");
         done();
       });
      });
    });

    describe("POST /advertisements/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      it("should create a new ad and redirect", (done) => {

        request.post(options, (err, res, body) => {
          Ad.findOne({where: {title: "blink-182 songs"}})
          .then((ad) => {
            expect(res.statusCode).toBe(303);
            expect(ad.title).toBe("blink-182 songs");
            expect(ad.description).toBe("What's your favorite blink-182 song?");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /advertisements/:id", () => {

      it("should render a view with a selected ad", (done) => {
        request.get(`${base}${this.ad.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /advertisements/:id/destroy", () => {

      it("should delete the ad with the associated ID", (done) => {

        Ad.all()
        .then((ads) => {
          const adCountBeforeDelete = ads.length;

          expect(adCountBeforeDelete).toBe(1);

          request.post(`${base}${this.ad.id}/destroy`, (err, res, body) => {
            Ad.all()
            .then((ads) => {
              expect(err).toBeNull();
              expect(ads.length).toBe(adCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /advertisements/:id/edit", () => {

      it("should render a view with an edit ad form", (done) => {

        request.get(`${base}${this.ad.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Advertisement");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });
    
    describe("POST /adverstisements/:id/update", () => {

      it("should update the ad with the given values", (done) => {
        const options = {
          url: `${base}${this.ad.id}/update`,
          form:{
            title: "JavaScript Frameworks",
            description: "There are a lot of them"
          }
        };

        request.post(options, (err, res, body) => {

          expect(err).toBeNull();

          Ad.findOne({
            where: { id: this.ad.id }
          })
          .then((ad) => {
            expect(ad.title).toBe("JavaScript Frameworks");
            done();
          });
        });
      });
    });
});