import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import Modal from "./Modal";

const BuyButton = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-center ml-8 cursor-pointer bg-primary text-white p-2 rounded-md mb-2 hover:scale-90 duration-300 ease-out"
      >
        Buy Now
      </button>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          productId={product?.id} // Pass product ID correctly
        />
      )}
    </>
  );
};

export default BuyButton;
