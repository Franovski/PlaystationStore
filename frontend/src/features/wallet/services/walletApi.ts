import apolloClient from '../../../services/graphql';
import { ADD_WALLET_FUNDS_MUTATION, GET_WALLET_QUERY } from './wallet.graphql';
import { UserWallet } from '../../../types';

export const walletApi = {
  get: async (): Promise<UserWallet> => {
    const { data } = await apolloClient.query<any>({
      query: GET_WALLET_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.wallet;
  },
  addFunds: async (amount: number): Promise<UserWallet> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: ADD_WALLET_FUNDS_MUTATION,
      variables: { addWalletFundsInput: { amount } },
    });
    return data.addWalletFunds;
  },
};
