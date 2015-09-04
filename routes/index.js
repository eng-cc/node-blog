var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
var router = express.Router();
var user = require('../models/user.js');
var crypto = require('crypto');
var post = require('../models/post.js')
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/images')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
})

/* GET home page. */
router.get('/', function(req, res, next) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var total;
    post.getToatl(user.name, function(err, ttt) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        };
        return total = ttt;
    });console.log(req.query.p);
    page = parseInt(page);
    post.getAll(null, page, function(err, posts) {
        if (err) {
            posts = []
        };
        res.render('./pages/main', {
            title: '主页',
            posts: posts,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 10 + posts.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
});

router.get('/login', function(req, res) {
    res.render('./pages/login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/login', function(req, res, next) {
    //checkNotLogin(req, res , next);
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    user.get(req.body.name, function(err, user) {
        if (err) {
            console.log(err);
        };
        if (!user) {
            req.flash('error', '用户名不存在');
            return res.redirect('/login');
        };
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        };
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/')
    });
});


router.get('/logout', function(req, res, next) {
    //checkLogin(req, res , next);
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

router.get('/register', function(req, res, next) {
    //checkNotLogin(req, res, next);
    res.render('./pages/register', {
        title: '注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/register', function(req, res, next) {
    //checkNotLogin(req, res , next);
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];

    if (password != password_re) {
        req.flash('error', '两次输入密码不一致');
        return res.redirect('/register');
    };
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new user({
        name: name,
        password: password,
        email: req.body.email
    });
    user.get(newUser.name, function(err, user) {
        if (user) {
            req.flash('error', '用户已存在');
            return res.redirect('/register');
        };
        newUser.save(function(err, user) {
            if (err) {
                console.log(err);
                req.flash('error', err)
                return res.redirect('/register');
            };
            req.session.user = user;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
});

router.get('/post', function(req, res, next) {
    //checkLogin(req, res , next);
    res.render('./pages/post', {
        title: '发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/post', function(req, res, next) {
    //checkLogin(req, res , next);
    var currenUser = req.session.user;
    var tags = [req.body.tag1,req.body.tag2,req.body.tag3]
    var thispost = new post(currenUser.name, req.body.tittle, req.body.article,tags);
    thispost.save(function(err) {
        console.log(thispost);
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        };
        req.flash('success', '发布成功');
        res.redirect('/');
    });
});

router.get('/upload', function(req, res, next) {
    res.render('./pages/upload', {
        title: '文件上传',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

var uploadFs = upload.fields([{
    name: 'file1'
}, {
    name: 'file2'
}, {
    name: 'file3'
}, {
    name: 'file4'
}, {
    name: 'file5'
}])

router.post('/upload', uploadFs, function(req, res, next) {
    //console.console.log(upload.array());
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
})

router.get('/u/:name', function(req, res, next) {
    var total;
    user.get(req.params.name, function(err, user) {
        if (err) {
            console.log(err);
        };
        if (!user) {
            req.flash('error', '用户名不存在');
            return res.redirect('/');
        };
        post.getToatl(user.name, function(err, ttt) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            };
            return total = ttt;
        });
        var page = req.query.p ? parseInt(req.query.p) : 1;
        post.getAll(user.name, page, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            };
            res.render('./pages/user', {
                title: user.name,
                posts: posts,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * 10 + posts.length) == total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
});

router.get('/u/:name/:day/:title', function(req, res, next) {
    post.getOne(req.params.name, req.params.day, req.params.title, function(err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        };
        res.render('./pages/article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

router.get('/edit/:name/:day/:title', function(req, res, next) {
    var currenUser = req.session.user;
    post.edit(currenUser.name, req.params.day, req.params.title, function(err, post) {
        if (err) {
            req.flash('error', err);
            console.log(req.params);
            return res.redirect('back');
        };
        res.render('./pages/edit', {
            title: '编辑',
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
        console.log(post.tittle);
    });
});

router.post('/edit/:name/:day/:title', function(req, res, next) {
    var currenUser = req.session.user;
    post.update(currenUser.name, req.params.day, req.params.title, req.body.article, function(err) {
        var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
        if (err) {
            req.flash('error', err);
            return res.redirect(url);
        };
        req.flash('success', '修改成功');
        res.redirect(url);
    });
});

router.get('/remove/:name/:day/:title', function(req, res, next) {
    var currenUser = req.session.user;
    post.remove(currenUser.name, req.params.day, req.params.title, function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        };
        req.flash('success', '删除成功');
        res.redirect('/');
    });
});

router.get('/tags', function(req ,res){
	post.getTags(function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('tags', {
      title: '标签',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

var checkLogin = function(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        res.redirect('/login');
    };
    next();
};

var checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录');
        res.redirect('back');
    };
    next();
};

module.exports = router;
