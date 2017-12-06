const jwt = require('jsonwebtoken');  //用于生成token
const config = require('./default.js');

function signToken(name){
    console.log(name)
    const token = jwt.sign({
        name,
    }, config.jwt_secret, {expiresIn: 3600});
    return token;
}

async function checkToken(ctx){
    // const token = ctx.state.user; //获取jwt
    // if(token){
    //     const user = 
    // }
    const test = ctx.header.authorization
    const t = test.split(' ')[1]
    console.log(test)
    console.log('...')
    console.log(ctx.state.user)
    console.log('...')
    const decoded = jwt.decode(t, {complete: true});
    console.log(decoded)
    return decoded.payload.name;
}

module.exports = {
    signToken: signToken,
    checkToken: checkToken
};