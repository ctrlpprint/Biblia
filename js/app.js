var biblia = {
    
};

biblia.Book = Backbone.Model.extend();

biblia.Books = Backbone.Collection.extend({
   model:biblia.Book,
   url: '/js/chapters.json' 
});

biblia.BookView = Backbone.View.extend({
    el: "#bookList",
    template: _.template($('#bookListTemplate').html()),

    render: function(eventName) {
        console.log("rendering bookview");
        // Is there an elegant way of defining a container element?
       _.each(this.model.models, function(book){
           console.log(book);
            var bookTemplate = this.template(book.toJSON());
            $(this.el).append(bookTemplate);
        }, this);

        return this;
    }
});


biblia.Router = Backbone.Router.extend({
    routes: {
        "" :                "home",
        "books/:book":      "book",
        "passage/:term":    "passage"
    },
    
    initialize: function(){
    },
    
    home: function(){
        console.log("home");
        var books = new biblia.Books();
        biblia.bookView = new biblia.BookView({model:books});
        books.fetch({
            success: function(){
                biblia.bookView.render();
            }
        });      
    },
    
    book: function(){
       console.log("book");
       
    },
    
    passage: function(){
       console.log("passage");        
    }
});