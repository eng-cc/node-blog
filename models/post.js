var mongoose = require('mongoose');
var markdown = require('markdown').markdown;

var date = new Date;
var postSchema = new mongoose.Schema({
    name: String,
    tittle: String,
    article: String,
    tags:Array,
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
    },
    comment: Array
}, {
    collection: 'posts'
});

var postModel = mongoose.model('post', postSchema);

var post = function(name, tittle, article,tags) {
    this.name = name;
    this.tittle = tittle;
    this.article = article;
    this.tags = tags;
}
//保存
post.prototype.save = function(callback) {

    var post = {
        name: this.name,
        tittle: this.tittle,
        article: this.article,
        tags:this.tags
        //comments:[]
    };
console.log(post);
    var newPost = new postModel(post);
    newPost.save(function(err) {
        if (err) {
            return callback(err);
        };
        callback(null);
    });
};

//获取所有
post.getAll = function(name, page, callback) {
    var query = {};
    if (name) {
        query.name = name;
    };
    postModel.find(query).sort({
        _id: -1
    }).skip((page - 1) * 10).limit(10).exec(function(err, docs) {
        if (err) {
            return callback(err);
        };
        docs.forEach(function(doc) {
            doc.article = markdown.toHTML(doc.article);
        });
        callback(null, docs);
    });
};
//获取文章总数
post.getToatl = function(name, callback) {
    var query = {};
    if (name) {
        query.name = name;
    };
    postModel.count(query, function(err, tt) {
        if (err) {
            return callback(err)
        };
        callback(null, tt)
    });
};
//获取一篇
post.getOne = function(name, day, tittle, callback) {
    postModel.findOne({
        'name': name,
        'time.day': day,
        'tittle': tittle
    }, function(err, doc) {
        if (err) {
            callback(err);
        };
        if (doc) {
            doc.article = markdown.toHTML(doc.article);
            /* doc.comments.forEach(function(comment){
                 comment.content = markdown.toHTML(comment.content);
             });*/
        };
        callback(null, doc);
    });
};

//读取编辑
post.edit = function(name, day, tittle, callback) {
    postModel.findOne({
        'name': name,
        'time.day': day,
        'tittle': tittle
    }, function(err, doc) {
        if (err) {
            callback(err);
        };
        callback(null, doc);
    });
};
//更新编辑
post.update = function(name, day, tittle, article, callback) {
    postModel.findOneAndUpdate({
        'name': name,
        'time.day': day,
        'tittle': tittle
    }, {
        'article': article
    }, {
        new: true
    }, function(err, post) {
        if (err) {
            collback(err)
        };
        callback(null)
    });
};
//删除
post.remove = function(name, day, tittle, callback) {
    postModel.remove({
        'name': name,
        'time.day': day,
        'tittle': tittle
    }, function(err, post) {
        if (err) {
            return callback(err)
        };
        callback();
    });
};

//获取标签
post.getTags = function(callback){
    postModel.distinct("tags",function(err,docs){
        if (err) {
            callback(err);
        };
        callback(null , docs);
    });
}


//获取存档
/*post.getArchive = function(callback){

}
*/

module.exports = post;
