import axios from 'axios'
import { useState } from 'react'

function App(): JSX.Element {
  const [address, setAddress] = useState('')
  const [APIIsLive, setAPIIsLive] = useState(false)
  const [data, setData] = useState<Array<number> | null>()

  let balance : number

  useState(() => {
    axios.get('http://localhost:8080/ping')
      .then(resp => setAPIIsLive(resp.data === 'pong'))
      .catch(err => {
        console.error(err)
        setAPIIsLive(false)
      })
  })

  function checkAddress(address: String) {
    console.log(`checking with address = ${address}`)
    const bob = axios.get('http://localhost:8080/address', {
      params: {
        address: address
      }
    })
      .then(res => {//receiving the array of transactions
         balance = res.data[0]
         console.log(res.data , balance)

        setData(res.data)
      })      

      .catch(err => console.error(err))
  }



let i : number = 0
let tmp : number = 0
//todo fix .map if the address is not working 
  let transArray 
  if (data){
  if(data[0] !== -1){
    console.log(data)
    transArray= data?.map(dataElement => {
    balance -= dataElement //c'est ça qui casse 
    console.log(balance)
    //console.log(balance)
    if(dataElement>0)
    {
   return (
      <tr>
          <td > <b>Transaction</b> : {(dataElement / 100000000).toFixed(9)} BTC </td> 
          <td> <b>Balance</b> : {(balance / 100000000).toFixed(9)} BTC </td>
      </tr>
    )}
    return (
      <tr>
          <td > <b>Transaction</b> : {(dataElement / 100000000).toFixed(9)} BTC </td> 
          <td> <b>Balance</b> {(balance / 100000000).toFixed(9)} BTC </td>
      </tr>
    )}

  )}
}

  return (
    <div style={{ maxWidth: '42em', margin: '0 auto' }}>
      <p style={{ fontWeight: 'bold' }}>Bitcoin Historical Balances</p>
      <input
        type='text'
        placeholder='Please input a valid Bitcoin address'
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <input style={{ marginLeft: '1em' }} type='submit' value='Go!' onClick={() => checkAddress(address)/*() =>console.log(address)*/} />

      {
        data
          ? <table><body> {transArray} </body></table>
          : <h1></h1>
      }

      {
        address !== ''
          ? <p>Historical balances for address <code>{address}</code> should appear here...</p>
          : <p>There is no address...</p>
      }

      <hr />
      {
        APIIsLive
          ? <p>The API is live!</p>
          : <p style={{ color: 'red' }}>The API did not respond...</p>
      }
    </div>
  )
}

export default App
