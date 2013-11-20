var _ = require('underscore'),
	keystone = require('keystone');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',      key: 'home',      href: '/home',          layout: 'left' },
		{ label: 'Meetups',   key: 'meetups',   href: '/meetups',   layout: 'left' },
		{ label: 'Members',   key: 'members',   href: '/members',   layout: 'left' },
		{ label: 'Links',     key: 'links',     href: '/links',     layout: 'left' },
		{ label: 'Blog',      key: 'blog',      href: '/blog',      layout: 'right' },
		{ label: 'About',     key: 'about',     href: '/about',     layout: 'right' },
		{ label: 'Mentoring', key: 'mentoring', href: '/mentoring', layout: 'right' }
	];
	
	locals.user = req.user;

	locals.qs_set = qs_set(req, res);
	
	next();
	
};


/**
	Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function(req, res, next) {
	
	res.err = function(err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}
	
	res.notfound = function(title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
	
	next();
	
};


/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = exports.qs_set = function(req, res) {

	return function qs_set(obj) {

		var params = _.clone(req.query);

		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}

		var qs = querystring.stringify(params);

		return req.path + (qs ? '?' + qs : '');

	}

}
