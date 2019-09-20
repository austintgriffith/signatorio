import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Blockies from "react-blockies";
var Web3 = require('web3');
var QRCode = require('qrcode.react');
let base64url = require('base64url')

const Signatures = props => {
  let signatures = props.signatures.map(signatureObject => {
    const charsPerLine = 22;
    let signatureLines = [];
    let c = charsPerLine;
    for (let s = 0; c <= 132; c += charsPerLine) {
      signatureLines.push(
        <div>{signatureObject.signature.substring(s, c)}</div>
      );
      s = c + 1;
    }
    let signatureDisplay = <div>{signatureLines}</div>;

    const blockSize = 104

    let link =
      window.location.protocol + "//" +
      window.location.host +
      "/?m=" +
      encodeURI(signatureObject.message) +
      "&s=" +
      base64url(Web3.utils.hexToBytes(signatureObject.signature))

    let hint
    let cursor = "pointer"

    if(props.static){
      cursor = "auto"
      hint = (
        <div style={{marginTop:"4vw"}}>
          <div>
            ✅ This message was signed by {signatureObject.recover}
          </div>
          <div>
            📜 Message: "{signatureObject.message}"
          </div>
          <div>
            🔏 Signature: <div style={{fontSize:11}}>{signatureObject.signature}</div>
          </div>
        </div>
      )
    }

    return (
      <div style={{ margin: 'auto', margin: 8, padding: 8, paddingBottom:16, border: "1px solid #666666", backgroundColor:"rgba(32, 32, 32, 0.8)", cursor:cursor, marginTop: "4vw"}} onClick={() => {
        if(!props.static){
          window.open(link);
        }
      }}>

        <Row

        >
          <Col xs={12} style={{ fontWeight: "bolder", fontSize: 14 }}>
          🔏 {signatureObject.message}
          </Col>
        </Row>
        <Row style={{ margin: 'auto', marginTop: 8 }}>
          <Col>
            <Blockies
              seed={signatureObject.recover.toLowerCase()}
              size={8}
              scale={blockSize/8}
            />
          </Col>
          <Col style={{ fontSize: 12 }}>
            {signatureLines}
          </Col>
          <Col>
            <div style={{ margin: 'auto', backgroundColor: "#FFFFFF", width:blockSize,height:blockSize }}>
              <QRCode
                value={link}
                size={blockSize}
                level={"L"}
                includeMargin={true}
              />
            </div>
          </Col>
        </Row>
        {hint}
      </div>
    );
  });
  return (
    <div style={{ marginTop: "4vw" }}>
      <Container>{signatures}</Container>
    </div>
  );
};

export default Signatures;
