
#
# Some helper methods

app =
  activePage: ->
    $(".ui-page-active")
    
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview();
    el.find('div[data-role="fieldcontain"]').fieldcontain();
    el.find('button[data-role="button"]').button();
    el.find('input,textarea').textinput();
    el.page()
    
  redirectTo: (page) ->
    $.mobile.changePage page
  
  goBack: ->
    $.historyBack()
      

#
# Article class
#

class Article extends Backbone.Model
  getTitle: ->
    @get('title')
    
  getPoints: ->
    @get('points')
    
  getUsername: ->
    @get('photo_url')
    
  getDomain: ->
    @get('domain')

  getCreateDate: ->
    @get('create_ts')

  getUrl: ->
 	@get('url')
   
#
# Article Collection
#

class ArticleCollection extends Backbone.Collection
  model : Article
  
  constructor: ->
    super
    @refresh($HACKERNEWS_JSON)
  
this.Articles = new ArticleCollection


# 
# Config Settings Model
#

class Config extends Backbone.Model
 defaults: {
            fresh: 500,
            points: 15,
            comments: 30
        }


#
# Edit Venue View
#

class ConfigView extends Backbone.View
  constructor: ->
    super
    
    # Get the active page from jquery mobile. We need to keep track of what this
    # dom element is so that we can refresh the page when the page is no longer active.
    @el = app.activePage()
    
    @template = _.template('''
	<div data-role="page" id="config_view">
	 	<div data-role="header" data-position="fixed" data-theme="i"> 
			<a href="#list_view" data-transition="slidedown">Cancel</a> 
			<h1>Configure Search</h1> 
			<a href="#list_view" data-transition="slidedown" data-theme="i">Save</a> 
		</div>

		<div data-role="fieldcontain">
			<center><label for="slider">How Fresh</label></center>
		 	<center><input type="range" name="fresh" id="slider" value="500" min="100" max="900"  /></center>
		</div>
		
		<div data-role="fieldcontain">
			<center><label for="slider"># of Points</label></center>
		 	<center><input type="range" name="points" id="slider" value="30" min="0" max="150"  /></center>
		</div>
		
		<div data-role="fieldcontain">
			<center><label for="slider"># of Comments</label></center>
		 	<center><input type="range" name="comments" id="slider" value="15" min="0" max="150"  /></center>
		</div>
		
		<div align="center" data-role="footer" data-theme="i" data-position="fixed"> 
			<p></p>
			<a href="#">Restore Defaults</a>
			<p></p>
		</div>
 		
	</div>
    ''')
    
    # Watch for changes to the model and redraw the view
    @model.bind 'change', @render
    
    # Draw the view
    @render()

  #todo: update this
  events : {
    "save config" : "onSave"
  }

  onSave: (e) ->
    @model.set {
      fresh : @$("input[name='fresh']").val(),
      points : @$("input[name='points']").val(),
      comments : @$("input[name='comments']").val(),
    }
    
    @model.trigger('change')

    app.goBack()
    
    e.preventDefault()
    e.stopPropagation()

  render: =>
    # Set the name of the page
    @el.find('h1').text("#{@model.getName()}")
    
    # Render the content
    @el.find('.ui-content').html(@template({config : @model}))

    # A hacky way of reapplying the jquery mobile styles
    app.reapplyStyles(@el)

    # Delegate from the events hash
    @delegateEvents()

#
# Show Venue View
#

  
#
# Home View
#
  
class HomeView extends Backbone.View
  constructor: ->
    super
    
    @el = app.activePage()
    
    @template = _.template('''
      <div>
      
		<ul data-role="listview" data-inset="true">
			<% articles.each(function(article){ %>
				<li data-icon="false"><a href="<%= article.getURL() %>"> 
				<h3><%= article.getTitle() %></h3> 
				
				<p><%= article.getPoints() %> points by <%= article.getUsername %> (via <%= article.getDomain() %>) - posted <%= article.getCreateDate() %></p> 
				</a>
			</li> 
			<% }); %>
			
			<li data-icon="false"><a href="#"> 
				<h3>More</h3> 
				</a>
			</li> 
		</ul>	 		

      </div>
    ''')
    
    @render()
    
  render: =>
    # Render the content
    @el.find('.ui-content').html(@template({articles : Articles}))

    # A hacky way of reapplying the jquery mobile styles
    app.reapplyStyles(@el)  
    
    
#
# Our only controller
#

class HomeController extends Backbone.Controller
  routes :
    "config" : "config"
    "home"  : "home"

  constructor: ->
    super
    @_views = {}

  home : ->
    @_views['home'] ||= new HomeView
    
  config: ->
    @_views["config"] ||= new ConfigView

app.homeController = new HomeController()

#
# Start the app
#  

$(document).ready ->
  Backbone.history.start()
  app.homeController.home()
  
@app = app