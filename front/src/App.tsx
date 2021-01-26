import axios from 'axios'
import { useState } from 'react'

///TODO : calculer la balance avec la transac

function App(): JSX.Element {
  const [address, setAddress] = useState('')
  const [APIIsLive, setAPIIsLive] = useState(false)
  const [data, setData] = useState<Array<number> | null>()



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
      .then(res => {
        console.log(res.data)
        setData(res.data)
      })      //receiving the array of transactions

      .catch(err => console.error(err))
  }

  const transArray = data?.map(dataElt => {
    return (
      <tr>
        {dataElt}
      </tr>
    )
  }
  )

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
          : <h1>ckc</h1>
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
