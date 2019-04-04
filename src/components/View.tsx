import { Layout, Menu, Breadcrumb, Icon } from "antd";

import * as React from "react";
import Sidebar from "./Sidebar";

export default class View extends React.Component {
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>{this.props.children}</Layout>
      </Layout>
    );
  }
}
