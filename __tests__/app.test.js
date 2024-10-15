const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const endpoints = require("../endpoints.json");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    db.end();
});

describe('GET /api/topics', () => {
    it('GET: 200 - Should respond with an array of topics with slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            const { topics } = res.body;
            expect(Array.isArray(topics)).toBe(true);
            topics.forEach((topic) => {
                expect(topic).toEqual({
                    slug : expect.any(String),
                    description : expect.any(String)
                })
            })
        })
    });
    it('GET: 404 - Should respond with error message for invalid endpoints', () => {
        return request(app)
        .get('/api/xxx')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found');
        })
    })
});

describe('GET /api', () => {
    it('GET: 200 - Should respond with endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpoints)
        })
    });
});
describe('GET /api/articles/:article_id', () => {
    it('GET: 200 - Should respond with a single article object when given a valid and existent article_id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            console.log(body, "<<???")
            expect(body.article.article_id).toBe(1)
            expect(typeof body.article.title).toBe("string")
            expect(body.article).toHaveProperty("created_at")
        })
    });
});