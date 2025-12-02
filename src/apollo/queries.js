import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $first: Int
    $after: String
    $filter: EmployeeFilterInput
    $sort: EmployeeSortInput
  ) {
    employees(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        cursor
        node {
          id
          userId
          name
          email
          phone
          age
          class
          subjects
          attendance
          status
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      userId
      name
      email
      phone
      age
      class
      subjects
      attendance
      status
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      userId
      name
      email
      phone
      age
      class
      subjects
      attendance
      status
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      userId
      name
      email
      phone
      age
      class
      subjects
      attendance
      status
    }
  }
`;

export const UPDATE_EMPLOYEE_STATUS = gql`
  mutation UpdateEmployeeStatus($id: ID!, $status: EmploymentStatus!) {
    updateEmployeeStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
    }
  }
`;
