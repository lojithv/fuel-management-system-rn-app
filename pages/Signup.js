import React, { Component } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Toast,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  Select,
  CheckIcon,
  WarningOutlineIcon,
  ScrollView,
  View,
} from "native-base";

import axios from "axios";
import env from "../env/env";

export default function Signup({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);

  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState(false);

  const [vehicle, setVehicle] = React.useState("");
  const [vehicleError, setVehicleError] = React.useState(false);

  const [fuelType, setFuelType] = React.useState("");
  const [fuelTypeError, setFuelTypeError] = React.useState(false);

  const [vehicleType, setVehicleType] = React.useState("");
  const [vehicleTypeError, setVehicleTypeError] = React.useState(false);

  const [stationId, setStationId] = React.useState("");
  const [stationError, setStationError] = React.useState(false);

  const [password1, setPassword1] = React.useState("");
  const [password1Error, setPassword1Error] = React.useState(false);

  const [password2, setPassword2] = React.useState("");
  const [password2Error, setPassword2Error] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [quota, setQuota] = React.useState(0);

  const [substations, setSubStations] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(env.apiUrl + "/get_sub_stations")
      .then((response) => {
        console.log("res", response.data.data);
        let arr = [];
        if (response.data.data) {
          response.data.data.forEach((substation) => {
            arr.push({ id: substation._id, name: substation.stationName });
          });
        }
        setSubStations(arr);
      })
      .catch((error) => {
        console.log("error", error.message);
      });
  }, []);

  const handleUsername = (username) => {
    setUsername(username);
    if (!username){
      setUsernameError(true);
    } else {
      setUsernameError(false);
    } 
  };

  const handleEmail = (email) => {
    setEmail(email);
    if (!email) {
      setEmailError(true);
    } else{
      setEmailError(false);
    }
  };

  const handlePhone = (phone) => {
    setPhone(phone);
    if (!phone) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    } 
  };

  const handleVehicle = (vehicle) => {
    setVehicle(vehicle);
    if (!vehicle) {
      setVehicleError(true);
    } else {
      setVehicleError(false);
    } 
  };

  const handleFuelType = (fuelType) => {
    setFuelType(fuelType);
    if (!fuelType){
      setFuelTypeError(true);
    }else {
      setFuelTypeError(false);
    } 
  };

  const handleVehicleType = (vehicleType) => {
    setVehicleType(vehicleType);
    if (!vehicleType){
      setVehicleTypeError(true);
    } else{
      setVehicleTypeError(false);
    } 

    switch (vehicleType) {
      case "Bike":
        setQuota(4);
        break;

      case "Three_wheel":
        setQuota(5);
        break;

      case "Car":
        setQuota(20);
        break;

      case "Van":
        setQuota(30);
        break;

      case "Bus":
        setQuota(100);
        break;
    }
  };

  const handleStation = (id) => {
    console.log(id);
    setStationId(id);
    if (!id) {
      setStationError(true);
    } else {
      setStationError(false);
    } 
  };

  const handlePassword1 = (password1) => {
    setPassword1(password1);
    if (!password1) {
      setPassword1Error(true);
    } else {
      setPassword1Error(false);
    } 
  };

  const handlePassword2 = (password2) => {
    setPassword2(password2);
    if (!password2) {
      setPassword2Error(true);
    } else {
      setPassword2Error(false);
    } 
  };

  let onPressSignup = () => {
    // navigation.navigate("Home", { name: "Jane" });
    setLoading(true);

    console.log(username);
    console.log(email);
    console.log(phone);
    console.log(vehicleType);
    console.log(vehicle);
    console.log(fuelType);
    console.log(password1);
    console.log(quota);

    console.log("quota", quota);
    axios
      .post(env.apiUrl + "/signup-customer", {
        userData: {
          username: username,
          phone: phone,
          email: email,
          password: password1,
          userType: "Customer",
        },
        vehicleDetails: {
          vehicleType: vehicleType,
          stationId: stationId,
          vehicleNumber: vehicle,
          fuelType: fuelType,
          vehicleQuota: quota,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log("res", response.data);
        navigation.navigate("Signin");
        console.log("res", response.message);

        Toast.show({
          description: "Success!",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error.message);

        Toast.show({
          description: "Signup failed!",
        });
      });
  };
  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        h={{
          base: "300px",
          lg: "auto",
        }}
        alignContent="center"
        marginTop={20}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Center flex={1} px="3">
          <Center w="100%">
            <Box safeArea p="2" w="95%" maxW="310" py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontWeight="semibold"
              >
                Welcome
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="medium"
                size="xs"
              >
                Sign up to continue!
              </Heading>

              <VStack space={3} mt="8">
                <ScrollView h="100%">
                  <FormControl isRequired isInvalid={usernameError}>
                    <FormControl.Label>Username</FormControl.Label>
                    <Input
                      mt="1"
                      placeholder="Enter username"
                      onChangeText={handleUsername}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please enter a username!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={emailError}>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                      mt="1"
                      type="email"
                      autoCapitalize="none"
                      placeholder="Enter email"
                      onChangeText={handleEmail}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please enter email!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={phoneError}>
                    <FormControl.Label>Phone</FormControl.Label>
                    <Input
                      mt="1"
                      placeholder="Enter phone"
                      onChangeText={handlePhone}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please enter phone!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={vehicleError}>
                    <FormControl.Label>Vehicle number</FormControl.Label>
                    <Input
                      mt="1"
                      placeholder="Enter vehicle no"
                      onChangeText={handleVehicle}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please enter vehicle number!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl maxW="300" isRequired isInvalid={fuelTypeError}>
                    <FormControl.Label>Choose fuel type</FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Choose fuel Type"
                      placeholder="Fuel type"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={3} />,
                      }}
                      mt="1"
                      onValueChange={handleFuelType}
                    >
                      <Select.Item label="Petrol" value="Petrol" />
                      <Select.Item label="Diesel" value="Diesel" />
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please select fuel type!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    maxW="300"
                    isRequired
                    isInvalid={vehicleTypeError}
                  >
                    <FormControl.Label>Choose vehicle type</FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Choose vehicle Type"
                      placeholder="Vehicle type"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={3} />,
                      }}
                      mt="1"
                      onValueChange={handleVehicleType}
                    >
                      <Select.Item label="Bike" value="Bike" />
                      <Select.Item label="Three wheel" value="Three_wheel" />
                      <Select.Item label="Car" value="Car" />
                      <Select.Item label="Van" value="Van" />
                      <Select.Item label="Bus" value="Bus" />
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please select vehicle type!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl maxW="300" isRequired isInvalid={stationError}>
                    <FormControl.Label>
                      Choose hometown station
                    </FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Choose hometown station"
                      placeholder="Station"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={3} />,
                      }}
                      mt="1"
                      onValueChange={handleStation}
                    >
                      {substations.map((station) => {
                        return (
                          <Select.Item
                            key={station.id}
                            label={station.name}
                            value={station.id}
                          />
                        );
                      })}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please select hometown station!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={password1Error}>
                    <FormControl.Label isRequired>Password</FormControl.Label>
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
                  <FormControl isRequired isInvalid={password2Error}>
                    <FormControl.Label isRequired>
                      Confirm Password
                    </FormControl.Label>
                    <Input
                      type="password"
                      mt="1"
                      placeholder="Re-enter password"
                      onChangeText={handlePassword2}
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Please enter password again!
                    </FormControl.ErrorMessage>
                  </FormControl>
                </ScrollView>

                <Button
                  mt="2"
                  mb="4"
                  colorScheme="secondary"
                  isLoading={loading}
                  onPress={onPressSignup}
                  _spinner={{
                    color: "white",
                  }}
                >
                  Sign up
                </Button>
              </VStack>
            </Box>
          </Center>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
