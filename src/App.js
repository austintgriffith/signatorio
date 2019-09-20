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
import { Button } from "react-bootstrap";
import GithubCorner from 'react-github-corners'
import 'react-github-corners/dist/GithubCorner.css'

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

  if (params && params.m && params.s) {
    let signature = Web3.utils.bytesToHex(base64url.toBuffer(params.s))
    return (
      <div style={{ textAlign: "center", color: "#DDDDDD", marginTop: "40vw" }}>
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
        <KirbyEthereumProvider config={config}>
          <Signatorio />
        </KirbyEthereumProvider>
        <GithubCorner target="_blank" url={'https://github.com/austintgriffith/signatorio'} svgStyle={{"stroke": "#777777","left": "0","transform": "scale(-1, 1)","fill":"#000000","color":"#666666"}}/>
      </div>
    );
  }
}

export default App;
