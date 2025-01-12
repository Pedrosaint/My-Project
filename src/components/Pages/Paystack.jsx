import React from "react";
import { PaystackButton } from "react-paystack";

const PaystackPayment = ({ email, amount, onSuccess, onClose }) => {
  const publicKey = "pk_test_cbfc280f616cb81deaf8f1b8342ead5d8fdc702e"; // Replace with your Paystack public key

  const componentProps = {
    email,
    amount: amount * 100, // Convert to kobo (e.g., NGN 100 = 10000 kobo)
    publicKey,
    text: "Pay Now",
    onSuccess: (reference) => onSuccess(reference), // Callback for successful payment
    onClose: () => onClose(), // Callback when the user closes the payment modal
    currency: "NGN", // Set currency (optional, default is NGN)
    reference: `txn_${Math.floor(Math.random() * 1000000000)}`, // Unique transaction ref
  };

  return (
    <div>
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default PaystackPayment;
