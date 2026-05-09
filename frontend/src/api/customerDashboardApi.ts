import apolloClient from './apolloClient';
import { CUSTOMER_DASHBOARD_QUERY } from '../graphql/customerDashboard';
import { CustomerDashboardData } from '../types';

export const customerDashboardApi = {
  get: async (): Promise<CustomerDashboardData> => {
    const { data } = await apolloClient.query<any>({
      query: CUSTOMER_DASHBOARD_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.currentUserDashboard;
  },
};
