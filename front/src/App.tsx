import axios from "axios";
import { useState } from "react";
import "../src/style.css"

function App(): JSX.Element {
  const [address, setAddress] = useState("");
  const [APIIsLive, setAPIIsLive] = useState(false);
  const [data, setData] = useState<Array<number> | null>(); //dynamically stores the data

  let balance: number;
  let transArray;

  useState(() => {
    axios
      .get("http://localhost:8080/ping")
      .then((resp) => setAPIIsLive(resp.data === "pong"))
      .catch((err) => {
        console.error(err);
        setAPIIsLive(false);
      });
  });

  function checkAddress(address: String) {
    console.log(`checking with address = ${address}`);
    const bob = axios
      .get("http://localhost:8080/address", {
        params: {
          address: address,
        },
      })
      .then((res) => {
        //receiving the array of transactions
        setData(res.data);
      })

      .catch((err) => console.error(err));
  }

  if (data) { 
    if (data[0] !== -1) { //if it is a valid address
      balance = data[0]; //we set the balance (first element of the array)

      transArray = data.map((dataElement) => {
        balance -= dataElement;
        if (dataElement > 0) {
          return (
            <tr>

              <td>
                {" "}<b>Balance</b> : {(balance / 100000000).toFixed(9)} BTC{" "}
              </td>

              <td>
                {" "}<b>Transaction</b> :{" "}
                <span style={{ color: "#37FF8B" }}>
                  + {(dataElement / 100000000).toFixed(9)} BTC{" "}
                </span>
              </td>

            </tr>
          );
        }
        return (
          <tr>

            <td>
              <b>Balance</b> : {(balance / 100000000).toFixed(9)} BTC
            </td>

            {dataElement !== data[0] //fixed a small issue for when the wallet is not currently empty
            ? (
              <td>
                <b>Transaction</b> :{" "}

                <span style={{ color: "#DB5461" }}>
                  - {(-dataElement / 100000000).toFixed(9)} BTC
                </span>

              </td>
            )
            : (<td/>)}
          </tr>
        );
      });
    } else {
      transArray = <h2 style={{ color: "#DB5461" }}>Your address does not appear to exist...</h2>;
    }
  }

  return (
    <div className="global">
      <div className="container" style={{ maxWidth: "42em", margin: "0 auto" }}>
      <p style={{ fontWeight: "bold" }}>Bitcoin Historical Balances</p>
      <input className="searchbar"
        type="text"
        placeholder="Please input a valid Bitcoin address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      
      <input className="go"
        style={{ marginLeft: "1em" }}
        type="submit"
        value="Go!"
        onClick={() => checkAddress(address)}
      />

      {data ? (
        <table>
          <tbody> {transArray} </tbody>
        </table>
      ) : (
          <h1></h1>
        )}

      {address !== "" ? (
        <p className="global">
          Historical balances for address <b style = {{color : "#EA9010"}}> {address} </b> should appear
          here...
        </p >
      ) : (
          <p className="global">There is no address...</p>
        )}

      
      {APIIsLive ? (
        <p style= {{color : "#37FF8B"}}>The API is live!</p>
      ) : (
          <p style={{ color: "#DB5461" }}>The API did not respond...</p>
        )}
    </div>
    </div>
  );
}

export default App;
