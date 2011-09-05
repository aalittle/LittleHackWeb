(function() {
  var Article, ArticleCollection, Config, ConfigView, HomeController, HomeView, app;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  app = {
    activePage: function() {
      return $(".ui-page-active");
    },
    reapplyStyles: function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
      el.find('button[data-role="button"]').button();
      el.find('input,textarea').textinput();
      return el.page();
    },
    redirectTo: function(page) {
      return $.mobile.changePage(page);
    },
    goBack: function() {
      return $.historyBack();
    }
  };
  Article = (function() {
    __extends(Article, Backbone.Model);
    function Article() {
      Article.__super__.constructor.apply(this, arguments);
    }
    Article.prototype.getTitle = function() {
      return this.get('title');
    };
    Article.prototype.getPoints = function() {
      return this.get('points');
    };
    Article.prototype.getUsername = function() {
      return this.get('photo_url');
    };
    Article.prototype.getDomain = function() {
      return this.get('domain');
    };
    Article.prototype.getCreateDate = function() {
      return this.get('create_ts');
    };
    Article.prototype.getUrl = function() {};
    Article.get('url');
    return Article;
  })();
  ArticleCollection = (function() {
    __extends(ArticleCollection, Backbone.Collection);
    ArticleCollection.prototype.model = Article;
    function ArticleCollection() {
      ArticleCollection.__super__.constructor.apply(this, arguments);
      this.refresh($HACKERNEWS_JSON);
    }
    return ArticleCollection;
  })();
  this.Articles = new ArticleCollection;
  Config = (function() {
    __extends(Config, Backbone.Model);
    function Config() {
      Config.__super__.constructor.apply(this, arguments);
    }
    Config.prototype.defaults = {
      fresh: 500,
      points: 15,
      comments: 30
    };
    return Config;
  })();
  ConfigView = (function() {
    __extends(ConfigView, Backbone.View);
    function ConfigView() {
      this.render = __bind(this.render, this);      ConfigView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = _.template('<div data-role="page" id="config_view">\n 	<div data-role="header" data-position="fixed" data-theme="i"> \n		<a href="#list_view" data-transition="slidedown">Cancel</a> \n		<h1>Configure Search</h1> \n		<a href="#list_view" data-transition="slidedown" data-theme="i">Save</a> \n	</div>\n\n	<div data-role="fieldcontain">\n		<center><label for="slider">How Fresh</label></center>\n	 	<center><input type="range" name="fresh" id="slider" value="500" min="100" max="900"  /></center>\n	</div>\n	\n	<div data-role="fieldcontain">\n		<center><label for="slider"># of Points</label></center>\n	 	<center><input type="range" name="points" id="slider" value="30" min="0" max="150"  /></center>\n	</div>\n	\n	<div data-role="fieldcontain">\n		<center><label for="slider"># of Comments</label></center>\n	 	<center><input type="range" name="comments" id="slider" value="15" min="0" max="150"  /></center>\n	</div>\n	\n	<div align="center" data-role="footer" data-theme="i" data-position="fixed"> \n		<p></p>\n		<a href="#">Restore Defaults</a>\n		<p></p>\n	</div>\n 		\n</div>');
      this.model.bind('change', this.render);
      this.render();
    }
    ConfigView.prototype.events = {
      "save config": "onSave"
    };
    ConfigView.prototype.onSave = function(e) {
      this.model.set({
        fresh: this.$("input[name='fresh']").val(),
        points: this.$("input[name='points']").val(),
        comments: this.$("input[name='comments']").val()
      });
      this.model.trigger('change');
      app.goBack();
      e.preventDefault();
      return e.stopPropagation();
    };
    ConfigView.prototype.render = function() {
      this.el.find('h1').text("" + (this.model.getName()));
      this.el.find('.ui-content').html(this.template({
        config: this.model
      }));
      app.reapplyStyles(this.el);
      return this.delegateEvents();
    };
    return ConfigView;
  })();
  HomeView = (function() {
    __extends(HomeView, Backbone.View);
    function HomeView() {
      this.render = __bind(this.render, this);      HomeView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = _.template('      <div>\n      \n<ul data-role="listview" data-inset="true">\n	<% articles.each(function(article){ %>\n		<li data-icon="false"><a href="<%= article.getURL() %>"> \n		<h3><%= article.getTitle() %></h3> \n		\n		<p><%= article.getPoints() %> points by <%= article.getUsername %> (via <%= article.getDomain() %>) - posted <%= article.getCreateDate() %></p> \n		</a>\n	</li> \n	<% }); %>\n	\n	<li data-icon="false"><a href="#"> \n		<h3>More</h3> \n		</a>\n	</li> \n</ul>	 		\n\n      </div>');
      this.render();
    }
    HomeView.prototype.render = function() {
      this.el.find('.ui-content').html(this.template({
        articles: Articles
      }));
      return app.reapplyStyles(this.el);
    };
    return HomeView;
  })();
  HomeController = (function() {
    __extends(HomeController, Backbone.Controller);
    HomeController.prototype.routes = {
      "config": "config",
      "home": "home"
    };
    function HomeController() {
      HomeController.__super__.constructor.apply(this, arguments);
      this._views = {};
    }
    HomeController.prototype.home = function() {
      var _base;
      return (_base = this._views)['home'] || (_base['home'] = new HomeView);
    };
    HomeController.prototype.config = function() {
      var _base;
      return (_base = this._views)["config"] || (_base["config"] = new ConfigView);
    };
    return HomeController;
  })();
  app.homeController = new HomeController();
  $(document).ready(function() {
    Backbone.history.start();
    return app.homeController.home();
  });
  this.app = app;
}).call(this);
