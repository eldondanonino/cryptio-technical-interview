import express from "express";
import cors from "cors";
import axios, { AxiosResponse } from "axios";

const app = express();

// Enable CORS for *
app.use(cors());

app.get("/address", async (req, res) => {
  //asynchronous function getting the address from the api
  console.log("server side reached for check");
  try {
    let offset: number = 0;
    let bob: AxiosResponse<any>;
    let myTransactionArray: Array<number> = [];
    do {
      bob = await axios.get(
        `https://blockchain.info/rawaddr/${req.query.address}`,
        {
          params: {
            offset: offset,
          },
        }
      );

      if (offset === 0) myTransactionArray.push(bob.data.final_balance); //declaring an array of transaction

      //Extracting an array of all balance change concerning our address

      for (let transactions of bob.data.txs) {
        //for each transaction of the address
        myTransactionArray.push(transactions.result);
      }

      //sending the newly formed array to the front

      offset += 50;
    } while (bob.data.n_tx - offset > 0);
    console.log("\n\n----   TRANSACTION -----");
    console.log(myTransactionArray);
    let sum: number = 0;
    for (let transaction of myTransactionArray) {
      sum += transaction;
    }
    console.log(sum);
    res.send(myTransactionArray);
  } catch (err) {
    console.log(err);
    res.send("anvoi 1 vré adres stépé");
  }
});

app.get("/ping", (_, res) => {
  res.send("pong");
});

const port = 8080;
app.listen(port, () => {
  console.log(
    `Server listening on port ${port} (${
      process.env.NODE_ENV ?? "unknown environment"
    })`
  );
});