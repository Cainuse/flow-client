import * as React from "react";
import { Breadcrumb, Layout } from "antd";
import View from "./View";

const { Header, Content, Footer, Sider } = Layout;

export default class Panel extends React.Component {
  render() {
    return (
      <div>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            Content Goes Here
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          The Ascension Project 2019
        </Footer>
      </div>
    );
  }
}
