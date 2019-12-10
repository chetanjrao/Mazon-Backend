var admin = require("firebase-admin");

var serviceAccount = require("/Users/chethanjagannathakulkarni/Documents/mazon-user-application-firebase-adminsdk-wia4q-5bcf955e5d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${process.env.FIREBASE_DATABASE_URL}`
});