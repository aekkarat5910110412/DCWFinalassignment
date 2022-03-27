const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const app = express()
const port = 8080

const TOKEN_SECRET ='d49312dd726e2a469011ca10764dc1809aae465706f88f05d91ad357290217e4e059bbe66ae51988b6a13dbd9dbcd12ef777ab24b8bfbefd9f44f9a6bdc14193'

const authenticated = async (req,res,next)=> {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split('')[1]
    console.log(token)
    if(!token)
     return res.sendStatus(401)
    jwt.verify(token,TOKEN_SECRET, (err,onfo)=>{
        if(err) return res.sendStatus(403)
        req.username = info.username
        next()
    })
   

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.post('/api/login', bodyParser.json(), async (req,res) => 
{
   let token = req.body.token
   let result = await axios.get('https://graph.facebook.com/me',{
       params: {
           fields: 'id,name,email',
           access_token: token
       }
   })
   if(result.data.id){
       res.sendStatus(403)
       return
   }
       let data = {
           username:result.data.email
       }
       let access_token = jwt.sign(data,TOKEN_SECRET,{expiresIn:'1800s'})
       res.send({access_token, username: data.username})
   
 
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})