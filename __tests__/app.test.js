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

describe.only("api/reviews", () => {
  describe("GET", () => {
    test("should respond with an array of objects with each object having a property of: owner, title, review_id, category, review_img_url, created_at, votes, designer, comment count", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .send(({ body }) => {
          expect(body.reviews.length > 0).toBe(true);
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("review_id");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("comment_count");
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
  describe("PATCH", () => {
    test("should add a response body to the request object ", () => {});
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
