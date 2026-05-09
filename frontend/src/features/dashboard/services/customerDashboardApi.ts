import apolloClient from '../../../services/graphql';
import { CUSTOMER_DASHBOARD_QUERY } from './customerDashboard.graphql';
import { CustomerDashboardData } from '../../../types';

export const customerDashboardApi = {
  get: async (): Promise<CustomerDashboardData> => {
    const { data } = await apolloClient.query<any>({
      query: CUSTOMER_DASHBOARD_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.currentUserDashboard;
  },
};
