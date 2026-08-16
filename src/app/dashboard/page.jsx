



"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// 🎨 ECHOBYTE CONCEPT THEME COLORS (Indigo / Violet Gradient Palette & Light Theme)
const PrimaryColor = "#6366f1";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${Dark};
  width: 100%;
`;

const GreetingBanner = styled.div`
  background: ${AccentGradient};
  color: ${White};
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
`;

const Greeting = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
`;

const SubGreeting = styled.p`
  font-size: 0.95rem;
  opacity: 0.95;
  margin: 0;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${Dark};
  margin: 12px 0 0 0;
  letter-spacing: -0.01em;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const MenuCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "clickable",
})`
  background: ${White};
  border-radius: 14px;
  padding: 20px;
  border: 1px solid ${Border};
  border-left: 4px solid ${PrimaryColor};
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease;

  &:hover {
    transform: ${(props) => (props.clickable ? "translateY(-3px)" : "none")};
    border-color: ${PrimaryColor};
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
  }
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MenuTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const MenuDesc = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${TextMuted};
  line-height: 1.4;
`;

const MenuIcon = styled.span`
  font-size: 1.5rem;
`;

const ActionTextLink = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${PrimaryColor};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const DetailCard = styled.div`
  background: ${White};
  border-radius: 14px;
  padding: 20px;
  border: 1px solid ${Border};
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${Dark};
`;

const DetailValue = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${TextMuted};
  word-break: break-all;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;





const StoreLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

const StoreLinkLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${White};
  opacity: 0.9;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const StoreLinkBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 14px;
  border-radius: 10px;
  gap: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StoreLinkText = styled.a`
  font-size: 0.85rem;
  color: ${White};
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  background: ${White};
  color: ${PrimaryColor};
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${LightBg};
  }
`;



const DashboardHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // 📝 Function to handle editing the phone number
  const handleEditPhone = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const { value: newPhone } = await Swal.fire({
      title: "Edit Phone Number",
      input: "text",
      inputLabel: "Enter your new phone number",
      inputValue: userData?.phone || "",
      showCancelButton: true,
      confirmButtonColor: PrimaryColor,
      cancelButtonColor: TextMuted,
      background: White,
      color: Dark,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (newPhone) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { phone: newPhone });
        setUserData((prev) => ({ ...prev, phone: newPhone }));
        Swal.fire({
          title: "Updated!",
          text: "Your phone number has been updated.",
          icon: "success",
          confirmButtonColor: PrimaryColor,
          background: White,
          color: Dark
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update phone number.",
          icon: "error",
          confirmButtonColor: PrimaryColor,
          background: White,
          color: Dark
        });
      }
    }
  };



// 📝 Function to handle editing the full name
  const handleEditName = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const { value: newName } = await Swal.fire({
      title: "Edit Full Name",
      input: "text",
      inputLabel: "Enter your full name",
      inputValue: userData?.name || "",
      showCancelButton: true,
      confirmButtonColor: PrimaryColor,
      cancelButtonColor: TextMuted,
      background: White,
      color: Dark,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (newName) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { name: newName });
        setUserData((prev) => ({ ...prev, name: newName }));
        Swal.fire({
          title: "Updated!",
          text: "Your full name has been updated.",
          icon: "success",
          confirmButtonColor: PrimaryColor,
          background: White,
          color: Dark
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update full name.",
          icon: "error",
          confirmButtonColor: PrimaryColor,
          background: White,
          color: Dark
        });
      }
    }
  };




  useEffect(() => {
    const savedProduct = localStorage.getItem('orderCheck');
    
    // If nothing is saved, do nothing
    if (!savedProduct) return;

    try {
      const productObj = JSON.parse(savedProduct);
      // Ensure the product has an ID or slug to navigate back to its detail page
      // Adjust `productObj.id` or `productObj.slug` based on how your product identifier is stored
      const productId = productObj.id || productObj.slug; 

      Swal.fire({
        title: 'Resume Order?',
        text: 'You were about making an order. Would you like to proceed?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Proceed with Order',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#6366f1',
        cancelButtonColor: '#ef4444',
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the orderCheck so it doesn't prompt again on subsequent visits
          // localStorage.removeItem('orderCheck');
          
          // Navigate back to the product detail page using its ID/slug
          if (productId) {
            router.push(`/productdetail/${productId}`); // Update this route to match your product detail page path structure
          } else {
            Swal.fire('Error', 'Product reference not found.', 'error');
          }
        } else {
          // If canceled, clean up local storage
          localStorage.removeItem('orderCheck');
        }
      });
    } catch (error) {
      console.error("Error parsing saved product from localStorage:", error);
      localStorage.removeItem('orderCheck');
    }
  }, []);


  if (loading) {
    return (
      <LoadingContainer>
        <h2>Loading dashboard...</h2>
      </LoadingContainer>
    );
  }

  if (!userData) {
    return (
      <LoadingContainer>
        <h2>No user data found.</h2>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {/* Welcome Banner */}
  {/* Welcome Banner */}
      <GreetingBanner>
        <Greeting>
          Welcome back, {userData.role === 'admin' ? "ADMIN: " : ""}
          {userData.name || userData.email} 👋
        </Greeting>
        <SubGreeting>
          Manage your digital store orders, track web services, and explore exclusive catalog offerings.
        </SubGreeting>

        {userData.email && (() => {
          const emailPrefix = userData.email.split("@")[0];
          const storeUrl = `${window.location.origin}/${emailPrefix}`;

          return (
            <StoreLinkWrapper>
              <StoreLinkLabel>Your Store Public Link</StoreLinkLabel>
              <StoreLinkBox>
                <StoreLinkText href={storeUrl} target="_blank" rel="noopener noreferrer">
                  {storeUrl}
                </StoreLinkText>
                <ButtonGroup>
                  <ActionButton
                    onClick={() => {
                      navigator.clipboard.writeText(storeUrl);
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Store link copied!",
                        showConfirmButton: false,
                        timer: 2000,
                        background: White,
                        color: Dark,
                      });
                    }}
                  >
                    Copy
                  </ActionButton>
                  <ActionButton
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: "My Store",
                            text: "Check out my digital store!",
                            url: storeUrl,
                          });
                        } catch (error) {
                          // User cancelled share or error occurred
                        }
                      } else {
                        navigator.clipboard.writeText(storeUrl);
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "success",
                          title: "Link copied to clipboard!",
                          showConfirmButton: false,
                          timer: 2000,
                          background: White,
                          color: Dark,
                        });
                      }
                    }}
                  >
                    Share
                  </ActionButton>
                </ButtonGroup>
              </StoreLinkBox>
            </StoreLinkWrapper>
          );
        })()}
      </GreetingBanner>

      {/* ADMIN Actions / Navigation */}
      
        <>
  <SectionTitle>You can sell and buy digital products, meeting sessions, coaching sessions , communities and lots more</SectionTitle>

          <SectionTitle>Your Sell Actions</SectionTitle>
          <MenuGrid>
            

            <MenuCard clickable onClick={() => router.push("/dashboard/manage-products")}>
              <MenuContent>
                <MenuTitle>Manage Digital Products</MenuTitle>
                <MenuDesc>Create, view, update, and delete your digital products</MenuDesc>
              </MenuContent>
              <MenuIcon></MenuIcon>
            </MenuCard>

            <MenuCard clickable onClick={() => router.push("/dashboard/manage-orders")}>
              <MenuContent>
                <MenuTitle>My Customers</MenuTitle>
                <MenuDesc>View your customer and their purchases</MenuDesc>
              </MenuContent>
              <MenuIcon>🛒</MenuIcon>
            </MenuCard>

            {userData.role==='admin'&&<MenuCard clickable onClick={() => router.push("/dashboard/manage-users")}>
              <MenuContent>
                <MenuTitle>Manage Users</MenuTitle>
                <MenuDesc>View and manage customer information</MenuDesc>
              </MenuContent>
              <MenuIcon>👥</MenuIcon>
            </MenuCard>}

            {/* <MenuCard clickable onClick={() => router.push("/dashboard/promocodes")}>
              <MenuContent>
                <MenuTitle>Manage Promo Codes</MenuTitle>
                <MenuDesc>View and manage promo codes</MenuDesc>
              </MenuContent>
              <MenuIcon>💥</MenuIcon>
            </MenuCard> */}

            <MenuCard clickable onClick={() => router.push("/dashboard/analytics")}>
              <MenuContent>
                <MenuTitle>Analytics</MenuTitle>
                <MenuDesc>View store performance metrics</MenuDesc>
              </MenuContent>
              <MenuIcon>📈</MenuIcon>
            </MenuCard>

            <MenuCard clickable onClick={() => router.push("/dashboard/payout-details-management")}>
              <MenuContent>
                <MenuTitle>Store Name & Payout Details</MenuTitle>
                <MenuDesc>Manage your store name & Payout Details</MenuDesc>
              </MenuContent>
              <MenuIcon></MenuIcon>
            </MenuCard>

            {/* <MenuCard clickable onClick={() => router.push("/dashboard/hostinglist")}>
              <MenuContent>
                <MenuTitle>Manage Hosting</MenuTitle>
                <MenuDesc>View and manage hosting services</MenuDesc>
              </MenuContent>
              <MenuIcon>🌐</MenuIcon>
            </MenuCard> */}
          </MenuGrid>
        </>
    

      {/* Customer Actions / Navigation */}
      <SectionTitle>Your Buy Actions</SectionTitle>
      <MenuGrid>
        <MenuCard clickable onClick={() => router.push("/dashboard/myorders")}>
          <MenuContent>
            <MenuTitle>My Orders</MenuTitle>
            <MenuDesc>Track shipping & delivery status</MenuDesc>
          </MenuContent>
          <MenuIcon>🛍️</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/mywishlist")}>
          <MenuContent>
            <MenuTitle>My Wishlist</MenuTitle>
            <MenuDesc>View saved items & special offers</MenuDesc>
          </MenuContent>
          <MenuIcon>⭐</MenuIcon>
        </MenuCard>
      </MenuGrid>

      {/* Primary User Details */}
      <SectionTitle>Your Account Details</SectionTitle>
      <DetailsGrid>
        <DetailCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <DetailTitle>Full Name</DetailTitle>
            <ActionTextLink onClick={handleEditName}>Edit</ActionTextLink>
          </div>
          <DetailValue>{userData.name || "Not provided"}</DetailValue>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Email Address</DetailTitle>
          <DetailValue>{userData.email}</DetailValue>
        </DetailCard>

        <DetailCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <DetailTitle>Phone Number</DetailTitle>
            <ActionTextLink onClick={handleEditPhone}>Edit</ActionTextLink>
          </div>
          <DetailValue>{userData.phone || "Not provided"}</DetailValue>
        </DetailCard>
      </DetailsGrid>
    </Container>
  );
};

export default DashboardHome;