import React from "react";
import {
  Box,
  Heading,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
} from "native-base";
import { StripeProvider } from "@stripe/stripe-react-native";
import CheckoutScreen from "../components/CheckoutScreen";
import axios from "axios";
import { getFuelTokenCache } from "../store/auth";
import env from "../env/env";

export default function Payment({ route, navigation }) {
  const { amount, vehicleNumber } = route.params;

  const redirect = () => {
    navigation.pop();
    navigation.navigate("Home")
  }

  const handlePaymentComplete = () => {
    const fuelTokenCache = getFuelTokenCache();
    axios
      .post(env.apiUrl + `/complete_payment`, {
        tokenId: fuelTokenCache._id,
      })
      .then((response) => {
        console.log("get fuel req success");
        console.log("res fuel req", response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <StripeProvider publishableKey="pk_test_51MXchGCLZZaEdOAQjng17YfEiWZsjEMH6AXq2PPX2A12EHVcw4a5ZpIwNHDVa6nhnIlaPrptHeaeR8ETDMcBQp3b004XuyYnYy">
      <NativeBaseProvider>
        <KeyboardAvoidingView
          h={{
            base: "400px",
            lg: "auto",
          }}
          alignContent="center"
          marginTop={20}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Center flex={1} px="3">
            <Center w="100%">
              <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading
                  mt="1"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  color="coolGray.600"
                  fontWeight="medium"
                  size="xs"
                >
                  Petrol
                </Heading>
                <Heading
                  size="md"
                  fontWeight="600"
                  color="coolGray.800"
                  mb="10"
                  _dark={{
                    color: "warmGray.50",
                  }}
                >
                  Vehicle no: ABB 8787
                </Heading>
                <Heading
                  size="md"
                  fontWeight="600"
                  color="coolGray.800"
                  mb="10"
                  _dark={{
                    color: "warmGray.50",
                  }}
                >
                  Fuel Amount: {amount}
                </Heading>
                <Heading
                  size="md"
                  fontWeight="600"
                  color="coolGray.800"
                  mb="10"
                  _dark={{
                    color: "warmGray.50",
                  }}
                >
                  Price: {amount * 400}.00
                </Heading>

                <Box>
                  <CheckoutScreen
                    amount={amount * 400}
                    redirect={redirect}
                    handlePaymentComplete={handlePaymentComplete}
                  />
                </Box>
              </Box>
            </Center>
          </Center>
        </KeyboardAvoidingView>
      </NativeBaseProvider>
    </StripeProvider>
  );
}
