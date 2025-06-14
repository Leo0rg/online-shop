import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { orderAPI } from "../api";
import toast from "react-hot-toast";

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 2rem auto;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 95%;
  }
`;

const FormContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-family: "Soledago", sans-serif;
  font-size: 4rem;
  color: #000;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  font-family: "SF Pro Rounded", sans-serif;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  background-color: #f8f8f8;
  color: #969696;
  width: 100%;

  &::placeholder {
    color: #969696;
  }
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

const TotalPrice = styled.p`
  font-family: "SF Pro Rounded", sans-serif;
  font-size: 1.5rem;
  color: #000;
  font-weight: 500;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SubmitButton = styled.button`
  font-family: "SF Pro Rounded", sans-serif;
  font-size: 1rem;
  padding: 1rem 3rem;
  border-radius: 20px;
  border: none;
  background-color: #e0e0e0;
  color: #969696;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background-color: #d0d0d0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CartItemsContainer = styled.div`
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  padding-left: 1rem;
  padding-bottom: 1rem;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1rem;
  gap: 1rem;
  box-shadow: 0px 4px 38px -19px rgba(0, 0, 0, 0.25);
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 15px;
`;

const CartItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CartItemName = styled.p`
  font-family: "SF Pro Rounded", sans-serif;
  color: #969696;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const CartItemBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartItemQuantity = styled.p`
  font-family: "SF Pro Rounded", sans-serif;
  color: #969696;
  margin: 0;
  font-size: 1rem;
`;

const CartItemPrice = styled.p`
  font-family: "SF Pro Rounded", sans-serif;
  color: #969696;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [paymentMethod] = useState("Картой онлайн");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item.product,
    }));

    const order = {
      orderItems,
      shippingAddress: {
        address: formData.address,
        city: "Не указан",
        postalCode: "Не указан",
        country: "Россия",
      },
      paymentMethod,
      totalPrice,
      user: user ? user._id : null,
    };

    try {
      await orderAPI.createOrder(order);
      setLoading(false);
      clearCart();
      toast.success("Заказ успешно оформлен!");
      navigate("/order-success");
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Ошибка при оформлении заказа");
    }
  };

  return (
    <CheckoutContainer>
      <FormContainer>
        <Title>ОФОРМЛЕНИЕ ЗАКАЗА</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="fullName"
            placeholder="ФИО"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <Input
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <Input
            name="address"
            placeholder="Адрес"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <Summary>
            <TotalPrice>Итоговая стоимость: {totalPrice} ₽</TotalPrice>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "ОБРАБОТКА..." : "ОПЛАТИТЬ"}
            </SubmitButton>
          </Summary>
        </Form>
      </FormContainer>
      <CartItemsContainer>
        {cartItems.map((item) => {
          const imageUrl =
            item.image && item.image.startsWith("/uploads")
              ? `${apiUrl}${item.image}`
              : item.image;
          return (
            <CartItem key={item.product}>
              <CartItemImage src={imageUrl} alt={item.name} />
              <CartItemInfo>
                <CartItemName>{item.name}</CartItemName>
                <CartItemBottomRow>
                  <CartItemQuantity>{item.quantity} шт.</CartItemQuantity>
                  <CartItemPrice>Цена: {item.price} ₽</CartItemPrice>
                </CartItemBottomRow>
              </CartItemInfo>
            </CartItem>
          );
        })}
      </CartItemsContainer>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
