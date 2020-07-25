import React, { useState, useEffect } from "react";
import Home from "./home";
import {
  GET_NEXT_IMAGE,
  GET_NEXT_CLOTH_IMAGE,
  GET_NEXT_PERSON_IMAGE,
} from "../api/home";
import { useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

function App(props) {
  const [id, setId] = useState(props.match.params.id);
  const [cloth_id, setClothId] = useState();
  const [person_id, setPersonId] = useState();

  const history = useHistory();

  const { data: product_data, loading } = useQuery(GET_NEXT_IMAGE, {
    variables: {
      id: parseInt(props.match.params.id),
    },
    // skip: !validId,
    onError(error) {
      alert(
        `Please check your internet connection. \n  For technical Purpose: ${error}`
      );
    },
    onCompleted(data) {
      if (data && data["review_mapping"]) {
        setClothId(data.review_mapping[0].cloth_id);
        setPersonId(data.review_mapping[0].person_id);
      }
    },
  });

  const { data: cloth_data, loading_cloth } = useQuery(GET_NEXT_CLOTH_IMAGE, {
    variables: {
      cloth_id: cloth_id,
    },
    skip: !cloth_id,
    // skip: !validId,
    onError(error) {
      alert(
        `Please check your internet connection. \n  For technical Purpose: ${error}`
      );
    },
    onCompleted(data) {
    },
  });

  const { data: person_data, loading_person } = useQuery(
    GET_NEXT_PERSON_IMAGE,
    {
      variables: {
        person_id: person_id,
      },
      skip: !person_id,
      onError(error) {
        alert(
          `Please check your internet connection. \n  For technical Purpose: ${error}`
        );
      },
      onCompleted(data) {
      },
    }
  );

  const handleNext = () => {
    history.push(`id=${parseInt(props.match.params.id) + 1}`);
  };

  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div>
      <Home
        image_data={product_data && product_data.review_mapping[0]}
        nextImage={handleNext}
        props={props}
        cloth_data={cloth_data}
        person_data={person_data}
      />
    </div>
  );
}

export default App;
