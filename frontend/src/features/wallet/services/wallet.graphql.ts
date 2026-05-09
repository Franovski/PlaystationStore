import { gql } from '@apollo/client';

export const WALLET_FIELDS = gql`
  fragment WalletFields on UserWallet {
    walletId
    balance
    updatedAt
    userId
  }
`;

export const GET_WALLET_QUERY = gql`
  ${WALLET_FIELDS}
  query Wallet {
    wallet {
      ...WalletFields
    }
  }
`;

export const ADD_WALLET_FUNDS_MUTATION = gql`
  ${WALLET_FIELDS}
  mutation AddWalletFunds($addWalletFundsInput: AddWalletFundsDto!) {
    addWalletFunds(addWalletFundsInput: $addWalletFundsInput) {
      ...WalletFields
    }
  }
`;
