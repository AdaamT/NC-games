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

describe.only("api/reviews/:review_id", () => {
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
});
