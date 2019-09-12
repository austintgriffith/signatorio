import React from "react";
import {
  KirbyEthereum,
  KirbyEthereumProvider,
  KirbyEthereumContext,
  useKirbySelector
} from "@kirby-web3/ethereum-react";
import queryString from "query-string";
import Signatorio from "./components/Signatorio.js";
import Signatures from "./components/Signatures.js";
const Web3 = require("web3");
let base64url = require("base64url");
let web3 = new Web3()

function App() {
  const params = queryString.parse(window.location.search);

  const config = {
    dmz: {
      targetOrigin: "https://kirbyweb3.com",
      iframeSrc: "https://kirbyweb3.com"
    },
    ethereum: {
      readOnlyNodeURI:
        "wss://mainnet.infura.io/v3/e59c464c322f47e2963f5f00638be2f8"
    }
  };

  const title = (
    <div
        style={{
          textAlign: "center",
          color: "#555555",
          marginTop: "14vw",
          fontSize: "16vw",
          fontWeight:"bold",
          fontFamily: "'League Script', cursive"
        }}
      >
        Signatorio
      </div>
  )

  if (params && params.m && params.s) {
    let signature = Web3.utils.bytesToHex(base64url.toBuffer(params.s))
    return (
      <div style={{ textAlign: "center", color: "#DDDDDD" }}>
        {title}
        <Signatures
          hint={true}
          signatures={[
            {
              message: params.m,
              signature: signature,
              recover: web3.eth.accounts.recover(params.m, signature)
            }
          ]}
        />
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center", color: "#DDDDDD" }}>
        {title}
        <KirbyEthereumProvider config={config}>
          <Signatorio />
        </KirbyEthereumProvider>
      </div>
    );
  }
}

export default App;
