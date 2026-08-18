


// "use client";

// import { useEffect, useState } from "react";
// import { db } from "@/firebaseConfig";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import styled from "styled-components";
// import Link from "next/link";

// // 🎨 Theme Colors
// const Primary = "#6366f1";
// const Secondary = "#a855f7";
// const Dark = "#0f172a";
// const Border = "#e5eaf2";
// const White = "#ffffff";
// const TextMuted = "#64748B";

// // 🌟 Styled Components
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
//   background: #f8fafc;
//   color: ${Dark};
//   width: 100%;
//   box-sizing: border-box;
// `;

// const HeroSection = styled.div`
//   background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
//     url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600")
//       center/cover no-repeat;
//   color: ${White};
//   padding: 60px 20px;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 15px;
// `;

// const HeroTitle = styled.h1`
//   font-size: 2.2rem;
//   font-weight: 800;
//   margin: 0;
//   max-width: 700px;
//   letter-spacing: -0.5px;
// `;

// const HeroSub = styled.p`
//   font-size: 1rem;
//   margin: 0;
//   color: #e2e8f0;
//   max-width: 500px;
// `;

// const SearchInput = styled.input`
//   width: 100%;
//   max-width: 450px;
//   padding: 12px 16px;
//   border-radius: 8px;
//   border: none;
//   font-size: 0.95rem;
//   outline: none;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//   margin-top: 10px;
// `;

// const ContentWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   padding: 20px;
//   max-width: 1200px;
//   width: 100%;
//   margin: 0 auto;
//   box-sizing: border-box;
// `;

// const ControlsBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 10px;
// `;

// const ResultsCount = styled.span`
//   font-size: 0.9rem;
//   color: ${TextMuted};
//   font-weight: 600;
// `;

// const SortSelect = styled.select`
//   padding: 8px 12px;
//   border-radius: 6px;
//   border: 1px solid ${Border};
//   background: ${White};
//   font-size: 0.9rem;
//   outline: none;
//   color: ${Dark};
//   cursor: pointer;
// `;

// const StoresGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//   gap: 15px;
// `;

// const StoreCard = styled(Link)`
//   background: ${White};
//   border-radius: 12px;
//   padding: 20px;
//   border: 1px solid ${Border};
//   box-shadow: 0 4px 12px rgba(99, 102, 241, 0.03);
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   text-decoration: none;
//   color: inherit;
//   transition: transform 0.2s ease, box-shadow 0.2s ease;

//   &:hover {
//     transform: translateY(-3px);
//     box-shadow: 0 8px 20px rgba(99, 102, 241, 0.08);
//   }
// `;

// const StoreHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
// `;

// const StoreAvatar = styled.div`
//   width: 45px;
//   height: 45px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
//   color: ${White};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 700;
//   font-size: 1.1rem;
// `;

// const StoreInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 2px;
// `;

// const StoreName = styled.h3`
//   font-size: 1.05rem;
//   font-weight: 700;
//   margin: 0;
//   color: ${Dark};
// `;

// const StoreEmail = styled.span`
//   font-size: 0.8rem;
//   color: ${TextMuted};
// `;

// const StoreMeta = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 0.85rem;
//   color: ${TextMuted};
//   border-top: 1px solid ${Border};
//   padding-top: 10px;
// `;

// const ProductBadge = styled.span`
//   background: #e0e7ff;
//   color: ${Primary};
//   padding: 4px 8px;
//   border-radius: 6px;
//   font-weight: 600;
//   font-size: 0.8rem;
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 40px;
//   font-weight: 600;
//   color: ${TextMuted};
// `;

// export default function DigitalStoresPage() {
//   const [loading, setLoading] = useState(true);
//   const [stores, setStores] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("az");

//   useEffect(() => {
//     const fetchActiveStores = async () => {
//       try {
//         setLoading(true);
//         // 1. Fetch all users
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const usersList = usersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data()
//         }));

//         // 2. Fetch all products to check who has posted at least one product
//         const productsSnapshot = await getDocs(collection(db, "products"));
//         const productsList = productsSnapshot.docs.map((doc) => doc.data());

//         // Map product counts and user metadata by userId or email
//         const activeStoresMap = {};

//         productsList.forEach((product) => {
//           const sellerKey = product.sellerUid || product.userId || product.email;
//           if (sellerKey) {
//             if (!activeStoresMap[sellerKey]) {
//               activeStoresMap[sellerKey] = 0;
//             }
//             activeStoresMap[sellerKey] += 1;
//           }
//         });

//         // 3. Filter users who have at least one product posted
//         const filteredStores = usersList
//           .map((user) => {
//             const key = user.uid || user.email || user.id;
//             // Count products matching user's uid or email
//             const productCount =
//               activeStoresMap[user.uid] ||
//               activeStoresMap[user.email] ||
//               activeStoresMap[user.id] ||
//               0;

//             return {
//               ...user,
//               productCount
//             };
//           })
//           .filter((store) => store.productCount > 0);

//         setStores(filteredStores);
//       } catch (error) {
//         console.error("Error fetching digital stores:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActiveStores();
//   }, []);

//   // Filter by search query
//   const searchedStores = stores.filter((store) => {
//     const name = (store.fullName || store.businessName || store.name || store.email || "").toLowerCase();
//     return name.includes(searchQuery.toLowerCase());
//   });

//   // Sort stores
//   const sortedStores = searchedStores.sort((a, b) => {
//     const nameA = (a.fullName || a.businessName || a.name || a.email || "").toLowerCase();
//     const nameB = (b.fullName || b.businessName || b.name || b.email || "").toLowerCase();

//     if (sortBy === "az") {
//       return nameA.localeCompare(nameB);
//     } else if (sortBy === "za") {
//       return nameB.localeCompare(nameA);
//     } else if (sortBy === "products") {
//       return b.productCount - a.productCount;
//     }
//     return 0;
//   });

//   return (
//     <Container>
//       <HeroSection>
//         <HeroTitle>Explore Creator Digital Stores 🚀</HeroTitle>
//         <HeroSub>Discover verified creators, independent publishers, and exclusive digital products.</HeroSub>
//         <SearchInput
//           type="text"
//           placeholder="Search stores by name..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </HeroSection>

//       <ContentWrapper>
//         <ControlsBar>
//           <ResultsCount>{sortedStores.length} Active Stores Found</ResultsCount>
//           <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="az">Sort by Name: A - Z</option>
//             <option value="za">Sort by Name: Z - A</option>
//             <option value="products">Most Products</option>
//           </SortSelect>
//         </ControlsBar>

//         {loading ? (
//           <LoadingState>Loading digital stores...</LoadingState>
//         ) : sortedStores.length === 0 ? (
//           <LoadingState>No active digital stores found matching your search.</LoadingState>
//         ) : (
//           <StoresGrid>
//             {sortedStores.map((store) => {
//               const displayName = store.fullName || store.businessName || store.name || "Digital Store";
//               const initials = displayName.charAt(0).toUpperCase();
//               // Extract username part from email (everything before the "@")
//               const emailUsername = store.email ? store.email.split("@")[0] : store.uid || store.id;
//               const storeRoute = `${window.location.origin}/${emailUsername}`;; // Adjust route pattern if your store profile route differs

//               return (
//                 <StoreCard key={store.id} href={storeRoute}>
//                   <StoreHeader>
//                     <StoreAvatar>{initials}</StoreAvatar>
//                     <StoreInfo>
//                       <StoreName>{displayName}</StoreName>
//                       <StoreEmail>{store.email || "Verified Creator"}</StoreEmail>
//                     </StoreInfo>
//                   </StoreHeader>
//                   <StoreMeta>
//                     <span>Digital Marketplace</span>
//                     <ProductBadge>{store.productCount} {store.productCount === 1 ? "Product" : "Products"}</ProductBadge>
//                   </StoreMeta>
//                 </StoreCard>
//               );
//             })}
//           </StoresGrid>
//         )}
//       </ContentWrapper>
//     </Container>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components";
import Link from "next/link";
import StoreFooter from "@/components/StoreFooter";

// 🎨 Theme Colors
const Primary = "#6366f1";
const Secondary = "#a855f7";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const TextMuted = "#64748B";

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
`;

const HeroSection = styled.div`
  background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
    url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600")
      center/cover no-repeat;
  color: ${White};
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const HeroTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  max-width: 700px;
  letter-spacing: -0.5px;
`;

const HeroSub = styled.p`
  font-size: 1rem;
  margin: 0;
  color: #e2e8f0;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 450px;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ResultsCount = styled.span`
  font-size: 0.9rem;
  color: ${TextMuted};
  font-weight: 600;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${Border};
  background: ${White};
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  cursor: pointer;
`;

const StoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
`;

const StoreCard = styled(Link)`
  background: ${White};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${Primary};
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.08);
  }
`;

const StoreHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StoreAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
  color: ${White};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StoreName = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: ${Dark};
`;

const StoreEmail = styled.span`
  font-size: 0.8rem;
  color: ${TextMuted};
`;

const StoreMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: ${TextMuted};
  border-top: 1px solid ${Border};
  padding-top: 10px;
`;

const ProductBadge = styled.span`
  background: #e0e7ff;
  color: ${Primary};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  font-weight: 600;
  color: ${TextMuted};
`;

export default function DigitalStoresPage() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("az");

  useEffect(() => {
    const fetchActiveStores = async () => {
      try {
        setLoading(true);

        // 1. Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // 2. Fetch all products to check who has posted at least one product
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsList = productsSnapshot.docs.map((doc) => doc.data());

        const activeStoresMap = {};
        productsList.forEach((product) => {
          const sellerKey = product.sellerUid || product.userId || product.email;
          if (sellerKey) {
            if (!activeStoresMap[sellerKey]) {
              activeStoresMap[sellerKey] = 0;
            }
            activeStoresMap[sellerKey] += 1;
          }
        });

        // 3. Fetch all subaccounts from the 'subaccounts' collection
        const subaccountsSnapshot = await getDocs(collection(db, "subaccounts"));
        const subaccountsList = subaccountsSnapshot.docs.map((doc) => doc.data());

        // Map subaccounts by sellerUid, sellerEmail, or primary_contact_email for easy lookup
        const subaccountsMap = {};
        subaccountsList.forEach((sub) => {
          if (sub.sellerUid) subaccountsMap[sub.sellerUid] = sub;
          if (sub.sellerEmail) subaccountsMap[sub.sellerEmail] = sub;
          if (sub.primary_contact_email) subaccountsMap[sub.primary_contact_email] = sub;
        });

        // 4. Filter users who:
        //    - Have posted at least one product (productCount > 0)
        //    - Have created a subaccount in the subaccounts collection
        const filteredStores = usersList
          .map((user) => {
            const productCount =
              activeStoresMap[user.uid] ||
              activeStoresMap[user.email] ||
              activeStoresMap[user.id] ||
              0;

            const subaccount =
              subaccountsMap[user.uid] ||
              subaccountsMap[user.email] ||
              subaccountsMap[user.id];

            return {
              ...user,
              productCount,
              subaccount
            };
          })
          .filter((store) => store.productCount > 0 && store.subaccount);

        setStores(filteredStores);
      } catch (error) {
        console.error("Error fetching digital stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveStores();
  }, []);

  // Filter by search query (matching store business name or user email)
  const searchedStores = stores.filter((store) => {
    const businessName = store.subaccount?.business_name || "";
    const name = (businessName || store.fullName || store.name || store.email || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // Sort stores
  const sortedStores = searchedStores.sort((a, b) => {
    const nameA = (a.subaccount?.business_name || a.fullName || a.name || a.email || "").toLowerCase();
    const nameB = (b.subaccount?.business_name || b.fullName || b.name || b.email || "").toLowerCase();

    if (sortBy === "az") {
      return nameA.localeCompare(nameB);
    } else if (sortBy === "za") {
      return nameB.localeCompare(nameA);
    } else if (sortBy === "products") {
      return b.productCount - a.productCount;
    }
    return 0;
  });

  return (
    <Container>
      <HeroSection>
        <HeroTitle>Explore Creator Digital Stores 🚀</HeroTitle>
        <HeroSub>Discover verified creators, independent publishers, and exclusive digital products.</HeroSub>
        <SearchInput
          type="text"
          placeholder="Search stores by business name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </HeroSection>

      <ContentWrapper>
        <ControlsBar>
          <ResultsCount>{sortedStores.length} Active Stores Found</ResultsCount>
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="az">Sort by Name: A - Z</option>
            <option value="za">Sort by Name: Z - A</option>
            <option value="products">Most Products</option>
          </SortSelect>
        </ControlsBar>

        {loading ? (
          <LoadingState>Loading digital stores...</LoadingState>
        ) : sortedStores.length === 0 ? (
          <LoadingState>No active digital stores found matching your search.</LoadingState>
        ) : (
          <StoresGrid>
            {sortedStores.map((store) => {
              // Use the business name field from the subaccount data as the display name
              const displayName = store.subaccount?.business_name || store.fullName || store.name || "Digital Store";
              const initials = displayName.charAt(0).toUpperCase();
              
              // Extract username part from email (everything before the "@")
              const emailUsername = store.email ? store.email.split("@")[0] : store.uid || store.id;
              const storeRoute = `/${emailUsername}`;

              return (
                <StoreCard key={store.id} href={storeRoute}>
                  <StoreHeader>
                    <StoreAvatar>{initials}</StoreAvatar>
                    <StoreInfo>
                      <StoreName>{displayName}</StoreName>
                      <StoreEmail>{store.email || "Verified Creator"}</StoreEmail>
                    </StoreInfo>
                  </StoreHeader>
                  <StoreMeta>
                    <span>Click to explore</span>
                    <ProductBadge>{store.productCount} {store.productCount === 1 ? "Product" : "Products"}</ProductBadge>
                  </StoreMeta>
                </StoreCard>
              );
            })}
          </StoresGrid>
        )}
      </ContentWrapper>
     
    </Container>
  );
}