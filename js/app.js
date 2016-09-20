var biblia = {
    
};

biblia.Book = Backbone.Model.extend();

biblia.Books = Backbone.Collection.extend({
   model:biblia.Book,
   url: '/js/chapters.json' 
});

// Home
biblia.BooksView = Backbone.View.extend({
    el: "#bookList",
    template: _.template($('#bookListTemplate').html()),

    render: function(eventName) {
        console.log("rendering book list view");
        // Is there an elegant way of defining a container element?
       _.each(this.model.models, function(book){
           console.log(book);
            var bookTemplate = this.template(book.toJSON());
            $(this.el).append(bookTemplate);
        }, this);

        return this;
    }
});

// View Book
biblia.BookView = Backbone.View.extend({
    el: "#book",
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
    },
    
    home: function(){
        console.log("home");
        var books = new biblia.Books();
        biblia.booksView = new biblia.BooksView({model:books});
        books.fetch({
            success: function(){
                biblia.booksView.render();
            }
        });      
    },
    
    book: function(title){
        console.log("book");
        biblia.books = new biblia.Books();
        biblia.books.fetch({
            success: function(){
                // backbone where returns an array.
                var book = biblia.books.where({book: title})[0];
                biblia.bookView = new biblia.BookView({model:book});
                biblia.bookView.render();
            }
        });
       
    },
    
    passage: function(){
       console.log("passage");        
    }
});