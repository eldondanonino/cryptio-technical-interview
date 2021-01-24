import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// Enable CORS for *
app.use(cors())

app.get('/address', async (req, res) => { //asynchronous function getting the address from the api
  console.log("server side reached for check")
  try{
    const bob =  await axios.get(`https://blockchain.info/rawaddr/${req.query.address}`)
    console.log(`BOB EQUALS........... ${bob}`)
  if (JSON.stringify(bob).startsWith("Invalid"))
  {
    res.send("C la strit rentre la bonne adres frer")
    return
  }
    console.log(bob);
  }
  catch(err)
  {
    //console.log(err)
  }
})

app.get('/ping', (_, res) => {
  res.send('pong')
})

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port} (${process.env.NODE_ENV ?? 'unknown environment'})`)
})
