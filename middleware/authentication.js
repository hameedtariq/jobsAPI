const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')


const auth = async (req,res,next)=> {
    const authHead = req.headers.authorization;
    if(!authHead || !authHead.startsWith('Bearer'))
    {
        throw new UnauthenticatedError('Please Sign in or Register in order to see jobs')
    }
    try {
        const token = authHead.split(' ')[1]
        const payload = await jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userID: payload.userID, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Please Sign in or Register in order to see jobs')
    }
    
}

module.exports = auth