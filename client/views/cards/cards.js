// binds to the cards template when its created
Template.cards.onCreated(function(){
    this.subscribe("books");
});

// helper functions bound to the cards template
Template.cards.helpers({
    books: function() {
        return Books.find();
    }
});

// binds to the card template when its created
Template.card.onCreated(function() {
    this.messageSent = new ReactiveVar(false);
});

// event handler bound to the card template
Template.card.events({
    "click .send-message": function(event, template) {
        if (Meteor.user()) {
            MaterializeModal.prompt({
                title: "Compose message and click submit",
                message: "",
                placeholder: "This field is optional",
                callback: function(error, response) {
                    var customerName = Meteor.user().username;
                    var customerEmail = customerName + '@students.calvin.edu';
                    var sellerEmail = template.data.user + '@students.calvin.edu';
                    var title = template.data.title;

                    // default message to be sent
                    var message = customerName + ' would like to purchase "' + title +
                        '".\nPlease contact your customer at ' + customerEmail;

                    // default message with the custom message tagged on to the end
                    if(response.value)
                        message += '\n' + customerName + ' says:\n' + response.value;

                    // sends the email message to the server
                    if (response.submit) {
                        Meteor.call('sendEmail', sellerEmail, 'calvinbookshelf',
                                    'You have an offer!', message);
                        template.messageSent.set(true);
                        Materialize.toast("Message Sent", 4000, "rounded");
                    }
                }
            });
        } else {
            $('#loginModal').openModal();
        }
    },
    "click .remove-book": function(event, template) {
        Meteor.call("removeBook", template.data._id);
    }
});

// helper functions bound to the card template
Template.card.helpers({
    messageSent: function() {
        return Template.instance().messageSent.get();
    },
    myBook: function() {
        return this.user == Meteor.user().username;
    },
    formatPrice: function(price) {
        return (typeof(price) == 'number') ? '$' + price.toFixed(2) : "";
    },
    checkAvailable: function(detail) {
        return (detail) ? detail : "n/a";
    }
});
