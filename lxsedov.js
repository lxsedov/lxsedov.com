
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./lxsedov-9e5f8-firebase-adminsdk-1g3b1-3e007afffa.json"),
  databaseURL: "https://lxsedov-9e5f8.firebaseio.com"
});


// Get a database reference to our blog
var db = admin.database();
var ref = db.ref("db");

var postsRef = ref.child("posts2");

/*
for(var i=0; i < 10000; i++){
	var newPostRef = postsRef.push();
	newPostRef.set({
	  author: "gracehop",
	  title: "Announcing COBOL, a New Programming Language"
	});
	console.log("i= " + i);
}
*/

/*
var countdown = function(value) {
    if (value > 0) {
        console.log(value);
		var newPostRef = postsRef.push();
	newPostRef.set({
	  author: "gracehop",
	  title: "Announcing COBOL, a New Programming Language"
	});
        return countdown(value - 1);
    } else {
        return value;
    }
};
countdown(1000);
*/

