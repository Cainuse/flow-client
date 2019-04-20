/*global chrome*/
/* src/content.js */

import Frame, { FrameContextConsumer } from "react-frame-component";
import React from "react";
import ReactDOM from "react-dom";
import { notification, Modal } from "antd";
import "./content.scss";

class Main extends React.Component {
  state = {
    message: "",
    messageType: ""
  };

  componentDidMount() {
    chrome.runtime.onMessage.addListener(request => {
      if (request.type === "general-notification") {
        this.setState(
          {
            message: request.message,
            messageType: request.notificationType
          },
          () => {}
        );
      }
    });
  }

  handleOk = e => {};

  handleCancel = e => {};

  componentWillUpdate(prevProp, prevState) {}

  componentWillUnmount() {}

  openNotificationWithIcon = type => {
    notification[type]({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification."
    });
  };
  // this.openNotificationWithIcon("success");
  render() {
    return (
      <Frame
        head={[
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/content.css")}
          />,
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/0.chunk.css")}
          />
        ]}
      >
        <FrameContextConsumer>
          {({ document, window }) => {
            return (
              <div>
                <Modal
                  title="Basic Modal"
                  visible={true}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  {" "}
                  <div>HIII DO YOU SEE ME?</div>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                </Modal>
              </div>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    );
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
