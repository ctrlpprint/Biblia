var biblia = {
    
};

biblia.Book = Backbone.Model.extend();

biblia.Books = Backbone.Collection.extend({
   model:biblia.Book,
   url: 'js/chapters.json' 
});

// Home
biblia.BooksView = Backbone.View.extend({
    template: _.template($('#bookListTemplate').html()),

    render: function(eventName) {
        console.log("rendering book list view");
        // Is there an elegant way of defining a container element?
       _.each(this.model.models, function(book){
            var bookTemplate = this.template(book.toJSON());
            $(this.el).append(bookTemplate);
        }, this);

        return this;
    }
});

// View Book
biblia.BookView = Backbone.View.extend({
    template: _.template($('#bookTemplate').html()),

    render: function(eventName) {
        console.log("rendering book view");
        var bookTemplate = this.template(this.model.toJSON());
        $(this.el).append(bookTemplate);
        return this;
    }
    
});

// View Passage
biblia.PassageView = Backbone.View.extend({
    template: _.template($('#passageTemplate').html()),

    render: function(eventName) {
        console.log("rendering passage view");
        
        var passageTemplate = this.template(this.model);
        $(this.el).append(passageTemplate);
        return this;
    }
    
});

biblia.getPassage = function(passage, onSuccess){
    var url = "https://www.esvapi.org/v2/rest/passageQuery?key=IP&passage="+encodeURIComponent(passage);
    var yql = "select content from data.headers where url='" + url + "'";
    $.ajax({
        type: "GET",
        url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yql)
         + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?",
        async: false,
        dataType: "json",
        success: function (data) {
            response = data.query.results.resources.content;
            onSuccess(response);
        }
    });
}

biblia.Router = Backbone.Router.extend({
    routes: {
        "" :                "home",
        "books/:title":     "book",
        "passage/:term":    "passage"
    },
    
    initialize: function(){
        console.log("init");
        this.$content = $("#app");
    },
    
    home: function(){
        console.log("home");
        var self = this;
        biblia.books = biblia.books || new biblia.Books();
        biblia.booksView = new biblia.BooksView({model:biblia.books});
        biblia.books.fetch({
            success: function(){
                biblia.booksView.render();
                self.$content.html(biblia.booksView.el);
                document.title = "Biblia";
            }
        });
        
    },
    
    book: function(title){
        var self = this;
        console.log("book");
        biblia.books = biblia.books || new biblia.Books();
        biblia.books.fetch({
            success: function(){
                // backbone where returns an array.
                var book = biblia.books.where({book: title})[0];
                biblia.bookView = new biblia.BookView({model:book});
                biblia.bookView.render();
                self.$content.html(biblia.bookView.el);
                document.title = title + " - Biblia";
            }
        });
       
    },
    
    passage: function(term){
        var self = this;
        console.log("passage");        
        biblia.books = biblia.books || new biblia.Books();
        biblia.books.fetch({
            success: function(){
                
                biblia.getPassage(term, function(response){
                    var title = term.substring(term, term.lastIndexOf(" "));
                    var book = biblia.books.where({book: title})[0];
                    biblia.passageView = new biblia.PassageView(
                    {  
                        model:
                        {
                            book: book, 
                            passage: term,
                            content: response
                        }
                    });
                    biblia.passageView.render();
                    self.$content.html(biblia.passageView.el);     
                    document.title = term +  " - Biblia";
               
                });
                
            }
        });
    }
});