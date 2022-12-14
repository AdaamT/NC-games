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

describe("api/reviews", () => {
  describe("GET", () => {
    test("should respond with an array of objects with each object having a property of: owner, title, review_id, category, review_img_url, created_at, votes, designer, comment count", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
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
    test("should respond with an array of objects sorted by date in DESC order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
    });
    test("should return all reviews by the category query", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews.length > 0).toBe(true);
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("category", "dexterity");
          });
        });
    });
    test("200: returns an empty array when the query exists but has no reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toEqual([]);
        });
    });
  });
  describe("ERRORS", () => {
    test("404: returns a message when there is a category which does not exist", () => {
      return request(app)
        .get("/api/reviews?category=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("banana not found");
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
          expect(review).toEqual(expect.objectContaining(testReview));
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
    test("Using the request body, should update the review object vote property and return the updated review object", () => {
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
  describe("PATCH ERRORS", () => {
    test("404: not found - when given an Id which is out of range", () => {
      return request(app)
        .patch("/api/reviews/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No review found for review_id: 99999");
        });
    });
    test("400: bad request - when given a malformed body/missing required fields ", () => {
      const patchObj = {};
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("400: bad request - when using wrong data type ", () => {
      const patchObj = { inc_votes: "banana" };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("COMMENT COUNT", () => {
    test("review response object should include a comment count property", () => {
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
            comment_count: 3,
          };
          expect(review).toEqual(testReview);
        });
    });
    test("review response object should include a comment count property value of 0", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          const review = body.review;
          const testReview = {
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 1,
            comment_count: 0,
          };
          expect(review).toEqual(testReview);
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

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: responds with array of comments related to given review_id sorted by most recent first", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        expect(comments).toBeSortedBy("created_at", {
          descending: false,
          coerce: true,
        });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            })
          );
        });
      });
  });
  test("200: responds with an empty array when review_id has no related comments and message", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  test("404: returns an error message when passed correct data type for a review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review found for review_id: 9999");
      });
  });
  test("400: responds with correct error status when invalid datatype used", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = { username: "mallionaire", body: "I love this game!" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            body: "I love this game!",
            votes: 0,
            author: "mallionaire",
            review_id: 4,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: responds with error message when username is not given", () => {
    const newComment = { body: "banana" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Username required");
      });
  });
  test("400: responds with error message when body is not given", () => {
    const newComment = { username: "banana" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Body required");
      });
  });
  test("400: responds with error message when username does not exist", () => {
    const newComment = { username: "banana", body: "test12345" };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: returns an error message when passed correct data type but a review_id that does not exist", () => {
    const newComment = { username: "mallionaire", body: "I love this game!" };
    return request(app)
      .post("/api/reviews/123456789/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review found for review_id: 123456789");
      });
  });
  test("400: responds with correct error status when invalid datatype used", () => {
    const newComment = { username: "mallionaire", body: "I love this game !" };
    return request(app)
      .post("/api/reviews/test/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET api/reviews", () => {
  test("200: should return all reviews ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;

        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              owner: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("should respond with an array of objects sorted by date in DESC order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return all reviews by the category query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length > 0).toBe(true);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("category", "dexterity");
        });
      });
  });
  test("200: returns an empty array when the query exists but has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([]);
      });
  });
  test("404: returns a message when there is a category which does not exist", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("banana not found");
      });
  });
  test(" 200 - returns array of reviews sorted by comment_count in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("200 - returns array of reviews sorted by created_at by defualt in asccending order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200 - returns array of reviews in ascending order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("200 - returns array of reviews in filtered by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("ERROR - status 400 - returns bad request when sorting by non-existent column", () => {
    return request(app)
      .get("/api/reviews?sort_by=nocolumn")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sort_by value does not exist");
      });
  });
  test("ERROR - status 400 - returns bad request when ordering by something other than ASC or DESC", () => {
    return request(app)
      .get("/api/reviews?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Order does not exist - use asc or desc");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Should delete comment with associated id ", () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(() => {
        return request(app)
          .delete(`/api/comments/${comment_id}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(`${comment_id} does not exist`);
          });
      });
  });
  test("400:responds with correct error status when invalid datatype used", () => {
    const comment_id = "banana";
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: returns an error message when passed correct data type but a comment_id that does not exist", () => {
    const comment_id = 981;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`${comment_id} does not exist`);
      });
  });
});
