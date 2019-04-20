/*global chrome*/
/* src/content.js */

import Frame, { FrameContextConsumer } from "react-frame-component";
import React from "react";
import ReactDOM from "react-dom";
import { notification } from "antd";
import "antd/lib/notification/style/css";
import "./content.scss";

class Main extends React.Component {
  state = {
    title: "",
    message: "",
    notificationType: ""
  };

  componentDidMount() {
    chrome.runtime.onMessage.addListener(request => {
      if (request.type === "notification") {
        this.setState(
          {
            title: request.title,
            message: request.message,
            notificationType: "success"
          },
          () => {
            this.openNotificationWithIcon(request.notificationType);
          }
        );
      }
    });
  }

  componentWillUnmount() {}

  openNotificationWithIcon = type => {};

  render() {
    return (
      <Frame
        head={[
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/4.chunk.css")}
          />,
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/content.css")}
          />
        ]}
      >
        <FrameContextConsumer>
          {({ document, window }) => {
            return this.state.message ? (
              notification[this.state.notificationType]({
                message: this.state.title,
                description: this.state.message
              })
            ) : (
              <div />
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
