var admin = require("firebase-admin");
var serviceAccount = require('../credentials/firebase-credentials.json');
const {
    inorder_payload
} = require('../services/payload.service')
const TEST_TOKEN = "e2P6HOhLOUE:APA91bFWPZE6i1W1-f3moOOu2WJS7EkRoRt7P6nOwNBnk3AI5DU-6azSNQO-au5lha-pGpdCMnEyc_UdoptXG3mJboBkpGKps6WABlxSQVFHNMHBB1r2v-IwAzMwC5-1N208pjnunHoT"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${process.env.FIREBASE_DATABASE_URL}`
});
const OPTIONS = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
};

const sendNotificationToDevice = async (device_id, payload) => {
    const notification = await admin.messaging().sendToDevice(device_id, payload, OPTIONS)
    return notification
}

const sendNotificationToDevices = async (device_ids, payload) => {
    var message = {
        ...payload,
        tokens: device_ids
    }
    const notification = await admin.messaging().sendMulticast(message, false)
    return notification
}

module.exports = {
    sendNotificationToDevice,
    sendNotificationToDevices
}

// Sample FCM Token: e2P6HOhLOUE:APA91bFWPZE6i1W1-f3moOOu2WJS7EkRoRt7P6nOwNBnk3AI5DU-6azSNQO-au5lha-pGpdCMnEyc_UdoptXG3mJboBkpGKps6WABlxSQVFHNMHBB1r2v-IwAzMwC5-1N208pjnunHoT