import axios from "axios";
import { useState } from "react";

function App(): JSX.Element {
  const [address, setAddress] = useState("");
  const [APIIsLive, setAPIIsLive] = useState(false);
  const [data, setData] = useState<Array<number> | null>();

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
      transArray = data?.map((dataElement) => {
      balance -= dataElement;
        if (dataElement > 0) {
          return (
            <tr>

              <td>
                {" "}<b>Balance</b> : {(balance / 100000000).toFixed(9)} BTC{" "}
              </td>

              <td>
                {" "}<b>Transaction</b> :{" "}
                <span style={{ color: "green" }}>
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

            {dataElement !== 0 
            ? (
              <td>
                <b>Transaction</b> :{" "}

                <span style={{ color: "red" }}>
                  - {(-dataElement / 100000000).toFixed(9)} BTC
                </span>

              </td>
            )
            : (<td/>)}
          </tr>
        );
      });
    } else {
      transArray = <h2 style={{ color: "red" }}>Your address does not appear to exist...</h2>;
    }
  }

  return (
    <div style={{ maxWidth: "42em", margin: "0 auto" }}>
      <p style={{ fontWeight: "bold" }}>Bitcoin Historical Balances</p>
      <input
        type="text"
        placeholder="Please input a valid Bitcoin address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        style={{ marginLeft: "1em" }}
        type="submit"
        value="Go!"
        onClick={() => checkAddress(address) /*() =>console.log(address)*/}
      />

      {data ? (
        <table>
          <tbody> {transArray} </tbody>
        </table>
      ) : (
          <h1></h1>
        )}

      {address !== "" ? (
        <p>
          Historical balances for address <code>{address}</code> should appear
          here...
        </p>
      ) : (
          <p>There is no address...</p>
        )}

      <hr />
      {APIIsLive ? (
        <p>The API is live!</p>
      ) : (
          <p style={{ color: "red" }}>The API did not respond...</p>
        )}
    </div>
  );
}

export default App;
