import gql from "graphql-tag";

export const GET_PRODUCT_IDS = gql`
query MyQuery {
    product_images(where: {isLabelled: {_eq: "Labelled"}, category: {_eq: "Person"}}, order_by: {id: asc}) {
      id
    }
  }
`;

export const TRANSFER_PRODUCT_IDS = gql`
mutation MyMutation2 ($row: [labelled_images_insert_input!]!){
    insert_labelled_images(objects: $row) {
      affected_rows
    }
  }
`;