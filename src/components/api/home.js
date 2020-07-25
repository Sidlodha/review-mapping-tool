import gql from "graphql-tag";

export const GET_NEXT_IMAGE = gql`
query MyQuery($id: Int!) {
  review_mapping(where: {id: {_eq: $id}}) {
    cloth_id
    person_id
    is_cloth_ok
    is_person_ok
    mapping_ok
    isLabelled
  }
}
`;
export const POST_IMAGE_CHECK = gql`
mutation MyMutation($id: Int!, $is_cloth_ok: String!, $is_person_ok: String!, $mapping_ok: String!) {
  update_review_mapping(where: {id: {_eq: $id}}, _set: {is_cloth_ok: $is_cloth_ok, is_person_ok: $is_person_ok, mapping_ok: $mapping_ok, isLabelled: "Labelled"}) {
    affected_rows
  }
}
`;

export const POST_CLOTH_CHECK = gql`
mutation MyMutation($asc_id: String!) {
  update_product_front_back(where: {asc_id: {_eq: $asc_id}}, _set: {appropriate: "No"}) {
    affected_rows
  }
}
`;

export const GET_NEXT_CLOTH_IMAGE = gql`
query MyQuery($cloth_id: Int!) {
  review_mapping(where: {cloth_id: {_eq: $cloth_id}}) {
    map_cloth {
      image_url
      id
    }
  }
}
`;

export const GET_NEXT_PERSON_IMAGE = gql`
query MyQuery($person_id: Int!) {
  review_mapping(where: {person_id: {_eq: $person_id}}) {
    map_person {
      image_url
      id
    }
  }
}
`;