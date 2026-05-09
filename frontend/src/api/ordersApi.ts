import apolloClient from './apolloClient';
import { CREATE_ORDER_MUTATION, GET_ORDERS_QUERY } from '../graphql/orders';
import { Order } from '../types';

export type CreateOrderPayload = {
  paymentMethod: 'wallet' | 'card';
  items: Array<{
    itemType: 'game' | 'dlc' | 'edition';
    itemId: number | string;
  }>;
};

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ORDERS_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.orders ?? [];
  },
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const createOrderInput = {
      paymentMethod: payload.paymentMethod,
      items: payload.items.map((item) => ({
        itemType: item.itemType,
        itemId: Number(item.itemId),
      })),
    };

    const { data } = await apolloClient.mutate<any>({
      mutation: CREATE_ORDER_MUTATION,
      variables: { createOrderInput },
    });
    return data.createOrder;
  },
};
