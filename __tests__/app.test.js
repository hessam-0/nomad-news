const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
const jestSorted = require("jest-sorted")

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
            expect(body.article.article_id).toBe(1)
            expect(typeof body.article.title).toBe("string")
            expect(body.article).toHaveProperty("created_at")
        })
    });
    it('GET: 400 - Should respond with an error message when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/xyz')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
    it('GET: 404 - Should respond with an error message when given a valid but non-existent article_id', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        })
    });
});
describe('GET /api/articles', () => {
    it('GET: 200 - Should respond an array of article objects containing the correct keys and value types', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            console.log(body)
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length).toBeGreaterThan(0);
            body.articles.forEach((article) => {
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('author' && 'title' && 'article_id' && 'topic' && 'created_at' && 'votes' && 'article_img_url' && 'comment_count')
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.topic).toBe('string')
                expect(new Date(article.created_at).toString()).not.toBe('Invalid Date')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('string')
            })
        })
    });
    it('GET: 404 - Should respond with error message if given invalid path', () => {
        return request(app)
        .get('/api/artocles')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        } )
    })
    it('GET: 200 - Should sort articles by date (descending)', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {
                descending: true
            })
        })
    })
});