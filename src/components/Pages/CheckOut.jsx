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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import default styles
import { toast } from "react-toastify";

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
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (value) => {
    setPhone(value); // value includes country code and phone number
  };

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
    publicKey: "pk_test_419b147cfa4881543dfc8c3d559f0f60f8fdd15a",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddShippingAddress = async () => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, "shippingAddresses"), {
        userId: currentUser.uid,
        ...shippingAddress,
      });
      toast.success("Shipping address saved successfully!");
      setShowShippingForm(false);
    } catch (err) {
      console.error("Error saving shipping address:", err);
      toast.error("Failed to save shipping address.");
    } finally {
      setIsSaving(false);
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            {/* <button
              disabled={savedAddresses.length === 0}
              className={`${
                savedAddresses.length > 0
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white font-bold py-2 px-4 rounded mt-4`}
            >
              <PaystackButton {...paystackConfig} />
            </button> */}

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
            <h2 className="text-xl font-bold mb-2">Select Shipping Address</h2>
            {savedAddresses.length > 0 ? (
              <ul className="mb-4">
                {savedAddresses.map((address) => (
                  <li
                    key={address.id}
                    className={`mb-4 p-3 rounded-md hover:shadow-xl transition-all cursor-pointer border-2 dark:border-gray-800 ${
                      selectedAddressId === address.id
                        ? "border-blue-500 bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <p className="font-bold">{address.fullName}</p>
                    <p>{address.phoneNumber}</p>
                    <p>{`${address.address}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}</p>
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
                  {[
                    "fullName",
                    "address",
                    "city",
                    "state",
                    "zipCode",
                    "country",
                  ].map((field) => (
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
                        className="mt-1 p-1 border outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md w-full"
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 capitalize dark:text-white"
                    >
                      Phone Number
                    </label>
                    <div className="flex mt-1 dark:text-black dark:bg-gray-900">
                      <PhoneInput
                        country={"ng"} // Default to Nigeria
                        value={phone}
                        onChange={handlePhoneChange}
                        inputStyle={{
                          width: "100%",
                          borderRadius: "0.375rem",
                          padding: "",
                          border: "1px solid #ccc",
                        }}
                        dropdownStyle={{
                          borderRadius: "0.375rem",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddShippingAddress}
                    disabled={isSaving}
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative flex justify-between items-center ${
                      isSaving ? "opacity-50 cursor-wait" : ""
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
