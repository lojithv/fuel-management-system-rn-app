import { View } from "react-native";
import React, { Component, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  useToast,
  KeyboardAvoidingView,
  Button,
  Toast,
  Center,
  NativeBaseProvider,
  WarningOutlineIcon,
  IconButton,
} from "native-base";
import Card from "../components/Card";
import axios from "axios";
import env from "../env/env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuthData, setFuelTokenCache } from "../store/auth";

export default function Home({ navigation }) {
  const [isApproved, setIsApproved] = React.useState(false);
  const [isRequested, setIsRequested] = React.useState(false);

  const [paymentSuccess, setPaymentSuccess] = React.useState(true);
  const [vehicle, setVehicle] = React.useState({});
  const [req, setReq] = React.useState({});

  const [amount, setAmount] = React.useState(0);
  const [amountError, setAmountError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [fuelToken, setFuelToken] = useState(null);

  const [refresh, setRefresh] = useState(false);

  const [authData, setAuthData] = useState(null);

  React.useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(!refresh)
    });
    return unsubscribe;
  },[navigation])

  React.useEffect(() => {
    const cachedAuthData = getAuthData();
    if (cachedAuthData) {
      console.log(cachedAuthData);
      setAuthData(cachedAuthData);

      axios
        .get(env.apiUrl + `/get_vehicle/${cachedAuthData.user._id}`)
        .then((response) => {
          console.log("res vehicle", response.data.data);
          if (response.data.success && response.data.data.stationId) {
            console.log("get vehicle success");
            setVehicle(response.data.data);
            axios
              .get(
                env.apiUrl +`/get_fuel_token/${cachedAuthData.user._id}/${response.data.data._id}`
              )
              .then((res) => {
                console.log("res token", res.data);
                setFuelToken(res.data.data);
                setFuelTokenCache(res.data.data);
                if (res.data.data.status !== "New") {
                  axios
                    .post(env.apiUrl + `/get_latest_fuel_request`, {
                      userId: cachedAuthData.user._id,
                      vehicleId: response.data.data._id,
                    })
                    .then((response) => {
                      console.log("get fuel req success");
                      console.log("res fuel req", response.data.data);
                      setReq(response.data.data);
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    // get vehicle data
  }, [refresh]);

  const handleFuelAmount = (amount) => {
    if (parseInt(amount) > vehicle.vehicleQuota) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
    setAmount(amount);
    if (!amount) setAmountError(true);
  };

  const onPressRequest = () => {
    setLoading(true);
    let bodyData = {
      customerId: authData.user._id,
      requestedFuelAmount: +amount,
      subStationId: vehicle.stationId,
      vehicleId: vehicle._id,
    };

    console.log("body", bodyData);

    axios
      .post(env.apiUrl + "/send_fuel_request", {
        customerId: authData.user._id,
        vehicleId: vehicle._id,
        requestedFuelAmount: +amount,
        subStationId: vehicle.stationId,
      })
      .then((response) => {
        console.log("res", response.data);
        if (response.data.success) {
          console.log("success");
          setLoading(false);
          setRefresh(!refresh)
          Toast.show({
            description: "Request sent!",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);

        Toast.show({
          description: "Oops request failed!",
        });
      });
  };

  const onPressRequests = () => {
    navigation.navigate("Requests", {
      user: authData.user,
      token: token,
      vehicle: vehicle,
    });
  };

  const onPressPay = () => {
    navigation.navigate("Payment", {
      amount: req.requestedFuelAmount,
      vehicleNumber: authData.vehicleNumber,
    });
  };

  return (
    <NativeBaseProvider>
      {authData && (
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
            <IconButton
              size={"md"}
              variant="ghost"
              colorScheme="black"
              _icon={{
                as: MaterialCommunityIcons,
                name: "refresh",
              }}
              onPress={() => setRefresh(!refresh)}
            />
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
                  fontWeight="600"
                  color="coolGray.800"
                  _dark={{
                    color: "warmGray.50",
                  }}
                >
                  Vehicle no: {authData.vehicleNumber}
                </Heading>

                {}

                {fuelToken && fuelToken.status === "Paid" ? (
                  <Box>
                    <Heading
                      size="md"
                      mt="10"
                      fontWeight="600"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                    >
                      Available fuel amount: {vehicle.vehicleQuota}
                    </Heading>
                    <Heading
                      size="md"
                      mt="10"
                      fontWeight="600"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                    >
                      Requested fuel amount: {req?.requestedFuelAmount}
                    </Heading>
                    <Heading
                      size="md"
                      mt="10"
                      fontWeight="600"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                    >
                      Fuel Token: {fuelToken.token}
                    </Heading>
                  </Box>
                ) : fuelToken && (fuelToken.status === "New" ||fuelToken.status === "Issued")  ? (
                  <Box>
                    <Heading
                      size="md"
                      mt="10"
                      fontWeight="600"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                    >
                      Available fuel amount: {vehicle.vehicleQuota - (fuelToken.issuedFuelAmount ? fuelToken.issuedFuelAmount : 0)}
                    </Heading>
                    <Heading
                      mt="1"
                      mb="20"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      color="coolGray.600"
                      fontWeight="medium"
                      size="xs"
                    >
                      For this week
                    </Heading>

                    <VStack space={3} mt="25">
                      {/* <Button
                      transparent
                      dark
                      style={{ float: "right" }}
                      mb="5"
                      small
                      onPress={onPressRequests}
                    >
                      Requests
                    </Button> */}
                      <FormControl isRequired isInvalid={amountError}>
                        <FormControl.Label>Fuel amount</FormControl.Label>
                        <Input
                          type="text"
                          autoCapitalize="none"
                          placeholder="Enter using leters"
                          onChangeText={handleFuelAmount}
                        />
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          Please enter fuel amount!
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <Button
                        mt="2"
                        mb="4"
                        colorScheme="secondary"
                        isLoading={loading}
                        isDisabled={amountError}
                        onPress={onPressRequest}
                        _spinner={{
                          color: "white",
                        }}
                      >
                        Request
                      </Button>
                    </VStack>
                  </Box>
                ) : fuelToken && fuelToken.status === "Pending" && req ? (
                  <Box>
                    <Heading
                      size="md"
                      mt="10"
                      fontWeight="600"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                    >
                      Available fuel amount: {vehicle.vehicleQuota}
                    </Heading>
                    <Heading
                      mt="1"
                      mb="1"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      color="coolGray.600"
                      fontWeight="medium"
                      size="xs"
                    >
                      For this week
                    </Heading>

                    <Card style={{ color: "red" }} color="#841584">
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
                          Your request is {req?.status}!
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
                          {req?.requestedFuelAmount} L
                        </Heading>
                        <Heading
                          size="lg"
                          mt="5"
                          mb="5"
                          fontWeight="600"
                          color="coolGray.800"
                          _dark={{
                            color: "warmGray.50",
                          }}
                        >
                          Rs. {req?.requestedFuelAmount * 400}.00
                        </Heading>
                        {/* <Button
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
                    </Button> */}
                      </Center>
                    </Card>
                  </Box>
                ) : fuelToken && fuelToken.status === "Approved" && req ? (
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
                        {req?.requestedFuelAmount} L
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
                        Rs. {req?.requestedFuelAmount * 400}.00
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
                ) : null}
              </Box>
            </Center>
          </Center>
        </KeyboardAvoidingView>
      )}
    </NativeBaseProvider>
  );
}
