import React, {useState} from "react";
import { Grid, Text } from "@chakra-ui/core";
import {
  useHistory,
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from "react-router-dom";
import { Image, Box, Button } from "@chakra-ui/core";
import { Divider } from "@chakra-ui/core";
import { GET_NEXT_10_DUPLICATE } from "../api/home";
import {useQuery} from '@apollo/react-hooks'

function Next10(props) {
  const {
    nextset,
    product_id,
    nextid,
    linkChange,
    update_isDuplicate,
    update_next10,
  } = props;
  const history = useHistory();
  const [products_duplicate_ob, setProdOb] = useState({})
  const { data: nextsetduplicate } = useQuery(GET_NEXT_10_DUPLICATE, {
    variables: {
      first: product_id,
      last: nextid
    },
    onCompleted(nextsetduplicate){
        let temp = {}
        if(nextsetduplicate && nextsetduplicate.product_condition){
          for(let prod = 0;prod < nextsetduplicate.product_condition.length; prod+=1){
              temp[nextsetduplicate.product_condition[prod].product_id] = nextsetduplicate.product_condition[prod].isDuplicate
          }
        }
        setProdOb(temp)
    }
  })
  let products = [];
  let tmp = { prod_id: undefined, image_urls: [] };
  let id = nextset.product_images[0].product_id;
  for (let i = 0; i < nextset.product_images.length; i++) {
    if (id === nextset.product_images[i].product_id) {
      tmp.prod_id = nextset.product_images[i].product_id;
      tmp.image_urls.push(nextset.product_images[i].image_url);
    } else {
      products.push(tmp);
      tmp = {
        prod_id: nextset.product_images[i].product_id,
        image_urls: [nextset.product_images[i].image_url],
      };
      id = nextset.product_images[i].product_id;
    }
  }
  products.push(tmp);
  return (
    <div>
      <Box margin="auto">
        {products.map((item) => {
          return (
            <div>
              <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                {item &&
                  item.image_urls &&
                  item.image_urls.map((url) => {
                    return (
                      <div>
                        <img
                          src={url && linkChange(url)}
                          height="200px"
                          alt="No image in database"
                        />
                      </div>
                    );
                  })}
              </Grid>
              <Button
                onClick={() => {
                  console.log(!products_duplicate_ob[item.prod_id],"could not")  
                  update_isDuplicate({
                    variables: {
                      product_id: item.prod_id,
                      isDuplicate: !products_duplicate_ob[item.prod_id],
                    }
                  });
                  let temp = products_duplicate_ob
                  temp[item.prod_id] = !products_duplicate_ob[item.prod_id]
                  setProdOb(temp)
                }}
              >
                Mark as {products_duplicate_ob[item.prod_id]?"Not a Duplicate":"Duplicate"}
              </Button>
              <Divider borderColor="black" />
            </div>
          );
        })}
        <br />
        <Button
          variantColor="teal"
          size="md"
          onClick={() => {
            history.push(`/productid=${product_id}&imageid=all`);
          }}
        >
          Label
        </Button>{" "}
        &nbsp; &nbsp;
        <Button
          variantColor="red"
          size="md"
          onClick={() => {
            update_next10({
              variables: {
                first: product_id,
                last: nextid,
                condition: "bad",
              },
            });
            let newid = parseInt(product_id) + 11;
            history.push(`/productid=${newid}&imageid=viewnext10`);
          }}
        >
          Skip all 10 products?
        </Button>
        <br />
      </Box>
    </div>
  );
}

export default Next10;
