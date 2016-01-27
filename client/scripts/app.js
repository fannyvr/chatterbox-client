
var app;
$(document).ready(function() {
  
  var rooms = {};
  var friends = {};

  app = { 
    server : 'https://api.parse.com/1/classes/chatterbox',
    username: 'anon',
    room: 'lobby',
    recievedData: [],
    init: function(){
      
      app.username = window.location.search.substr(10);  
      app.fetch();
      //setInterval( app.fetch , 3000);
      // Displaying Messages in Rooms
      $('#roomSelect').change(function(){
        $('.messageContainer').empty();
        for(var i = 0; i < app.recievedData.length; i++){
          if(app.recievedData[i].roomname !== undefined ){
            if($('#roomSelect').val() === app.recievedData[i].roomname) {   
              app.addMessage(app.recievedData[i]);
            }
          }
        }
      });
      app.handleSubmit();
      app.addFriend();
    
    },
    send: function(message){

      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent. Data: ', data);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message. Error: ', data);
        }
      });

    },

    fetch: function(){

        $.ajax({
          url: 'https://api.parse.com/1/classes/chatterbox',
          type: 'GET',
          data: {order: '-createdAt'},
          contentType: 'application/json',
          success:  function(data) {
            dataHandler(data);
            app.populate(data);
            app.recievedData = data.results;
            // app.recievedData = (data.results).slice(0, 99);
            // (app.recievedData).push(data.results);
            console.log('chatterbox: Message recieved. Data: ', data);
          },

          error: function (data) {
            console.error('chatterbox: Failed to recieve message. Error: ', data);
          }    
        });
      },

      clearMessages : function(){
        $('.messageContainer').empty()
      },

      addRoom : function(roomname){
        // Append new roons to dropdown only
        // for(var key in rooms){
        //   $('#roomSelect').append('<option value= "' + key + '">' + key + '</option>');
        // }
        // New:
        var option = $('<option/>').val(roomname).text(roomname);
        $('#roomSelect').append(option);
      },

      populate: function(data) {
        $('#roomSelect').html('<option value= "newRoom"> New Room...</option> <option value="lobby" selected> lobby</option>');
        var results = data.results;
        if(results){
          var rooms = {};
          results.forEach(function(data){
            var roomname = data.roomname;
            if(roomname && !rooms[roomname]){
              app.addRoom(roomname);
            }
            rooms[roomname] = true;
          });
        }
        $('.roomSelect').val(app.roomname);
      },

      addMessage : function(message){
        user = message.username;
        text = message.text;  
        
        var userSpan = $('<span class="username"/>');
        var newDiv = $('<div class="message"/>');
        userSpan.text(user).attr('message.username', message.username).appendTo(newDiv);        
        var fullMessage = ':\n' + text;
        newDiv.append(fullMessage);
        $('.messageContainer').append(newDiv);
      },

      handleSubmit : function() {
        $('#messageSubmit').on('submit', function(e){
          e.preventDefault();
          var text = $('#message').val();
          var finalMessage = createMessage(text);
          app.send(finalMessage);
          app.fetch();
        });
      },

      addFriend : function(){
        $('.username').on('click', function(){
          var friend = $('.message.username').val();

          //var friend = $('.username').find('.username').val();
          console.log(friend);
          // var finalMessage = createMessage(text);
          // app.send(finalMessage);
          // app.fetch();
        });
      }
  };

  

  var dataHandler = function (data){ 
    // var rooms = {};
    for(var i = 0; i < data.results.length; i++){
        app.addMessage(data.results[i]);
    
      // Check for rooms
      // User can add room 
      
      //console.log(data.results[i].roomname);
      // if(!rooms[data.results[i].roomname] ){
      //   //console.log(data.results[i].roomname)
      //   rooms[data.results[i].roomname] = data.results[i].roomname;
      // }
      // ReWRIte:



    }
      
    //app.addRoom(roomname);
    
  };



  

  var createMessage = function(text){
    var message = {};
    message.username = app.username;
    message.text = text;
    message.roomname = $('#roomSelect').val();
    return message;
  };
 
  app.init(); 
  
  

  

  
 
});

