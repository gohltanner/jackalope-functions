///////////////////////////////////
///////////////////////////////////
const functions = require("firebase-functions");
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");
const app = require("express")();
const cors = require("cors");
app.use(cors());
///////////////////////////////////
///////////////////////////////////
const {
  getAllThumps,
  postOneThump,
  getThump,
  commentOnThump,
  likeThump,
  unlikeThump,
  deleteThump,
} = require("./handlers/thumps");
///////////////////////////////////
///////////////////////////////////
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");
///////////////////////////////////
///////////////////////////////////
app.get("/thumps", getAllThumps);
app.post("/thump", FBAuth, postOneThump);
app.get("/thump/:thumpId", getThump);
app.delete("/thump/:thumpId", FBAuth, deleteThump);
app.get("/thump/:thumpId/like", FBAuth, likeThump);
app.get("/thump/:thumpId/unlike", FBAuth, unlikeThump);
app.post("/thump/:thumpId/comment", FBAuth, commentOnThump);
///////////////////////////////////
///////////////////////////////////
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
///////////////////////////////////
///////////////////////////////////
exports.api = functions.https.onRequest(app);
///////////////////////////////////
///////////////////////////////////
exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/thumps/${snapshot.data().thumpId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            thumpId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
///////////////////////////////////
///////////////////////////////////
exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
///////////////////////////////////
///////////////////////////////////
exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/thumps/${snapshot.data().thumpId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            thumpId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
///////////////////////////////////
///////////////////////////////////
exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("thump")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const thump = db.doc(`/thumps/${doc.id}`);
            batch.update(thump, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });
///////////////////////////////////
///////////////////////////////////
exports.onThumpDelete = functions.firestore
  .document("/thumps/{thumpId}")
  .onDelete((snapshot, context) => {
    const thumpId = context.params.thumpId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("thumpId", "==", thumpId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("thumpId", "==", thumpId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("thumpId", "==", thumpId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
///////////////////////////////////
///////////////////////////////////