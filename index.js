var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	
        var name = request.body.name;
	var email = request.body.email;
	var newSessionID=login.login(name,email);
	response.setHeader('Set-Cookie', 'session_id=' + newSessionID);
	response.end(login.hello(newSessionID));	
};

function del(request, response) {

 	var cookies = request.cookies;
	var tempSessionID=cookies['session_id'];
	login.logout(tempSessionID);
  	response.end('Logged out from the server\n');
};

function put(request, response) {
	
	var cookies = request.cookies;
	var tempSessionID=cookies['session_id'];
	var name=login.getName(tempSessionID);
	var email=login.getEmail(tempSessionID);
	login.logout(tempSessionID);
	var newSessionID=login.login(name,email);
	response.setHeader('Set-Cookie', 'session_id=' + newSessionID);
	response.end('Re-freshed session id '+newSessionID);
};

app.listen(8000,'127.0.0.1');

console.log("Node.JS server running at 8000...");
