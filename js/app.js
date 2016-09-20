var biblia = {
    
};

biblia.Book = Backbone.Model.extend();

biblia.Books = Backbone.Collection.extend({
   model:biblia.Book,
   url: '/js/chapters.json' 
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
        var books = new biblia.Books();
        biblia.booksView = new biblia.BooksView({model:books});
        books.fetch({
            success: function(){
                biblia.booksView.render();
                self.$content.html(biblia.booksView.el);
            }
        });      
        
    },
    
    book: function(title){
        var self = this;
        console.log("book");
        biblia.books = new biblia.Books();
        biblia.books.fetch({
            success: function(){
                // backbone where returns an array.
                var book = biblia.books.where({book: title})[0];
                biblia.bookView = new biblia.BookView({model:book});
                biblia.bookView.render();
                self.$content.html(biblia.bookView.el);
            }
        });
       
    },
    
    passage: function(){
       console.log("passage");        
    }
});