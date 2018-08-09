import React from 'react';
import { render } from 'react-testing-library'
import { AuthProvider, Authorize } from '../src/index';

const roles = ['user', 'admin'];

test('should render the secured page, if the user has the needed roles', () => {
  const { getByText, queryByText } = render(
    <AuthProvider roles={roles}>
      <Authorize neededRoles={['user']}>
        {
          ({ isAuthorized }) => {
            if (isAuthorized) return <span>Secure Text</span>
            else return <span>Fallback</span>
          }
        }
      </Authorize>
    </AuthProvider>
  );
  expect(getByText('Secure Text')).toNotBeNull;
  expect(queryByText('Fallback')).toBeNull;
})

test('should render the specified fallback if the user lacks some roles', () => {
  const { getByText, queryByText } = render(
    <AuthProvider roles={roles}>
      <Authorize neededRoles={['user', 'photographer']}>
        {
          ({ isAuthorized, lacksRole }) => {
            if (isAuthorized) return <span>Secure Text</span>
            else if (lacksRole('user')) return <span>Fallback for no User</span>
            else if (lacksRole('photographer')) return <span>Fallback for no photographer</span>
          }
        }
      </Authorize>
    </AuthProvider>
  );
  expect(queryByText('Secure Text')).toBeNull;
  expect(queryByText('Fallback for no User')).toBeNull;
  expect(queryByText('Fallback for no photographer')).toNotBeNull;
})

beforeEach(() => {
  jest.spyOn(console, 'error')
  global.console.error.mockImplementation(() => {})
})

afterEach(() => {
  global.console.error.mockRestore()
})
test('incorrect usage', () => {
  const renderWithoutContext = () => render(
    <Authorize neededRoles={['user', 'photographer']}>
      {
        ({ isAuthorized, lacksRole }) => {
          if (isAuthorized) return <span>Secure Text</span>
          else if (lacksRole('user')) return <span>Fallback for no User</span>
          else if (lacksRole('photographer')) return <span>Fallback for no photographer</span>
        }
      }
    </Authorize>
  );
  expect(renderWithoutContext).toThrowError('<Authorize /> used without a corresponding context')
})