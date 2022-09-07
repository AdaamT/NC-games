const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");
afterAll(() => db.end());

beforeEach(() => {
  return seed(testData);
});

describe("api/categories", () => {
  describe("GET", () => {
    test("should return an array of category objects, each of which should have the following properties: slug, description ", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length > 0).toBe(true);
          body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
});

describe("api/reviews/:review_id", () => {
  describe("GET", () => {
    test("should respond with corresponding review", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const review = body.review;
          const testReview = {
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: expect.any(String),
            votes: 5,
          };
          expect(review).toEqual(testReview);
        });
    });
  });
  describe("ERRORs", () => {
    test("400: bad request - when given an endpoint that does not exist", () => {
      return request(app)
        .get("/api/reviews/dogs")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404: not found - when given an Id which is out of range", () => {
      return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No review found for review_id: 99999");
        });
    });
  });
  describe.only("PATCH", () => {
    test("Using the request body, should update the review object vote property ", () => {
      const patchObj = { inc_votes: 1 };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(200)
        .then(({ body }) => {
          const { updatedReview } = body;
          const testReview = {
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: expect.any(String),
            votes: 6,
          };
          expect(updatedReview).toEqual(testReview);
          expect(updatedReview.votes).toBe(6);
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("should return an array of objects, with each object having a property of username, name, and avatar", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length > 0).toBe(true);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
