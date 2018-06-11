import React from "react";
import getMissingRoles from "./utils/getMissingRoles";

const { Consumer, Provider } = React.createContext("authorizator");

export class AuthProvider extends React.Component {
  checkProps(roles) {
    if (!Array.isArray(roles)) {
      throw new Error(`Roles: ${roles} is not an array`);
    }
  }
  render() {
    const roles = this.props.roles || [];
    this.checkProps(roles);
    return (
      <Provider value={{ roles: this.props.roles }}>
        {this.props.children}
      </Provider>
    );
  }
}

export class Authorize extends React.Component {
  render() {
    return (
      <Consumer>
        {({ roles }) => {
          const neededRoles = this.props.neededRoles || [];
          const missingRoles = getMissingRoles(neededRoles, roles);
          const isAuthorized = !missingRoles.length;
          const lacksRole = role => missingRoles.indexOf(role) >= 0;
          return this.props.children({ isAuthorized, missingRoles, lacksRole });
        }}
      </Consumer>
    );
  }
}
