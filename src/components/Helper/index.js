// import React, { useState } from "react";
// import { Input, FormControl, FormLabel, Button } from "@chakra-ui/core";
// // import { GET_PRODUCT_ID_HELPER } from "../api/home";
// import { useQuery } from "@apollo/react-hooks";

// function Helper(props) {
//   const [startId, setStartId] = useState();
//   const [num, setNum] = useState();
//   const [findId, setFindId] = useState(false);
//   const [lastId, setLastId] = useState();
//   const [len, setLen] = useState();

//   const { data: result, loading } = useQuery(GET_PRODUCT_ID_HELPER, {
//     skip: !findId,
//     variables: {
//       current: parseInt(startId),
//       limit: parseInt(num),
//     },
//     onCompleted(data) {
//       if (data) {
//         setLen(data["product_condition"].length);
//         setLastId(parseInt(data["product_condition"][data["product_condition"].length - 1]["product_id"]));
//         setFindId(false);
//       }
//     },
//   });

//   const onInputChange = (e) => {
//     if (e.target.name == "num") {
//       setNum(e.target.value);
//     }
//     if (e.target.name == "startId") {
//       setStartId(e.target.value);
//     }
//   };

//   const submit = () => {
//     setFindId(true);
//   };

//   return (
//     <div style={{ width: "200px", margin: "auto" }}>
//       <form>
//         <FormControl>
//           <FormLabel htmlFor="startId">Start Id</FormLabel>
//           <Input name="startId" value={startId} onChange={onInputChange} />
//         </FormControl>
//         <FormControl>
//           <FormLabel htmlFor="num">Number of products</FormLabel>
//           <Input
//             name="num"
//             placeholder="Number of Products"
//             value={num}
//             onChange={onInputChange}
//           />
//         </FormControl>
//         <Button onClick={submit}>FIND</Button>
//         {loading && <div>loading</div>}
//         {lastId && <div>The last Id is {lastId}</div>}
//         {len && <div>Number Of Products: {len}</div>}
//       </form>
//     </div>
//   );
// }

// export default Helper;
