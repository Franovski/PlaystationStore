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
