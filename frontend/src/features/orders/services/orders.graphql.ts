import { gql } from '@apollo/client';

export const ORDER_FIELDS = gql`
  fragment OrderFields on Order {
    orderId
    orderDate
    totalPrice
    paymentMethod
    status
    userId
    items {
      orderItemId
      itemType
      itemId
      price
      orderId
      game {
        gameId
        title
      }
      dlc {
        dlcId
        name
        gameId
        game {
          gameId
          title
        }
      }
      edition {
        editionId
        name
        gameId
        game {
          gameId
          title
        }
      }
    }
  }
`;

export const GET_ORDERS_QUERY = gql`
  ${ORDER_FIELDS}
  query Orders {
    orders {
      ...OrderFields
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  ${ORDER_FIELDS}
  mutation CreateOrder($createOrderInput: CreateOrderDto!) {
    createOrder(createOrderInput: $createOrderInput) {
      ...OrderFields
    }
  }
`;
