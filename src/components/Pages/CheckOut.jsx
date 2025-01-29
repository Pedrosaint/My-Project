import React, { useState, useEffect, useContext } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../Firebase/Firebase";
import Navbar from "../common/Navbar";
import Footer from "../HomeProducts/Footer";
import { PaystackButton } from "react-paystack";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import CountrySelector from "../common/CountrySelector";
import PhoneNumberInput from "../common/PhoneInput";

const CheckoutPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState("");

  // const handlePhoneChange = (value) => {
    // setPhone(value); // Update phone in state
  // };

  const calculateTotal = () => {
    const total = cartItems
      .reduce((total, item) => {
        const itemTotal = item.size.includes("yards")
          ? parseFloat(
              item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
            ) * parseFloat(item.size)
          : parseFloat(
              item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
            ) * item.quantity;
        return total + itemTotal;
      }, 0)
      .toFixed(2); // Ensure 2 decimal places

    return parseFloat(total); // Return as number
  };

  const totalAmount = (calculateTotal() * 100).toFixed(2); // Keeps two decimal places
  const formattedTotalAmount = `₦${(Number(totalAmount) / 100).toLocaleString(
    undefined,
    { minimumFractionDigits: 2 }
  )}`;

  const email = currentUser?.email || "example@example.com";

  const handlePaymentSuccess = async (reference) => {
    try {
      console.log("Payment successful. Reference:", reference);

      if (!currentUser?.uid) {
        throw new Error("User is not authenticated.");
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty. Cannot save order.");
      }

      const transactionData = {
        userId: currentUser.uid,
        reference: reference?.reference || "",
        amount: `₦${totalAmount.toLocaleString()}`,
        currency: reference?.currency || "NGN",
        status: reference?.status || "success",
        date: new Date().toISOString(),
        cartItems,
        shippingAddress,
      };

      const transactionRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );
      console.log("Transaction saved with ID:", transactionRef.id);

      const orderData = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        cartItems,
        date: new Date().toISOString(),
        totalAmount: formattedTotalAmount,
        status: "Pending",
        shippingAddress,
      };
      console.log("Order data to be saved:", orderData);


      const orderRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order saved with ID:", orderRef.id);

      await setDoc(doc(db, "carts", currentUser.uid), { cart: [] });
      setCartItems([]);

      toast.success(
        "Payment successful! Transaction and order details have been saved."
      );
    } catch (error) {
      console.error("Error saving transaction or order:", error.message);
      toast.error(
        `Payment successful, but failed to save details. Error: ${error.message}`
      );
    }
  };

  const handlePaymentClose = () => {
    console.log("Payment closed by user.");
    toast.error("Payment not completed.");
  };

  const paystackConfig = {
    email,
    amount: totalAmount,
    publicKey: import.meta.env.VITE_PAYSTACK_KEY,
    metadata: { cartItems, shippingAddress },
    text: "Pay Now",
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;
      try {
        const cartDocRef = doc(db, "carts", currentUser.uid);
        const docSnap = await getDoc(cartDocRef);
        if (docSnap.exists()) {
          const userCart = docSnap.data();
          setCartItems(userCart.cart || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to fetch cart items.");
      }
    };

    fetchCart();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const addressesRef = collection(db, "shippingAddresses");
    const unsubscribe = onSnapshot(addressesRef, (snapshot) => {
      const addresses = snapshot.docs
        .filter((doc) => doc.data().userId === currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setSavedAddresses(addresses);
    });
    return () => unsubscribe();
  }, [currentUser]);

  //---------------- Handle Input Change ------------------->
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone number change
  const handlePhoneChange = (value) => {
    setPhone(value);
    setShippingAddress((prev) => ({
      ...prev,
      phone: value, // Save phone number in shippingAddress
    }));
  };

  // Handle country selection change
  const handleCountryChange = (value) => {
    setShippingAddress((prev) => ({
      ...prev,
      country: value, // Save country in shippingAddress
    }));
  };

  const handleAddShippingAddress = async () => {
    setIsSaving(true);
    // Check if all required fields are filled
    const requiredFields = ["fullName", "address", "city", "state"];
    const isFormComplete = requiredFields.every(
      (field) => shippingAddress[field] && shippingAddress[field].trim() !== ""
    );

    if (!isFormComplete) {
      toast.error("Please complete all fields before saving the address.");
      setIsSaving(false);
      return;
    }

    try {
      // Save address to Firestore
      await addDoc(collection(db, "shippingAddresses"), {
        userId: currentUser.uid,
        ...shippingAddress,
        createdAt: new Date(), // Optional: Add a timestamp
      });
      setShippingAddress({});
      setShowShippingForm(false);
      toast.success("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address to Firestore:", error);
      toast.error("Failed to save the address. Please try again.");
    } finally {
      setIsSaving(false);
    }
    window.scrollTo(0, 0);
  };

  //--------------------- Handle Remove Address ----------------------->
  const handleRemoveAddress = async (addressId) => {
    try {
      const docRef = doc(db, "shippingAddresses", addressId);
      await deleteDoc(docRef);
      toast.success("Shipping address removed successfully!");
      setSavedAddresses((prev) =>
        prev.filter((address) => address.id !== addressId)
      );
    } catch (err) {
      console.error("Error removing address:", err);
      toast.error("Failed to remove address.");
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setShippingAddress(address);
  };

  if (loading) return;
  <div className="flex flex-col items-center justify-center h-screen">
    <ClipLoader color="#36d7b7" size={50} />
  </div>;
  if (error) return <div>{error}</div>;

  //---------------------- If the Form is complete -------------------------------->
  const isFormComplete =
    shippingAddress.fullName &&
    shippingAddress.address &&
    shippingAddress.city &&
    shippingAddress.state;
  // shippingAddress.phoneNumber &&
  // shippingAddress.country;

  return (
    <>
      <Navbar />
      <div className="p-4 pt-28 dark:bg-gray-950 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 lg:mr-4 border dark:border-gray-800 p-4 rounded-sm mb-4 lg:mb-0">
            <h2 className="text-xl font-bold mb-2">Review Cart</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-4 border-b pb-4 mb-4"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p>Color: {item.color || "N/A"}</p>
                      <p>
                        {item.category === "Fabrics"
                          ? `Size (Yards): ${item.size || "N/A"}`
                          : `Size: ${item.size || "N/A"}`}
                      </p>
                      {!item.size.includes("yards") && (
                        <p>Quantity: {item.quantity || 1}</p>
                      )}
                    </div>
                    <p className="font-semibold text-right">
                      Price: {item.price}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 border dark:border-gray-900 p-3">
              <p>Subtotal: ₦{calculateTotal().toLocaleString()}</p>
              <p className="font-bold">
                Total: ₦{calculateTotal().toLocaleString()}
              </p>
            </div>

            <button
              disabled={savedAddresses.length === 0}
              style={{
                pointerEvents: savedAddresses.length === 0 ? "none" : "auto",
                opacity: savedAddresses.length === 0 ? 0.5 : 1,
              }}
              className={`${
                savedAddresses.length > 0
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              } text-white font-bold py-2 px-4 rounded mt-4`}
            >
              {savedAddresses.length > 0 ? (
                <PaystackButton {...paystackConfig} />
              ) : (
                "Pay Now"
              )}
            </button>
          </div>

          <div className="lg:w-1/3 border dark:border-gray-800 p-4 rounded-sm">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Click on the box to Activate it.
            </h2>
            {savedAddresses.length > 0 ? (
              <ul className="mb-4">
                {savedAddresses.map((address) => (
                  <li
                    key={address.id}
                    className={`mb-4 p-3 rounded-md hover:shadow-xl transition-all cursor-pointer border-2 dark:border-gray-800 ${
                      selectedAddressId === address.id
                        ? "border-green-500 dark:border-green-500"
                        : ""
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <p className="font-bold">{address.fullName}</p>
                    <p>{address.phoneNumber}</p>
                    <p>{`${address.address}, ${address.city}, ${address.state}, ${address.zipCode}`}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAddress(address.id);
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mt-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved addresses found. Please add a new address.</p>
            )}
            <button
              onClick={() => setShowShippingForm(!showShippingForm)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showShippingForm ? "Close Shipping Form" : "Add Address"}
            </button>
            {showShippingForm && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <form>
                  {["fullName", "address", "city", "state", "zipCode"].map(
                    (field) => (
                      <div className="mb-4" key={field}>
                        <label
                          htmlFor={field}
                          className="block text-sm font-medium text-gray-700 capitalize dark:text-white"
                        >
                          {field.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          type="text"
                          id={field}
                          name={field}
                          value={shippingAddress[field] || ""}
                          onChange={handleInputChange}
                          className={`mt-1 p-1 border outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md w-full indent-2 ${
                            !shippingAddress[field] ? "border-red-500" : ""
                          }`}
                          required
                        />
                        {!shippingAddress[field] && (
                          <p className="text-red-500 text-sm">
                            This field is required.
                          </p>
                        )}
                      </div>
                    )
                  )}
                  <CountrySelector
                    value={shippingAddress.country}
                    onChange={handleCountryChange}
                  />
                  <div className="mb-4">
                    <PhoneNumberInput
                      value={shippingAddress.phone}
                      phone={phone}
                      handlePhoneChange={handlePhoneChange}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddShippingAddress}
                    disabled={!isFormComplete || isSaving} // Disable button if form is incomplete or saving
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative flex justify-between items-center ${
                      !isFormComplete || isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <span className="text-sm">Saving...</span>
                        <span className="animate-spin w-5 h-5 border-4 border-t-transparent ml-2 border-blue-800 rounded-full"></span>
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
