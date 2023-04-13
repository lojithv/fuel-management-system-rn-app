import React, { useState } from "react";
import {
  Box,
  Heading,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  Input,
  Text,
  Button,
} from "native-base";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function FuelAmount({ navigation }) {

  const [amount,setAmount]= useState(0)

  const handleConfirm = () => {
    navigation.navigate("Payment",{amount:amount});
  }
 
  return (
    <StripeProvider
    publishableKey="pk_test_51MXchGCLZZaEdOAQjng17YfEiWZsjEMH6AXq2PPX2A12EHVcw4a5ZpIwNHDVa6nhnIlaPrptHeaeR8ETDMcBQp3b004XuyYnYy"
  >
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
                _dark={{
                  color: "warmGray.50",
                }}
              >
                Vehicle no: ABB 8787
              </Heading>

              <Input value={amount} onChangeText={(v)=>setAmount(v)}/>

              <Text>{amount}</Text>
              <Button onPress={handleConfirm}>Confirm</Button>
            </Box>
          </Center>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
    </StripeProvider>
  );
}
