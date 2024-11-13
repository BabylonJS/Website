var _gulp = require('gulp'),
    _handlebars = require('handlebars'),
    _fs = require('fs-extra'),
    _path = require('path'),
    _connect = require('gulp-connect'),
    _shared = { "variables": {} };

//--------------- Constants ----------------
const _contentRootPath = "./src/content";
const _outputRootPath = "./build";
//--------------- End ----------------

//--------------- Helpers ----------------
var parseJsonFromFile = function (path) {
    var jsonStr = _fs.readFileSync(path, { encoding: 'utf8' });
    var jsonObj = JSON.parse(jsonStr);

    return jsonObj;
};

var getPageConfig = function (rootPath, pageConfig) {
    var res = {};
    if (pageConfig && pageConfig.root) {
        var configPath = _path.join(rootPath, pageConfig.root, 'config.json');
        var config = parseJsonFromFile(configPath);
        res = Object.assign(pageConfig, config);
        res.absoluteRoot = _path.join(rootPath, pageConfig.root);
    }
    else {
        res = pageConfig;
    }

    return res;
};

var getTemplate = function (templatePath) {
    var source = _fs.readFileSync(templatePath, { encoding: 'utf8' });
    var template = _handlebars.compile(source);

    return template;
}

var renderPage = function (pageConfig, globalConfig) {
    var template = getTemplate("./src/templates/index-template.html");
    var context = pageConfig;
    context.menu = globalConfig.menu;
    context.footerMenu = globalConfig.footerMenu;
    context.socials = globalConfig.socials;
    context.downloadLink = globalConfig.downloadLink;
    var html = template(context);

    var dir = _path.join(_path.resolve(), _outputRootPath, pageConfig.absoluteRoot.replace("src\\content\\", "").replace("src/content/", ""));
    _fs.ensureDirSync(dir);
    //copy assets to build assets directory
    try {
        _fs.copySync(_path.join(pageConfig.absoluteRoot, "assets"), _path.join(dir, "assets"));
    } catch (ex) {
        //ignore exception because this is optional step
    }

    _fs.writeFileSync(_path.join(dir, "index.html"), html, { encoding: 'utf8' });
};
//--------------- End ----------------

//--------------- Gulp tasks ----------------
_gulp.task('build', function (done) {
    //init handlebars
    _handlebars.registerHelper({
        block: function (block) {
            var template = getTemplate("./src/templates/" + block.templateName + "-template.html");
            var html = template(block.content);

            return html;
        },
        json: function (obj) {
            return new _handlebars.SafeString(JSON.stringify(obj));
        },
        var: function (key) {
            if (_shared.variables[key])
                return new _handlebars.SafeString(_shared.variables[key]);
            else
                return new _handlebars.SafeString(key);
        },
        eq: function (v1, v2) {
            return v1 === v2;
        },
        ne: function (v1, v2) {
            return v1 !== v2;
        },
        lt: function (v1, v2) {
            return v1 < v2;
        },
        gt: function (v1, v2) {
            return v1 > v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        and: function () {
            return Array.prototype.slice.call(arguments).every(Boolean);
        },
        or: function () {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
    });

    var siteConfig = parseJsonFromFile(_path.join(_contentRootPath, "site.json"));

    var globalConfig = {
        menu: [],
        socials: siteConfig.socials,
        footerMenu: siteConfig.footerMenu,
        downloadLink: siteConfig.downloadLink
    };
    _shared.variables = siteConfig.variables;

    //load settings for home page
    siteConfig.home = getPageConfig(_contentRootPath, siteConfig.home);
    //load settings for all children
    siteConfig.menu.forEach(function (menuItem) {
        var pageConfig = getPageConfig(_contentRootPath, menuItem);
        if (pageConfig.children) {
            for (var i = 0; i < pageConfig.children.length; i++) {
                pageConfig.children[i] = getPageConfig(_path.join(_contentRootPath, menuItem.root), pageConfig.children[i]);
            }
        }

        if (pageConfig.visible) {
            console.log(pageConfig.absoluteRoot)
            globalConfig.menu.push(pageConfig);
        }
    });



    //clear output dir
    //_fs.removeSync(_path.join(_path.resolve(), _outputRootPath));

    //copy global assets to build directory
    _fs.copySync("./src/assets", _path.join(_path.resolve(), _outputRootPath, "assets"));

    //render home page
    renderPage(siteConfig.home, globalConfig);

    //render all other pages from the menue
    siteConfig.menu.forEach(function (menuItem) {
        if (menuItem.menuUrl)
            return;
        renderPage(menuItem, globalConfig);
        if (menuItem.children) {
            for (var i = 0; i < menuItem.children.length; i++) {
                if (!menuItem.children[i].menuUrl)
                    renderPage(menuItem.children[i], globalConfig);
            }
        }
    });

    done();
});

_gulp.task('server', function () {
    _connect.server({
        root: _outputRootPath,
        port: 8080,
        host: '0.0.0.0',
        keepalive: true,
        livereload: true
    });
});

_gulp.task('reload', function () {
    _connect.reload();
});

_gulp.task('watch-and-reload', function (done) {
    _gulp.watch(['src/content/**/*.json', 'src/templates/**/*.html', 'src/assets/**/*.js', 'src/assets/**/*.css'], function () {
    }).on('change', function (file) {
        _gulp.series('build', 'reload')();
    });
    done();
});

_gulp.task('run', _gulp.series('build', 'watch-and-reload', 'server'));

//--------------- End ----------------
