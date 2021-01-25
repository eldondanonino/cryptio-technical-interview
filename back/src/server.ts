import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// Enable CORS for *
app.use(cors())

app.get('/address', async (req, res) => { //asynchronous function getting the address from the api
  console.log("server side reached for check")
  try{
    const bob = await axios.get(`https://blockchain.info/rawaddr/${req.query.address}`)
    console.log(bob); 

    let myTransactionArray : Array<number> = []
    myTransactionArray.push(bob.data.final_balance)//declaring an array of transaction 

    

    //Extracting an array of all balance change concerning our address

    for (let transactions of bob.data.txs) //for each transaction of the address
    {
      let check : boolean = false 
      console.log("first for reached")
      for (let input in transactions.inputs) //checking the inputs 
      {
        console.log("second for reached")
        if(transactions.input.prev_out.addr === req.query.adr)//if we found the transaction
        {
          console.log("first if reached")
          myTransactionArray.push(-transactions.input.prev_out.value) //we deduce the amout of the transaction
          check = true //the transaction is marked as found
          break
        } 
      }
      if (check === false) //the transaction was not an input
      {
        console.log("second if reached")
        for(let output in transactions.outputs) //same for outputs
        {
          console.log("last for reached")
          if (transactions.output.addr === req.query.addr)
          {
            console.log("last if reached")
            myTransactionArray.push(transactions.output.prev_out.value)
            break
          }
        }
      }
    }
    res.send(myTransactionArray) //sending the newly formed array to the front
  }
  catch(err)
  {
    res.send("anvoi 1 vré adres stépé")
  }
})

app.get('/ping', (_, res) => {
  res.send('pong')
})

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port} (${process.env.NODE_ENV ?? 'unknown environment'})`)
})
