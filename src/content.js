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
      this.notificationReceiver(request);
    });
  }

  notificationReceiver = request => {
    if (request.type === "notification") {
      this.setState(
        {
          title: request.title,
          message: request.message,
          notificationType: request.notificationType
        },
        () => {
          setTimeout(() => {
            this.setState({ title: "" });
          }, 10800);
        }
      );
    }
  };

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.notificationReceiver);
  }

  openNotificationWithIcon = document => {
    document.body.style.backgroundColor = "transparent";
    notification.config({
      getContainer: () => {
        return document.body;
      },
      placement: "topRight",
      bottom: 50,
      duration: 10
    });
    notification[this.state.notificationType]({
      message: this.state.title,
      description: this.state.message
    });
  };

  render() {
    return this.state.title ? (
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
            return (
              <div id="iframeid">{this.openNotificationWithIcon(document)}</div>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    ) : (
      <div />
    );
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
