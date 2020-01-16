const OauthClient = require('../models/oauthclient.model')
const crypto = require('crypto')

const create_oauth_client = async (client_id, package_identifier, client_type, client_secret, authorization_url, description, project_name, project_id, scopes, home_page_url, email, developer_name) => {
    const client_secret = crypto.randomBytes(16).toString("hex")
    const new_oauth_client_document = new OauthClient({
        client_id: client_id,
        package_identifier: package_identifier,
        client_type: client_type,
        client_secret: client_secret,
        authorization_url: authorization_url,
        description: description,
        project_name: project_name,
        project_id: project_id,
        scopes: scopes,
        home_page_url: home_page_url,
        email: email,
        developer_name: developer_name
    })
    const new_oauth_client = await new_oauth_client_document.save()
    return new_oauth_client
}

const disable_oauth_client = async (client_id, disabled_by) => {
    const oauth_client = await OauthClient.findOneAndUpdate({
        "client_id": client_id
    }, {
        "is_disabled.is_disabled": true,
        "is_disabled.disabled_by": disabled_by,
        "is_disabled.disabled_at": new Date()
    })
    return oauth_client
}

module.exports = {
    create_oauth_client,
    disable_oauth_client
}