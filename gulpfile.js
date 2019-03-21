var _gulp = require('gulp'),
	_handlebars = require("handlebars"),
	_fs = require('fs-extra'),
	_path = require('path');

//--------------- Constants ----------------
const _contentRootPath = "content";
const _outputRootPath = "build";
//--------------- End ----------------

//--------------- Helpers ----------------
var parseJsonFromFile = function(path) {
	var jsonStr = _fs.readFileSync(path, {encoding:'utf8'});
	var jsonObj = JSON.parse(jsonStr);

	return jsonObj;
};

var getPageConfig = function(rootPath, pageConfig) {
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

var getTemplate = function(tempaltePath) {
	var source = _fs.readFileSync(tempaltePath, {encoding:'utf8'});
	var template = _handlebars.compile(source);

	return template;
}

var renderPage = function(pageConfig, globalConfig) {
	var template = getTemplate("./templates/index-template.html");
	var context = pageConfig;
	context.menu = globalConfig.menu;
	var html = template(context);

	var dir = _path.join(_path.resolve(), _outputRootPath, pageConfig.absoluteRoot.replace(_contentRootPath, ""));
	_fs.ensureDirSync(dir);

	_fs.writeFileSync(_path.join(dir, "index.html"), html, {encoding:'utf8'});
};
//--------------- End ----------------

//--------------- Gulp tasks ----------------
_gulp.task('build', function(done) {
	_handlebars.registerHelper('block', function(block) {
		var template = getTemplate("./templates/" + block.templateName + "-template.html");
	  	var html = template(block.content);
	  	
	  	return html;
	});

	var siteConfig = parseJsonFromFile(_path.join(_contentRootPath, "config.json"));

	var globalConfig = {
		menu: []
	};

	//load settings for home page
	siteConfig.home = getPageConfig(_contentRootPath, siteConfig.home);
	//load settings for all children
	siteConfig.menu.forEach(function(menuItem) {
		var pageConfig = getPageConfig(_contentRootPath, menuItem);
		if (pageConfig.children)
		{
			for (var i = 0; i < pageConfig.children.length; i++) {
				pageConfig.children[i] = getPageConfig(_path.join(_contentRootPath, menuItem.root), pageConfig.children[i]);
			}
		}

		globalConfig.menu.push(pageConfig);
	});

	

	//clear output dir
	//TODO: move to another gulp task
	_fs.removeSync(_path.join(_path.resolve(), _outputRootPath));

	//copy global assets to build dirrectory
	_fs.copySync("./assets", _path.join(_path.resolve(), _outputRootPath, "assets"));

	//render home page
	renderPage(siteConfig.home, globalConfig);

	//render all other pages from the menue
	siteConfig.menu.forEach(function(menuItem) {
		renderPage(menuItem, globalConfig);
		if (menuItem.children)
		{
			for (var i = 0; i < menuItem.children.length; i++) {
				renderPage(menuItem.children[i], globalConfig);
			}
		}
	});

	done();
});
//--------------- Helpers ----------------
