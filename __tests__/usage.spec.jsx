/* eslint react/no-multi-comp: 0 */
/* eslint react/no-unused-state: 0 */

import React from 'react';
import { render } from 'react-testing-library';
import { AuthProvider, Authorize } from '../src/index';

const roles = ['user', 'admin'];

test('should render the secured page, if the user has the needed roles', () => {
  const { getByText, queryByText } = render(
    <AuthProvider roles={roles}>
      <Authorize neededRoles={['user']}>
        {
          ({ isAuthorized }) => {
            if (isAuthorized) return <span>Secure Text</span>;
            return <span>Fallback</span>;
          }
        }
      </Authorize>
    </AuthProvider>,
  );
  expect(getByText('Secure Text')).toNotBeNull;
  expect(queryByText('Fallback')).toBeNull;
});

test('should render the specified fallback if the user lacks some roles', () => {
  const { queryByText } = render(
    <AuthProvider roles={roles}>
      <Authorize neededRoles={['user', 'photographer']}>
        {
          ({ isAuthorized, lacksRole }) => {
            if (isAuthorized) return <span>Secure Text</span>;
            if (lacksRole('user')) return <span>Fallback for no User</span>;
            if (lacksRole('photographer')) return <span>Fallback for no photographer</span>;
          }
        }
      </Authorize>
    </AuthProvider>,
  );
  expect(queryByText('Secure Text')).toBeNull;
  expect(queryByText('Fallback for no User')).toBeNull;
  expect(queryByText('Fallback for no photographer')).toNotBeNull;
});

test('should render the specified fallback if the user has a specific role', () => {
  const { queryByText } = render(
    <AuthProvider roles={roles}>
      <Authorize neededRoles={['user', 'photographer']}>
        {
          ({ hasRole }) => {
            if (hasRole('photographer')) return <span>You are an excellent photographer</span>;
            if (hasRole('user')) return <span>Secret User content</span>;
            if (hasRole('admin')) return <span>For Admin eyes only</span>;
          }
        }
      </Authorize>
    </AuthProvider>,
  );
  expect(queryByText('You are an excellent photographer')).toBeNull;
  expect(queryByText('For Admin eyes only')).toBeNull;
  expect(queryByText('Secret User content')).toNotBeNull;
});

beforeEach(() => {
  jest.spyOn(console, 'error');
  global.console.error.mockImplementation(() => {});
});

afterEach(() => {
  global.console.error.mockRestore();
});
test('incorrect usage', () => {
  const renderWithoutContext = () => render(
    <Authorize neededRoles={['user', 'photographer']}>
      {
        ({ isAuthorized, lacksRole }) => {
          if (isAuthorized) return <span>Secure Text</span>;
          if (lacksRole('user')) return <span>Fallback for no User</span>;
          if (lacksRole('photographer')) return <span>Fallback for no photographer</span>;
        }
      }
    </Authorize>,
  );
  expect(renderWithoutContext).toThrowError('<Authorize /> used without a corresponding context');
});

test('no unrequired rerender', () => {
  const renderOnlyOnceMock = jest.fn();
  renderOnlyOnceMock.mockReturnValue(null);
  // this component will always rerender when anything changes
  class RerenderingParent extends React.Component {
    componentDidMount() {
      // trigger a rerender directly after the component has been attached
      // and all others have been mounted as well
      this.setState({
        triggerRerender: true,
      });
    }

    render() {
      return (
        <AuthProvider roles={roles}>
          <RenderMeOnlyOnce />
        </AuthProvider>
      );
    }
  }

  const neededRoles = [];

  class RenderMeOnlyOnce extends React.Component {
    shouldComponentUpdate() {
      return false;
    }

    render() {
      return (
        <Authorize neededRoles={neededRoles}>{renderOnlyOnceMock}</Authorize>
      );
    }
  }

  render(<RerenderingParent />);

  expect(renderOnlyOnceMock.mock.calls.length).toBe(1);
});

test('rerender when required', () => {
  const rerenderWhenRequiredMock = jest.fn();
  rerenderWhenRequiredMock.mockReturnValue(null);
  // this component will always rerender when anything changes
  class RerenderingParent extends React.Component {
    constructor() {
      super();
      this.state = {
        roles: [],
      };
    }

    componentDidMount() {
      // trigger a rerender directly after the component has been attached
      // and all others have been mounted as well
      this.setState({
        roles: ['admin'],
      });
    }

    render() {
      return (
        <AuthProvider roles={this.state.roles}>
          <RenderMeWithNewRoles />
        </AuthProvider>
      );
    }
  }

  const neededRoles = [];

  class RenderMeWithNewRoles extends React.Component {
    shouldComponentUpdate() {
      return false;
    }

    render() {
      return (
        <Authorize neededRoles={neededRoles}>
          {rerenderWhenRequiredMock}
        </Authorize>
      );
    }
  }

  render(<RerenderingParent />);

  expect(rerenderWhenRequiredMock.mock.calls.length).toBe(2);
});
