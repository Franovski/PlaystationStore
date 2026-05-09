import { gql } from '@apollo/client';

export const CUSTOMER_DASHBOARD_QUERY = gql`
  query CurrentUserDashboard {
    currentUserDashboard {
      walletBalance
      wishlistCount
      libraryCount
      orderCount
      wallet {
        walletId
        balance
        updatedAt
        userId
      }
      wishlist {
        wishlistId
        addedAt
        userId
        gameId
        game {
          gameId
          title
          basePrice
          developer
        }
      }
      library {
        libraryId
        purchaseDate
        itemType
        itemId
        userId
      }
      orders {
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
        }
      }
    }
  }
`;
