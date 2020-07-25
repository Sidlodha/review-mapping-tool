import React from 'react'
import { Grid, Box, Text, List, ListItem, ListIcon } from "@chakra-ui/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_LABELLED = gql`
    query getlabelled ($isLabelled: String!) {
        product_images(where: {isLabelled: {_eq: $isLabelled}}, , order_by: {id: asc}) {
        product_id
        image_id
        isLabelled
        }
    }
`;

function Admin() {
    const { data } = useQuery(GET_LABELLED, {
        variables: { isLabelled: "Not Labelled" }
    });
    const { data: { product_images } = [] } = useQuery(GET_LABELLED, {
        variables: { isLabelled: "Labelled" }
    });
    return (
        <div>
            <Text fontSize="30px"><u>This is the admin page</u></Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <Box w="100%">
                    <h2 style={{ color: "red" }}>Unlabelled Data</h2>
                    <List as="ol" styleType="decimal">
                        {data && data.product_images.map(item => {
                            return (
                                <ListItem>
                                    <ListIcon icon="warning" color="red.500" />
                                    <u>product_id </u>: {item.product_id} and <u>image_id</u>: {item.image_id}
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
                <Box w="100%">
                    <h2 style={{ color: "green" }}>Labelled Data</h2>
                    <List as="ol" styleType="decimal">
                        {product_images && product_images.map(item => {
                            return (
                                <ListItem>
                                    <ListIcon icon="check-circle" color="green.500" />
                                    <u>product_id </u>: {item.product_id} and <u>image_id</u>: {item.image_id}
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Grid>
        </div>
    )
}

export default Admin
