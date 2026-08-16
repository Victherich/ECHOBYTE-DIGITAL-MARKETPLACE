






"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// 🎨 ECHOBYTE DIGITAL STORE THEME COLORS (Indigo/Purple Vibrant Tech Gradient)
const Primary = "#6366f1";
const Secondary = "#a855f7";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const TextMuted = "#64748B";
const Danger = "#ef4444";
const Success = "#10b981";
const Warning = "#f59e0b";

// 🌟 Styled Components (Strict max 10px spacing/gaps/margins/padding rule)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${Dark};
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
  color: ${White};
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.08);
`;

const ColorfulTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const ColorfulSub = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: #f8fafc;
  opacity: 0.95;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  background: ${White};

  &:focus {
    border-color: ${Primary};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 10px;
`;

const OrderCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${Primary};
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OrderIdText = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const OrderCustomer = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${TextMuted};
  font-weight: 600;
`;

const OrderEmail = styled.span`
  font-size: 0.75rem;
  color: ${TextMuted};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Badge = styled.span`
  background: ${(props) => 
    props.$variant === "danger" ? "rgba(239, 68, 68, 0.1)" : 
    props.$variant === "success" ? "rgba(16, 185, 129, 0.1)" : 
    props.$variant === "warning" ? "rgba(245, 158, 11, 0.1)" : 
    "rgba(99, 102, 241, 0.1)"
  };
  color: ${(props) => 
    props.$variant === "danger" ? Danger : 
    props.$variant === "success" ? Success : 
    props.$variant === "warning" ? Warning : 
    Primary
  };
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const OrderDetailsBox = styled.div`
  background: #f8fafc;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: ${TextMuted};
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

const MoreDetailsButton = styled.button`
  margin-top: 5px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${White};
  background: ${Primary};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }
`;

export default function CustomerOrdersPage({ customerEmail }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      
      let q = collection(db, "orders");
      if (customerEmail) {
        q = query(collection(db, "orders"), where("accountInfo.email", "==", customerEmail));
      }

      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(list);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      Swal.fire("Error", "Failed to fetch your orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [customerEmail]);



  const filteredOrders = orders.filter((o) => {
    const queryText = searchQuery.toLowerCase();
    const orderNoMatch = o.orderNumber?.toLowerCase().includes(queryText) || false;
    const docIdMatch = o.id?.toLowerCase().includes(queryText) || false;
    const productNameMatch = o.product?.name?.toLowerCase().includes(queryText) || false;
    return orderNoMatch || docIdMatch || productNameMatch;
  });



  if (loading) {
    return <LoadingContainer>Loading your orders...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>My Orders</ColorfulTitle>
        <ColorfulSub>View your purchases</ColorfulSub>
      </HeaderBanner>

      <SearchContainer>
        <StyledInput 
          type="text" 
          placeholder="Search by order number or product name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </SearchContainer>

      <ActionRow>
        <ColorfulSectionTitle>Order History ({filteredOrders.length})</ColorfulSectionTitle>
      </ActionRow>

      {filteredOrders.length === 0 ? (
        <LoadingContainer>No matching orders found.</LoadingContainer>
      ) : (
        <OrdersGrid>
          {filteredOrders.map((order) => {
            const currentOrderStatus = order.orderStatus || "Pending";
            const currentPaymentStatus = order.paymentStatus || "Pending";
            const customerName = order.accountInfo?.name || "Valued Customer";
            const email = order.accountInfo?.email || "No Email Provided";
            const currency = order.currency || "NGN";
            const amount = order.product?.amount ||0;
            const productName = order.product?.name||0;
            const productUrl = order.product?.productUrl||"";
            return (
              <OrderCard key={order.id}>
                <CardHeader>
                  <OrderInfo>
                    <OrderIdText>{productName}</OrderIdText>
                    
                  </OrderInfo>
                  <BadgeContainer>
                    <Badge $variant={
                      currentOrderStatus.toLowerCase() === "delivered" ? "success" : 
                      currentOrderStatus.toLowerCase() === "cancelled" ? "danger" : "warning"
                    }>
                      {currentOrderStatus.toUpperCase()}
                    </Badge>
                    <Badge $variant={
                      currentPaymentStatus.toLowerCase() === "paid" ? "success" : 
                      currentPaymentStatus.toLowerCase() === "failed" ? "danger" : "warning"
                    }>
                      {currentPaymentStatus.toUpperCase()}
                    </Badge>
                  </BadgeContainer>
                </CardHeader>

                <OrderDetailsBox>
                  <span>Amount: <strong>{currency} {amount}</strong></span>
                  
                
                  <span>Order Number: {order.orderNumber|| `Order #${order.id.slice(0, 8)}` }</span>
                  <span>Customer Name: {customerName}</span>
                  <span>Email: {email}</span>
                </OrderDetailsBox>

             <MoreDetailsButton onClick={() => window.open(productUrl, '_blank')}>
  Access your Order
</MoreDetailsButton>
              </OrderCard>
            );
          })}
        </OrdersGrid>
      )}
    </Container>
  );
}