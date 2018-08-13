import React from 'react';
import t from 'prop-types';
import mapArrayToObj from './utils/mapArrayToObj';
import { Provider } from './AuthContext';

class AuthProvider extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { roles } = props;
    const isStateSet = !!state;
    const isSameRolesObjectAsBefore =
      isStateSet && state.auth.rolesReference === roles;
    if (isSameRolesObjectAsBefore) {
      return null;
    }
    return {
      auth: {
        // store a object reference to the original roles array
        rolesReference: roles,
        roles: mapArrayToObj(roles),
      },
    };
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state.auth}>{children}</Provider>;
  }
}

AuthProvider.propTypes = {
  roles: t.arrayOf(t.string).isRequired,
  children: t.node.isRequired,
};

export default AuthProvider;
