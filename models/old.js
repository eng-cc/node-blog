/*var mongodb = require('./db');

var User = function(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}



User.prototype.save = function(callback){
	var user = {
		name:this.name,
		password: this.password,
		email:this.email
	};

	mongodb.open(function(err , db){

		if (err) {
			return callback(err);
		};
		db.collection('users',function(err , collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
			collection.insert(user,{safe:true},function(err , user){
				console.log('save');
				mongodb.close();
				if (err) {
					return callback(err);
				};
				callback(null,user[0]);
			});
		});
	});
};

User.get = function(name ,callback){
	mongodb.open(function(err, db){
		if (err) {
			return callback(err);
		};
		db.collection('users',function(err,collection){
			if (err) {
				return callback(err);
			};
			collection.findOne({
				name:name
			},function(err , user){
				if (err) {
					mongodb.close();
					return callback(err);
				};
				callback(null, user);
			});
		});
	});
};*/




/*var mongodb = require('./db');
var markdown = require('markdown').markdown;

var post = function(name, tittle, post) {
    this.name = name;
    this.tittle = tittle;
    this.post = post;
};


post.prototype.save = function(callback) {
    var date = new Date;
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    var post = {
        name: this.name,
        time: time,
        tittle: this.tittle,
        post: this.post
    };

    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        };
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };
            collection.insert(post, {
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                };
                callback(null);
            });
        });
    });
};


post.getAll = function(name, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err)
        };
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };
            var query = {};
            if (name) {
                query.name = name;
            };
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                };
                //解析 markdown 为 html
                docs.forEach(function(doc) {
                    doc.post = markdown.toHTML(doc.post);
                });

                callback(null, docs);
            });
        });
    });
};

post.getOne = function(name, day, title, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        };
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };
            collection.findOne({
                "name": name,
                "time.day": day,
                "tittle": title
            }, function(err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                };
                doc.post = markdown.toHTML(doc.post);
                callback(null, doc);
            });
        });
    });
};


post.edit = function(name, day, title, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        };
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };
            collection.findOne({
                "name": name,
                "time.day": day,
                "tittle": title
            }, function(err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                };
                callback(null, doc);
            });
        });
    });
}



module.exports = post;*/
