//////////////////////////////////////
/////////////////////////////////////
const admin = require("firebase-admin");
//////////////////////////////////////
/////////////////////////////////////
let serviceAccount = require("./serviceAccountKey.json");
//////////////////////////////////////
/////////////////////////////////////
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jackalope-2020.firebaseio.com",
});
//////////////////////////////////////
/////////////////////////////////////
db = admin.firestore();
//////////////////////////////////////
/////////////////////////////////////
module.exports = { admin, db };
//////////////////////////////////////
/////////////////////////////////////