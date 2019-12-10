const generate_unique_identifier = (count) => {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < count; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generate_otp = (count) => {
    var result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < count; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = {
    generate_unique_identifier,
    generate_otp
}