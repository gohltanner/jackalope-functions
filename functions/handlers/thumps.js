/////////////////////////////////////////////////
/////////////////////////////////////////////////
const { db } = require("../util/admin");
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.getAllThumps = (req, res) => {
  db.collection("thumps")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let thumps = [];
      data.forEach((doc) => {
        thumps.push({
          thumpId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(thumps);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.postOneThump = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Please add some information" });
  }
  const newThump = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("thumps")
    .add(newThump)
    .then((doc) => {
      const resThump = newThump;
      resThump.thumpId = doc.id;
      res.json(resThump);
    })
    .catch((err) => {
      res.status(500).json({ error: "Oops! Something went wrong" });
      console.error(err);
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.getThump = (req, res) => {
  let thumpData = {};
  db.doc(`/thumps/${req.params.thumpId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Thump is missing" });
      }
      thumpData = doc.data();
      thumpData.thumpId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("thumpId", "==", req.params.thumpId)
        .get();
    })
    .then((data) => {
      thumpData.comments = [];
      data.forEach((doc) => {
        thumpData.comments.push(doc.data());
      });
      return res.json(thumpData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.commentOnThump = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Please enter some information" });
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    thumpId: req.params.thumpId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };
  console.log(newComment);
  db.doc(`/thumps/${req.params.thumpId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Thump is missing" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Oops! Something went wrong." });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.likeThump = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("thumpId", "==", req.params.thumpId)
    .limit(1);
  const thumpDocument = db.doc(`/thumps/${req.params.thumpId}`);
  let thumpData;
  thumpDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        thumpData = doc.data();
        thumpData.thumpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Thump is missing" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            thumpId: req.params.thumpId,
            userHandle: req.user.handle,
          })
          .then(() => {
            thumpData.likeCount++;
            return thumpDocument.update({ likeCount: thumpData.likeCount });
          })
          .then(() => {
            return res.json(thumpData);
          });
      } else {
        return res
          .status(400)
          .json({ error: "You already liked this particular Thump" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.unlikeThump = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("thumpId", "==", req.params.thumpId)
    .limit(1);
  const thumpDocument = db.doc(`/thumps/${req.params.thumpId}`);
  let thumpData;
  thumpDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        thumpData = doc.data();
        thumpData.thumpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Thump is missing" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Thump is missing" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            thumpData.likeCount--;
            return thumpDocument.update({ likeCount: thumpData.likeCount });
          })
          .then(() => {
            res.json(thumpData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.deleteThump = (req, res) => {
  const document = db.doc(`/thumps/${req.params.thumpId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Thump is missing" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized Access" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Your Thump has been deleted" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
