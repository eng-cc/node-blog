var mongoose = require('mongoose');
var markdown = require('markdown').markdown;

var date = new Date;
var postSchema = new mongoose.Schema({
    name: String,
    tittle: String,
    article: String,
    time: {
        date: {
            type: Date,
            default: date
        },
        yrar: {
            type: String,
            default: date.getFullYear()
        },
        month: {
            type: String,
            default: date.getFullYear() + "-" + (date.getMonth() + 1)
        },
        day: {
            type: String,
            default: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        },
        minute: {
            type: String,
            default: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        }
    }
}, {
    collection: 'posts'
});

var postModel = mongoose.model('post', postSchema);

var post = function(name, tittle, article) {
    this.name = name;
    this.tittle = tittle;
    this.article = article;
}

post.prototype.save = function(callback) {

    var post = {
        name: this.name,
        tittle: this.tittle,
        article: this.article
    };

    var newPost = new postModel(post);
    newPost.save(function(err) {
        if (err) {
            return callback(err);
        };
        callback(null);
    });
};


post.getAll = function(name, callback) {
    var query = {};
    if (name) {
        query.name = name;
    };
    postModel.find(query).sort({
        'time': -1
    }).limit(10).exec(function(err, docs) {
        if (err) {
            return callback(err);
        };
        docs.forEach(function(doc) {
            doc.article = markdown.toHTML(doc.article);
        });
        callback(null, docs);
    });
};

post.getOne = function(name, day, tittle, callback) {
    postModel.findOne({
        'name': name,
        'time.day': day,
        'tittle':tittle
    },function(err , doc){
        if (err) {
            callback(err);
        };
        doc.article = markdown.toHTML(doc.article);
        callback(null,doc);
    });
};


post.edit = function(name, day, tittle, callback){
    postModel.findOne({
        'name': name,
        'time.day': day,
        'tittle':tittle
    },function(err , doc){
        if (err) {
            callback(err);
        };
        callback(null,doc);
    });
};




module.exports = post;
