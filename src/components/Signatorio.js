import React from "react";
import {
  KirbyEthereum,
  KirbyEthereumProvider,
  KirbyEthereumContext,
  useKirbySelector
} from "@kirby-web3/ethereum-react";
import { Button, Form } from "react-bootstrap";
import Blockies from "react-blockies";

import Signatures from "./Signatures.js";


const Signatorio = () => {
  const kirby = React.useContext(KirbyEthereumContext);

  const [message, setMessage] = React.useState("");
  const [signatures, setSignatures] = React.useState([]);

  const placeholderString = "Signatorio " + new Date().toJSON();

  const readonly = useKirbySelector(state => state.ethereum.readonly);
  const account = useKirbySelector(state => state.ethereum.account);

  React.useEffect(() => {
    if (readonly === true) {
      console.log("enabling Kirby...");
      kirby
        .enable()
        .then(() => {
          console.log("ENABLED", kirby);
        })
        .catch(err => {
          console.log("error enabling web3", err);
        });
    }
  }, [kirby, readonly]);

  async function requestSign() {
    const web3 = kirby.web3;
    let messageToSign;
    if (!message) {
      messageToSign = placeholderString;
    } else {
      messageToSign = message;
    }
    const result = await web3.eth.personal.sign(messageToSign, account);

    setSignatures([
      {
        message: messageToSign,
        signature: result,
        recover: web3.eth.accounts.recover(messageToSign, result)
      },
      ...signatures
    ]);
    return result;
  }

  let connectDisplay;
  let accountInfo;
  let signingForm;

  if (readonly) {
    connectDisplay = (
      <Button
        onClick={async () => {
          kirby.web3.currentProvider.enable();
        }}
        variant="dark"
        size="lg"
      >
        Connecting...
      </Button>
    );
  } else {
    connectDisplay = (
      <div>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 24,
            paddingRight: 16,
            verticalAlign: "middle"
          }}
        >
          <span style={{ paddingRight: 8 }}>
            <Blockies
              seed={account ? account.toLowerCase() : ""}
              size={8}
              scale={5}
            />
          </span>
          {account
            ? account.substring(0, 7) +
              "..." +
              account.substring(account.length - 4)
            : ""}
        </span>
        <Button
          onClick={async () => {
            kirby.ethereum.changeAccount();
          }}
          variant="secondary"
          size="lg"
        >
          Update
        </Button>
      </div>
    );
    signingForm = (
      <Form>
        <Form.Group controlId="signForm">
        <small id="formHead" className="form-text text-muted" style={{marginBottom:"2vw"}}>
          Sign and verify messages with an ethereum key pair.
          </small>
          <div class="input-group mb-3">
            <input
              type="text"
              className="message-input"
              id="message"
              placeholder={placeholderString}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />{" "}
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={e => {
                  if (message.indexOf(placeholderString.substring(0, 21)) < 0) {
                    setMessage(placeholderString + " " + message);
                  } else {
                    let actualMessage = message.substring(
                      message.indexOf(" ", message.indexOf(" ") + 1) + 1
                    );
                    setMessage(placeholderString + " " + actualMessage);
                  }
                }}
              >
                🕰
              </button>
            </div>
          </div>
          <small id="formHelp" className="form-text text-muted">
            Enter a message to sign. Click{" "}
            <span style={{ opacity: 0.5 }}>🕰</span> to add the current timestamp
            and namespace.
          </small>
        </Form.Group>
        <Button
          style={{ marginTop: "4vw" }}
          variant={signatures.length > 0 ? "success" : "primary"}
          size="lg"
          onClick={async () => requestSign()}
        >
          <span style={{ fontWeight: "bolder" }}>✍️ Sign</span>
        </Button>
      </Form>
    );
  }

  return (
    <div>
      <div style={{ position: "absolute", right: "5%", top: "3%" }}>
        {connectDisplay}
      </div>
      
      <div
        style={{
          textAlign: "center",
          color: "#DDDDDD",
          maxWidth: 600,
          margin: "0 auto",
          marginTop: "14vw"
        }}
      >
        {signingForm}
      </div>
      <Signatures signatures={signatures}/>
    </div>
  );
};

export default Signatorio;
