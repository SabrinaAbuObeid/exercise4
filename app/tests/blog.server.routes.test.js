'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Blog = mongoose.model('Blog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, blog;

/**
 * Blog routes tests
 */
describe('Blog CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Blog
		user.save(function() {
			blog = {
				name: 'Blog Name'
			};

			done();
		});
	});

	it('should be able to save Blog instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blog
				agent.post('/blogs')
					.send(blog)
					.expect(200)
					.end(function(blogSaveErr, blogSaveRes) {
						// Handle Blog save error
						if (blogSaveErr) done(blogSaveErr);

						// Get a list of Blogs
						agent.get('/blogs')
							.end(function(blogsGetErr, blogsGetRes) {
								// Handle Blog save error
								if (blogsGetErr) done(blogsGetErr);

								// Get Blogs list
								var blogs = blogsGetRes.body;

								// Set assertions
								(blogs[0].user._id).should.equal(userId);
								(blogs[0].name).should.match('Blog Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Blog instance if not logged in', function(done) {
		agent.post('/blogs')
			.send(blog)
			.expect(401)
			.end(function(blogSaveErr, blogSaveRes) {
				// Call the assertion callback
				done(blogSaveErr);
			});
	});

	it('should not be able to save Blog instance if no name is provided', function(done) {
		// Invalidate name field
		blog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blog
				agent.post('/blogs')
					.send(blog)
					.expect(400)
					.end(function(blogSaveErr, blogSaveRes) {
						// Set message assertion
						(blogSaveRes.body.message).should.match('Please fill Blog name');
						
						// Handle Blog save error
						done(blogSaveErr);
					});
			});
	});

	it('should be able to update Blog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blog
				agent.post('/blogs')
					.send(blog)
					.expect(200)
					.end(function(blogSaveErr, blogSaveRes) {
						// Handle Blog save error
						if (blogSaveErr) done(blogSaveErr);

						// Update Blog name
						blog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Blog
						agent.put('/blogs/' + blogSaveRes.body._id)
							.send(blog)
							.expect(200)
							.end(function(blogUpdateErr, blogUpdateRes) {
								// Handle Blog update error
								if (blogUpdateErr) done(blogUpdateErr);

								// Set assertions
								(blogUpdateRes.body._id).should.equal(blogSaveRes.body._id);
								(blogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Blogs if not signed in', function(done) {
		// Create new Blog model instance
		var blogObj = new Blog(blog);

		// Save the Blog
		blogObj.save(function() {
			// Request Blogs
			request(app).get('/blogs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Blog if not signed in', function(done) {
		// Create new Blog model instance
		var blogObj = new Blog(blog);

		// Save the Blog
		blogObj.save(function() {
			request(app).get('/blogs/' + blogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', blog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Blog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blog
				agent.post('/blogs')
					.send(blog)
					.expect(200)
					.end(function(blogSaveErr, blogSaveRes) {
						// Handle Blog save error
						if (blogSaveErr) done(blogSaveErr);

						// Delete existing Blog
						agent.delete('/blogs/' + blogSaveRes.body._id)
							.send(blog)
							.expect(200)
							.end(function(blogDeleteErr, blogDeleteRes) {
								// Handle Blog error error
								if (blogDeleteErr) done(blogDeleteErr);

								// Set assertions
								(blogDeleteRes.body._id).should.equal(blogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Blog instance if not signed in', function(done) {
		// Set Blog user 
		blog.user = user;

		// Create new Blog model instance
		var blogObj = new Blog(blog);

		// Save the Blog
		blogObj.save(function() {
			// Try deleting Blog
			request(app).delete('/blogs/' + blogObj._id)
			.expect(401)
			.end(function(blogDeleteErr, blogDeleteRes) {
				// Set message assertion
				(blogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Blog error error
				done(blogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Blog.remove().exec();
		done();
	});
});