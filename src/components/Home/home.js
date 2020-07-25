import React from "react";
import { Image, Box, Button } from "@chakra-ui/core";
import { useState, useEffect } from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import {
  POST_IMAGE_CHECK,
  GET_NEXT_IMAGE,
  POST_CLOTH_CHECK,
} from "../api/home";
import "./index.css";
import LoadSegmentedImg from "../LoadSegmentedImg";
// import ModelOutput from "../OutputCorrector";

function Home(props) {
  const { image_data, cloth_data, person_data } = props;
  const [formFields, setFormFields] = useState({
    mapping_ok: "",
    is_cloth_ok: "",
    is_person_ok: ""
  });
  useEffect(() => {
    setFormFields({
      is_cloth_ok: image_data.is_cloth_ok || "Yes",
      is_person_ok: image_data.is_person_ok || "Yes",
      mapping_ok: image_data.mapping_ok || "Yes"
    });
  }, [image_data]);
  const [update] = useMutation(POST_IMAGE_CHECK, {
    refetchQueries: [
      {
        query: GET_NEXT_IMAGE,
        variables: {
          id: parseInt(props.props.match.params.id),
        },
      },
    ],
    onCompleted(data) {
      props.nextImage();
    },
    onError(error) {
      alert(
        `The form did not submit. Please check your Internet connection. \n For technical purpose:${error}`
      );
    },
  });

  const onInputChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if(!formFields.mapping_ok || !formFields.is_cloth_ok || !formFields.is_person_ok){
      alert("Fill all the details before submiting")
      return
    }
      await update({
        variables: {
          id: props.props.match.params.id,
          mapping_ok: formFields.mapping_ok,
          is_cloth_ok: formFields.is_cloth_ok,
          is_person_ok: formFields.is_person_ok
        },
      });
  };

  const linkChange = (link) => {
    if (link === undefined) {
      return undefined;
    } else {
      return `https://storage.googleapis.com/download/storage/v1/b/${
        link.split("/")[3]
      }/o/${link
        .substring(34 + link.split("/")[3].length)
        .replace(/[/]/g, "%2F")}?alt=media`;
    }
  };
  console.log(formFields.is_cloth_ok)

  return (
    <div>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <div>
          <h4>CLOTH IMAGE</h4>
          <Image
            src={
              cloth_data &&
              linkChange(
                cloth_data["review_mapping"][0]["map_cloth"]["image_url"]
              )
            }
            htmlHeight={512}
            htmlWidth={384}
            className="margin--10px border--1px"
          />
        </div>
        <div>
          <h4>PERSON IMAGE</h4>
          <Image
            src={
              person_data &&
              linkChange(
                person_data["review_mapping"][0]["map_person"]["image_url"]
              )
            }
            htmlHeight={512}
            htmlWidth={384}
            className="margin--10px border--1px"
            alt="No Predicted Back Image"
          />
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
          <form>
            <FormControl className="margin--10px">
              <FormLabel htmlFor="is_cloth_ok">
                Is Clothing image Ok ?
              </FormLabel>
              <Select
                name="is_cloth_ok"
                placeholder="Select option"
                value={formFields.is_cloth_ok}
                onChange={onInputChange}
                className="margin--10px"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormControl>
            <FormControl className="margin--10px">
              <FormLabel htmlFor="is_person_ok">
                Is the Person image ok ?
              </FormLabel>
              <Select
                name="is_person_ok"
                placeholder="Select option"
                value={formFields.is_person_ok}
                onChange={onInputChange}
                className="margin--10px"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormControl>
            <FormControl className="margin--10px">
              <FormLabel htmlFor="mapping_ok">
                Is the mapping of clothing and person ok ?
              </FormLabel>
              <Select
                name="mapping_ok"
                placeholder="Select option"
                value={formFields.mapping_ok}
                onChange={onInputChange}
                className="margin--10px"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormControl>
            <div style={{ display: "flex", flexDirection: "row" }} className="margin--10px">
            <Button className="margin--10px" onClick={() => props.nextImage()}>
              Next
            </Button>
            <Button
              variantColor="green"
              className="margin--10px"
              onClick={submit}
            >
              Submit
            </Button>
          </div>
          </form>
        </div>
      </Box>
      <Box style={{ display: "flex", justifyContent: "center" }}></Box>
    </div>
  );
}

export default Home;
