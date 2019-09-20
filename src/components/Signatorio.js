import React from "react";
import {
  KirbyEthereum,
  KirbyEthereumProvider,
  KirbyEthereumContext,
  useKirbySelector
} from "@kirby-web3/ethereum-react";
import { Button, Form } from "react-bootstrap";
import Blockies from "react-blockies";
import Loader from 'react-loader-spinner'


import Signatures from "./Signatures.js";


const Signatorio = () => {
  const kirby = React.useContext(KirbyEthereumContext);

  const [bg, setBg] = React.useState(0.01);
  const [message, setMessage] = React.useState("");
  const [signatures, setSignatures] = React.useState([]);
  const [showAbout, setShowAbout] = React.useState(false);

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
          setBg(0.55)
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
    signingForm = (
      <Loader
         type="BallTriangle"
         color="#BBBBBB"
         height={150}
         width={150}
      />
    )
  } else {
    connectDisplay = (
      <div>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 22,
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
            ? account.substring(0, 6) +
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
      <Form >
        <Form.Group controlId="signForm">
          <small id="formHead" className="form-text text-muted" style={{marginBottom:"2vw", fontWeight:'bold', fontSize:16}}>
            <span style={{color:"#FFFFFF"}}>
              Create, verify, and share Ethereum signed messages.
            </span>
          </small>
          <div className="input-group mb-3">
            <input
              type="text"
              className="message-input"
              id="message"
              placeholder={placeholderString}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />{" "}
            <div className="input-group-append" style={{backgroundColor:"#222222"}}>
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
          <small id="formHelp" className="form-text text-muted" >
            <span style={{color:"#FFFFFF"}}>
              Enter a message to sign. Click{" "}
              <span style={{ opacity: 0.9 }}>🕰</span> to add the current timestamp
              and namespace.
            </span>
          </small>
        </Form.Group>
        <Button
          style={{ marginTop: "4vw" }}
          variant={signatures.length > 0 ? "primary": "success"}
          size="lg"
          onClick={async () => requestSign()}
        >
          <span style={{ fontWeight: "bolder" }}>✍️ Sign</span>
        </Button>
      </Form>
    );
  }

  let about = ""
  if(showAbout){
    about = (
      <div style={{width:"80%", margin:10, marginLeft:"10%", marginTop:"4vw", padding:16, border:"1px solid #777777", backgroundColor:"rgba(32, 32, 32, 0.8)"}}>

        <div style={{padding:16}}>
          Using an Ethereum key pair, you can create a <a href="https://en.wikipedia.org/wiki/Digital_signature" target="_blank">digital signature</a> that is tamperproof and proves that a specific account signed a specific message.
        </div>

        <div style={{padding:16}}>
          This is a rough example of an app using the web3 library <a href="https://github.com/joincivil/kirby-web3" target="_blank">Kirby</a>. It is in the alpha test phase but having a product in the wild helps us calibrate our build and <a href="https://github.com/joincivil/kirby-web3/issues" target="_blank">get feedback</a>.
        </div>

        <Button
          style={{ marginTop: "4vw" }}
          variant={"secondary"}
          onClick={async () => setShowAbout(false)}
        >
          <span style={{ fontWeight: "bolder" }}>Rad</span>
        </Button>
      </div>

    )
  }else{
    about = (<Button
      style={{ marginTop: "8vw" }}
      variant={"secondary"}
      onClick={async () => setShowAbout(true)}
    >
      <span style={{ fontWeight: "bolder" }}>About</span>
    </Button>)
  }

  return (
    <div>
      <div style={{zIndex:-1, position:'absolute',width:"100%",height:"100%",left:0,top:0,backgroundColor:"#000000",opacity:bg}}></div>
      <div style={{ position: "absolute", right: "5%", top: "3%" }}>
        {connectDisplay}
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#DDDDDD",
          maxWidth: 600,
          margin: "0 auto",
          marginTop: "40vw"
        }}
      >
        {signingForm}
      </div>
      <Signatures signatures={signatures}/>
      {about}
    </div>
  );
};

export default Signatorio;
