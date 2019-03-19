import * as React from "react";
import { Breadcrumb, Layout } from "antd";
import View from "./View";

const { Header, Content, Footer, Sider } = Layout;

export default class Panel extends React.Component {
  render() {
    return (
      <View>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            Content Goes Here
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </View>
    );
  }
}
