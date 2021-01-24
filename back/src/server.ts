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
    console.log(bob);

    let myTransactionArray : Array<number> = bob.data.final_balance//declaring an array of transaction 
    let i : number = 1
    

    //Extracting an array of all transactions concerning our address

    for (let transactions of bob.data.txs) //for the transactions of the address
    {
      let check : boolean = false
      for (let input in bob.data.transaction.inputs) //checking the inputs for the address
      {
        if(bob.data.transaction.input.prev_out.addr === req.query.adr)//if we found the transaction
        {
          myTransactionArray.push(-bob.data.transaction.input.prev_out.value) //we remove the amout of the transaction
          check = true //the transaction is marked as found
          break
        }
      }
      if (check === false) //the transaction was not an input
      {
        for(let output in bob.data.transaction.outputs) //same for outputs
        {
          if (bob.data.transaction.output.addr === req.query.addr)
          {
            myTransactionArray.push(bob.data.transaction.output.prev_out.value)
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
