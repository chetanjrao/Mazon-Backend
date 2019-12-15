var admin = require("firebase-admin");
var serviceAccount = require("/Users/chethanjagannathakulkarni/Documents/mazon-user-application-firebase-adminsdk-wia4q-5bcf955e5d.json");
const {
    inorder_payload
} = require('../services/payload.service')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${process.env.FIREBASE_DATABASE_URL}`
});
const OPTIONS = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
};

const sendNotificationToDevice = (device_id, payload) => {
    const notification = await admin.messaging().sendToDevice(device_id, payload, OPTIONS)
    return notification
}

module.exports = {
    sendNotificationToDevice
}