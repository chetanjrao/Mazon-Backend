const inorder_payload = (destination_name, name, amount) => {
    var payload = {
        "notification": {
            "title": "New Inorder Recieved",
            "body": `Hey, ${destination_name}. There's a now inorder. Click here to view`
        },
        "data": {
            "name": name,
            "amount": amount.toString()
        }
    }
    return payload
}

module.exports = {
    inorder_payload,
}