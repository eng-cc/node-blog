var mongoose = require('mongoose');
var crypto = require('crypto');

//mongoose.connect('mongodb://localhost/blog')

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    head:String
}, {
    collection: 'users'
});

var userModel = mongoose.model('user', userSchema);

var user = function(user) {
    this.name = user.name,
    this.password = user.password,
    this.email = user.email
};

user.prototype.save = function(callback) {
    var md5 = crypto.createHash('md5');
    var email_md5 = md5.update(this.email.toLowerCase()).digest('hex');
    var head = "http://www.gravatar.com/avatar/" + email_md5 + "?s=48";

    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: head
    };
console.log(user);
    var newUser = new userModel(user);
    newUser.save(function(err, user) {
        if (err) {
            return callback(err)
        };
        callback(null, user);
    });
};

user.get = function(name , callback){
	userModel.findOne({name:name},function(err , user){
		if (err) {
			return callback(err);
		};
		callback(null , user);
	});
}


module.exports = user;