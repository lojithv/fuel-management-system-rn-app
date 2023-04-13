import { useStripe } from "@stripe/stripe-react-native";
import { Button, NativeBaseProvider, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Screen } from "react-native-screens";
import env from "../env/env";

export default function CheckoutScreen({amount,redirect, handlePaymentComplete}) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const apiUrl = env.apiUrl;

  const fetchPaymentSheetParams = async () => {
    console.log(apiUrl)
    const response = await fetch(
      `${apiUrl}/payment-sheet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({amount: amount})
      }
    );

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();
    console.log(paymentIntent, ephemeralKey, customer);

    console.log("init payment sheet");
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log("open payment sheet");
    const { error } = await presentPaymentSheet();
    console.log(error);

    if (error) {
      //   Alert.alert(`Error code: ${error.code}`, error.message);
      console.log(error);
    } else {
      console.log("open payment successfully");
      Alert.alert("Success", "Your order is confirmed!");
      handlePaymentComplete()
      redirect()
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Screen>
      <Button disabled={!loading} onPress={openPaymentSheet}>
        Checkout
      </Button>
    </Screen>
  );
}
