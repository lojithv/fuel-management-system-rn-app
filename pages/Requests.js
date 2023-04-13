import { View } from "react-native";
import React, { Component } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  KeyboardAvoidingView,
  Button,
  Icon,
  Center,
  NativeBaseProvider,
  WarningOutlineIcon,
} from "native-base";
import Card from "../components/Card";
import axios from "axios";

export default function Requests({ route, navigation }) {
  const { user, token, vehicle } = route.params;

  const [isApproved, setIsApproved] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(true);

  const [amount, setAmount] = React.useState(0);
  const [amountError, setAmountError] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log("req user", user);
    console.log("req token", token);
    console.log("req vehicle", vehicle);

    return () => {};
  }, []);

  const onPressPay = () => {
    console.log("pay");
    setLoading(true)
  };

  return (
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
                {vehicle.fuelType}
              </Heading>
              <Heading
                size="md"
                mb="2"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
              >
                Vehicle no: {vehicle.vehicleNumber}
              </Heading>

              <Card>
                <Center>
                  <Heading
                    size="sm"
                    mt="5"
                    fontWeight="600"
                    color="coolGray.800"
                    _dark={{
                      color: "warmGray.50",
                    }}
                  >
                    Your request is Approved!
                  </Heading>
                  <Heading
                    size="lg"
                    mt="5"
                    fontWeight="800"
                    color="coolGray.800"
                    _dark={{
                      color: "warmGray.50",
                    }}
                  >
                    10L
                  </Heading>
                  <Heading
                    size="lg"
                    mt="5"
                    fontWeight="600"
                    color="coolGray.800"
                    _dark={{
                      color: "warmGray.50",
                    }}
                  >
                    Rs. 3500.00
                  </Heading>
                  <Button
                    mt="8"
                    mb="5"
                    px="10"
                    colorScheme="secondary"
                    isLoading={loading}
                    onPress={onPressPay}
                    _spinner={{
                      color: "white",
                    }}
                  >
                    Pay Now
                  </Button>
                </Center>
              </Card>
            </Box>
          </Center>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
