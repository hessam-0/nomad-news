const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
const jestSorted = require("jest-sorted");

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
    })
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
                expect(typeof article.comment_count).toBe('number')
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
describe('GET /api/articles/:article_id/comments', () => {
    it('GET: 200 - Should respond with an array of comments for the given article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBeGreaterThan(0);
            body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');
                expect(comment.article_id).toBe(1);
            })
        })
    });

    it('GET: 200 - Should return comments sorted by created_at in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toBeSortedBy('created_at', { descending: true });
        })
    });

    it('GET: 200 - Should return an empty array for an article with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([]);
        })
    });

    it('GET: 404 - Should respond with an error message when given a non-existent article_id', () => {
        return request(app)
        .get('/api/articles/999999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
        })
    })

    it('GET: 400 - Should respond with an error message when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/invalid/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Id');
        })
    })
});
describe('POST /api/articles/:article_id/comments', () => {
    it('POST: 201 - Should add a new comment to an article', () => {
        const comment = {
            username: 'butter_bridge',
            body: 'No comment'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(comment)
        .expect(201)
        .then(({ body })=> {
            expect(body.comment).toMatchObject({
                comment_id: expect.any(Number),
                body: 'No comment',
                article_id: 1,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
            })
            expect(new Date(body.comment.created_at).toString()).not.toBe('Invalid Date')
        })
    });
    it('POST: 400 - Should return an error if missing comment body', () => {
        const comment = {
            username: 'lurker',
            body: ''
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(comment)
        .expect(400)
        .then(({ body })=> {
            expect(body.msg).toBe('Invalid comment')
        })
    })
    it('POST: 400 - Should return an error if missing username', () => {
        const comment = {
            body: ''
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(comment)
        .expect(400)
        .then(({ body })=> {
            expect(body.msg).toBe('Invalid comment')
        })
    })
    it('POST: 404 - Should return an error if the given article_id does not exist in the db', () => {
        const comment = {
            username: 'rogersop',
            body: 'throwaway comment'
        }
        return request(app)
        .post('/api/articles/99999/comments')
        .send(comment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    it('POST: 400 - Should return an error if given an invalid article_id', () => {
        const comment = {
            username: 'rogersop',
            body: 'not a valid comment'
        }
        return request(app)
        .post('/api/articles/xyz/comments')
        .send(comment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
});
describe('PATCH /api/article/:articles_id', () => {
    it('PATCH: 200 - Should update votes and return updated article', () => {
        const votes = { inc_votes : 1};

        return request(app)
        .patch('/api/articles/1')
        .send(votes)
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
            expect(new Date(body.article.created_at).toString()).not.toBe('Invalid Date')
            expect(body.article.votes).toBe(101);
        })

    });
    it('PATCH: 200 - Should decrement votes when passed a negative number', () => {
        const decVotes = { inc_votes: -1 }

        return request(app)
        .patch('/api/articles/1')
        .send(decVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.article.votes).toBe(99);
         });

    });
    it('PATCH: 400 - Should return an error when given an invalid inc_votes', () => {
        const invalidVote = { inc_votes: "xyz" };

        return request(app)
        .patch('/api/articles/1')
        .send(invalidVote)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
      })
    });
    it('PATCH: 400 - Should return an error for invalid article_id', () => {
        const vote = { inc_votes: 1}

        return request(app)
        .patch("/api/articles/xyz")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
      })
    });
    it('PATCH: 404 - Should return an error if given non-existent article_id', () => {
        const vote = { inc_votes: 1};

        return request(app)
        .patch('/api/articles/9999')
        .send(vote)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
        })
    })
    it('PATCH: 400 - Should return an error if inc_votes is not given', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
})
describe('DELETE /api/comments/:comment_id', () => {
  it('DELETE: 204 - Should delete the givne comment by comment_id', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(({ body }) => {
        expect(body).toEqual({});
      })
    
  })
  it('DELETE: 404 - Should return an error if given non-existent comment_id', () => {
    return request(app)
    .delete('/api/comments/99999')
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe('Comment Not Found')
        
      })
  })
  it('DELETE: 400 - Should return an error if given ivalid comment_id', () => {
    return request(app)
    .delete('/api/comments/xyz')
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  it('DELETE: 204 - Should remove deleted comment from db', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(() => {
        return request(app)
        .get('/api/comments/1')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
          })
      })
    
  })
})
describe('GET /api/users', () => {
  it('GET: 200 - Should respond with an array of user objects', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('avatar_url');
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
        })
      })
  })
  it('GET: 200 - Should return users data with correct types', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body }) => {
        body.users.forEach((user) => {
          const validUrlRegExp = /^(ftp|http|https):\/\/[^ "]+$/;
          expect(typeof user.username).toBe('string');
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar_url).toBe('string');
          expect(user.avatar_url).toMatch(validUrlRegExp)
          expect(validUrlRegExp.test(user.avatar_url)).toBe(true);
        })
      })
    

  })
  it('GET: 200 - Should return an empty array if there are no users', () => {
    return db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
    .then(()=> {
       return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body })=> {
            expect(body.users).toEqual([]);
         

      })  
    })
  })
  it('GET: 404 - Should respond with an error for an invalid endpoint', () => {
    return request(app)
    .get('/api/yousirs')
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      })
  })
})
describe('GET /api/articles (sorted)', () => {
  it('GET: 200 - Should sort articles by date in descending order by default', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', {descending: true});
      })
  })
  it('GET: 200 - Should sort articles by selected column in ascending order', () => {
    return request(app)
    .get('/api/articles?sort_by=title&order=asc')
    .expect(200)
    .then(({ body }) => {
        expect(body.articles).toBeSortedBy('title', { ascending : true});
      })
  })
  it('GET: 200 - Should sort articles by votes in descending order', () => {
    return request(app)
    .get('/api/articles?sort_by=votes&order=desc')
    .expect(200)
    .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', { descending: true });
      })
  })
  it('GET: 400 - Should return an error for an invalid column to sort by', () => {
    return request(app)
    .get('/api/articles?sort_by=not-a-sortable-column')
    .expect(400)
    .then(( { body }) => {
        expect(body.msg).toBe('Bad Request: Invalid Sort Column')
      })
  })
  it('GET: 400 - Should return an error if given an invalid order to sort by', () => {
    return request(app)
    .get('/api/articles?sort_by=title&order=invalid')
    .expect(400)
    .then(( { body }) => {
        expect(body.msg).toBe('Bad Request: Invalid Sort Order')
      })
    
  })
})
describe('GET /api/articles (topics)', () => {
    it('GET: 200 - Should filter articles by topic if given valid topic query', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThan(0);
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    });
    it('GET: 200 - Should return an empty array if given valid topic query that has no articles', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toEqual([])
        })
    });
    it('GET: 200 - Should return all articles when no topic given', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThan(0)
            const uniqueTopics = body.articles.reduce((acc, article)=> {
                acc[article.topic]=true;
                return acc;},{})
            expect(Object.keys(uniqueTopics).length).toBeGreaterThan(1);
        })
    });
    it('GET: 200 - Should return all articles when the given topic is empty', () => {
        return request(app)
        .get('/api/articles?topic=')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThan(0)
            const uniqueTopics = body.articles.reduce((acc, article)=> {
                acc[article.topic]=true;
                return acc;},{})
            expect(Object.keys(uniqueTopics).length).toBeGreaterThan(1);
        })
    });
    it('GET: 200 - Should work in combination with existing sort_by query ', () => {
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=votes&order=desc')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThan(0)
            body.articles.forEach(article => { expect(article.topic).toBe('mitch')})
            expect(body.articles).toBeSortedBy('votes', { descending: true })
        })
    });
    it('GET: 404 - Should return an error when filtering by a non-existent topic', () => {
        return request(app)
        .get('/api/articles?topic=hottopic')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Topic Not Found')
        })
    });
})
