import React from "react";
import t from 'prop-types';
import invariant from 'invariant';
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
          invariant(roles, '<Authorize /> used without a corresponding context. Did you forget to wrap the app with <AuthProvider/>?');
          const missingRoles = getMissingRoles(neededRoles, roles);
          const isAuthorized = !missingRoles.length;
          const hasRole = role => roles.hasOwnProperty(role);
          const lacksRole = role => !hasRole(role);
          return children({ isAuthorized, missingRoles, lacksRole, hasRole });
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