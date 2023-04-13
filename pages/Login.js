import React, { Component } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  WarningOutlineIcon,
  Toast,
} from "native-base";
import { Alert } from "react-native";
import axios from "axios";
import env from "../env/env";
import { setAuthData } from "../store/auth";

export default function Login({ navigation }) {
  const [vehicle, setVehicle] = React.useState("");
  const [vehicleError, setVehicleError] = React.useState(false);

  const [password1, setPassword1] = React.useState("");
  const [password1Error, setPassword1Error] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  let createAlert = () => {
    Alert.alert("Alert Title");
  };

  const handleVehicle = (vehicle) => {
    setVehicle(vehicle);
    if (!vehicle){
      setVehicleError(true);
    } else {
      setVehicleError(false);
    } 
  };

  const handlePassword1 = (password1) => {
    setPassword1(password1);
    if (!password1){
      setPassword1Error(true)
    } else {
      setPassword1Error(false)
    };
  };

  let onPressLogin = () => {
    // navigation.navigate("Home", { name: "Jane" });
    console.log(vehicle);
    console.log(password1);

    setLoading(true);

    axios
      .post(env.apiUrl + "/login-customer", {
        vehicleNumber: vehicle,
        password: password1,
      })
      .then((response) => {
        console.log("res", response.data);
        if (response.data.success) {
          navigation.navigate("Home", {
            user: response.data.user,
            token: response.data.data.token,
            vehicleNumber: vehicle,
          });
          setAuthData({
            user: response.data.user,
            token: response.data.data.token,
            vehicleNumber: vehicle,
          });
          Toast.show({
            description: "Success!",
          });
        }
        setLoading(false);

        // this.setState({
        //     loading: false,
        //     axiosData: response.data
        // })
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        console.log("error", error.message);
        Toast.show({
          description: "Signin failed!",
        });
      });
  };

  let onPressSignup = () => {
    navigation.navigate("Signup");
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
                size="lg"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
              >
                Welcome
              </Heading>
              <Heading
                mt="1"
                _dark={{
                  color: "warmGray.200",
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="xs"
              >
                Sign in to continue!
              </Heading>

              <VStack space={3} mt="5">
                <FormControl isRequired isInvalid={vehicleError}>
                  <FormControl.Label>Vehicle No</FormControl.Label>
                  <Input
                    type="text"
                    autoCapitalize="none"
                    placeholder="Enter vehicle no"
                    onChangeText={handleVehicle}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please enter vehicle number!
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={password1Error}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    mt="1"
                    placeholder="Enter password"
                    onChangeText={handlePassword1}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please enter password!
                  </FormControl.ErrorMessage>
                </FormControl>
                <Link
                  _text={{
                    fontSize: "xs",
                    fontWeight: "500",
                    color: "indigo.500",
                  }}
                  alignSelf="flex-end"
                  mt="1"
                >
                  Forget Password?
                </Link>
                <Button
                  mt="2"
                  colorScheme="secondary"
                  isLoading={loading}
                  onPress={onPressLogin}
                  isDisabled={vehicleError || password1Error}
                  _spinner={{
                    color: "white",
                  }}
                >
                  Sign in
                </Button>
                <HStack mt="6" justifyContent="center">
                  <Text
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                  >
                    I'm a new user.{" "}
                  </Text>
                  <Link
                    _text={{
                      color: "indigo.500",
                      fontWeight: "medium",
                      fontSize: "sm",
                    }}
                    onPress={onPressSignup}
                  >
                    Sign Up
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
