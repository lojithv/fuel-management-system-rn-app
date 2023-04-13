import React from "react";
import {
  Box
} from "native-base";
export default function Card(props) {
  return (
    <Box
      maxW="80"
      mt="12"
      rounded="lg"
      overflow="hidden"
      padding="5"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      {props.children}
    </Box>
  );
}
