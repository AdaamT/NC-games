const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");
afterAll(() => db.end());

beforeEach(() => {
  return seed(testData);
});

describe.only("api/categories", () => {
  describe("GET", () => {
    test("should return an array of category objects, each of which should have the following properties: slug, description ", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length === 4).toBe(true);
          body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
});
