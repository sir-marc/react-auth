import React from "react";
import t from 'prop-types';
import getMissingRoles from "./utils/getMissingRoles";
import mapArrayToObj from "./utils/mapArrayToObj";

const { Consumer, Provider } = React.createContext("authorizator");

class AuthProvider extends React.Component {
  render() {
    const { children } = this.props;
    const roles = mapArrayToObj(this.props.roles)
    return (
      <Provider value={{ roles }}>
        {children}
      </Provider>
    );
  }
}

AuthProvider.propTypes = {
  roles: t.arrayOf(t.string),
  children: t.node,
}

class Authorize extends React.Component {
  render() {
    const { neededRoles, children } = this.props;
    return (
      <Consumer>
        {({ roles }) => {
          const missingRoles = getMissingRoles(neededRoles, roles);
          const isAuthorized = !missingRoles.length;
          const lacksRole = role => !roles.hasOwnProperty(role);
          return children({ isAuthorized, missingRoles, lacksRole });
        }}
      </Consumer>
    );
  }
}

Authorize.propTypes = {
  children: t.func,
  neededRoles: t.arrayOf(t.string).isRequired,
}

export {
  AuthProvider,
  Authorize,
}