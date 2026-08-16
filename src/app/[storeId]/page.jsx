'use client';

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

/* ================= ECHOBYTE THEME COLORS ================= */
const PrimaryColor = "#6366f1";
const PrimaryDark = "#4f46e5";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";
const BlueGradient = "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 50%, #0F172A 100%)";

/* ================= STYLED COMPONENTS ================= */

const PageContainer = styled.div`
  font-family: inherit;
  color: ${Dark};
  background: ${White};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

/* --- Store Hero Banner --- */
const StoreHero = styled.section`
  position: relative;
  height: 45vh;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${Dark};
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.7);
    z-index: 1;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const StoreBadge = styled.span`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${Gold};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  color: ${White};
  letter-spacing: -0.5px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  span {
    background: linear-gradient(135deg, #a855f7 0%, ${Gold} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  color: ${Border};
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 2px solid rgba(212, 175, 55, 0.5);
  background: ${White};
  color: ${Dark};
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;

  &::placeholder {
    color: ${TextMuted};
  }

  &:focus {
    border-color: ${PrimaryColor};
    box-shadow: 0 10px 35px rgba(99, 102, 241, 0.25);
  }
`;

/* --- Main Layout Container (Full Width / No Sidebar) --- */
const StoreLayout = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
`;

/* --- Products Section --- */
const ProductsWrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StoreControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${LightBg};
  border: 1px solid ${Border};
  border-radius: 12px;
  padding: 14px 20px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const ResultsCount = styled.p`
  font-size: 0.95rem;
  color: ${TextMuted};
  font-weight: 600;
  margin: 0;

  span {
    color: ${Dark};
    font-weight: 700;
  }
`;

const SortSelect = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${Border};
  background: ${White};
  color: ${Dark};
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ProductCard = styled.div`
  background: ${White};
  border-radius: 14px;
  padding: 12px;
  border: 1px solid ${Border};
  border-left: 4px solid ${PrimaryColor};
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-3px);
    border-color: ${PrimaryColor};
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.12);
  }

  @media (max-width: 768px) {
    padding: 8px;
    gap: 8px;
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;

  @media (max-width: 768px) {
    height: 130px;
  }
`;

const CardLoveIcon = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${Border};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${White};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 130px;
  }
`;

const ProductTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${Dark};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }
`;

const PriceText = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: ${Dark};
`;

const AddButton = styled.button`
  background: ${AccentGradient};
  color: ${White};
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 1rem;
  color: ${TextMuted};
  grid-column: 1 / -1;
  font-weight: 500;
`;

/* ================= COMPONENT ================= */

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  
  // Extract store owner identifier from URL path segment (e.g. /victherich -> "victherich")
  // In Next.js App Router dynamic route folder like [storeId], params.storeId holds the value.
  const storeIdentifier = params?.storeId || params?.id || "";

  const [products, setProducts] = useState([]);
  const [storeOwner, setStoreOwner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // 1. Fetch Store Owner and their specific products
// 1. Fetch Store Owner and their specific products
  useEffect(() => {
    async function fetchStoreAndProducts() {
      try {
        setLoading(true);
        let targetUserId = "";
        let targetUserEmail = "";
        let ownerName = "";

        // If a store identifier is present in the URL (e.g. /victherich)
        if (storeIdentifier) {
          const usersSnapshot = await getDocs(collection(db, "users"));
          const matchedUserDoc = usersSnapshot.docs.find(docSnap => {
            const data = docSnap.data();
            const emailPrefix = data.email ? data.email.split("@")[0].toLowerCase() : "";
            const nameSlug = data.name ? data.name.replace(/\s+/g, "").toLowerCase() : "";
            const docId = docSnap.id.toLowerCase();
            const userUid = data.uid ? data.uid.toLowerCase() : "";

            return (
              emailPrefix === storeIdentifier.toLowerCase() || 
              nameSlug.includes(storeIdentifier.toLowerCase()) || 
              docId === storeIdentifier.toLowerCase() ||
              userUid === storeIdentifier.toLowerCase()
            );
          });

          if (matchedUserDoc) {
            targetUserId = matchedUserDoc.id;
            const userData = matchedUserDoc.data();
            targetUserEmail = userData.email || "";
            ownerName = userData.name || userData.email.split("@")[0];
            setStoreOwner({ id: targetUserId, ...userData, displayName: ownerName });
          } else {
            ownerName = storeIdentifier.charAt(0).toUpperCase() + storeIdentifier.slice(1);
            setStoreOwner({ displayName: ownerName });
          }
        }

        // Fetch all products or query by userId / email if your product creation includes them
        const productsSnapshot = await getDocs(collection(db, "products"));
        
        const fetchedProducts = productsSnapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId || "",
              email: data.email || "",
              name: data.name || "Untitled Product",
              amount: Number(data.amount) || 0,
              images: data.images || [],
              image: data.image || "",
              createdAt: data.createdAt,
            };
          })
          .filter((product) => {
            // If no store identifier, show all products
            if (!storeIdentifier) return true;

            // Match if product has userId matching the user's doc ID or uid, 
            // OR if you want to display all products created while logged in (or filter by email if stored)
            const matchesUserId = targetUserId && (product.userId === targetUserId || product.userId === storeOwner?.uid);
            
            // Temporary fallback: If products in your DB don't have userId yet, 
            // you can display products or attach them. For now, let's match userId or fallback to showing products if none have userId yet.
            if (!product.userId) {
              // If your product creation script didn't save userId, you can link it here or update your product creation form.
              return true; // Displays the product until you update product creation to include userId
            }

            return matchesUserId;
          });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching store products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreAndProducts();
  }, [storeIdentifier]);


  // 2. Filter products by search query
  const filteredProducts = products.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 3. Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.amount - b.amount;
    if (sortBy === "price-high") return b.amount - a.amount;
    if (sortBy === "title") return a.name.localeCompare(b.name);
    return 0; // featured/default
  });

  // 4. Listen to authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // 5. Fetch user's wishlist IDs
  useEffect(() => {
    async function fetchUserWishlist() {
      if (!currentUser) {
        setWishlistIds([]);
        return;
      }
      try {
        const q = query(collection(db, "wishlists"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map(docSnap => docSnap.data().productId);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Error fetching wishlist IDs:", error);
      }
    }
    fetchUserWishlist();
  }, [currentUser]);

  // 6. Toggle wishlist handler
  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!currentUser) {
      Swal.fire({ text: "Please log in to manage your wishlist.", icon: "warning", timer: 2500, showConfirmButton: false });
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const wishlistDocId = `${currentUser.uid}_${productId}`;
    const wishlistRef = doc(db, "wishlists", wishlistDocId);

    if (isCurrentlyWishlisted) {
      setWishlistIds(wishlistIds.filter(id => id !== productId));
    } else {
      setWishlistIds([...wishlistIds, productId]);
    }

    try {
      if (isCurrentlyWishlisted) {
        await deleteDoc(wishlistRef);
        Swal.fire({ text: "Removed from wishlist!", icon: "info", timer: 1500, showConfirmButton: false });
      } else {
        await setDoc(wishlistRef, {
          userId: currentUser.uid,
          productId: productId,
          addedAt: new Date()
        });
        Swal.fire({ text: "Saved to wishlist!", icon: "success", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      if (isCurrentlyWishlisted) {
        setWishlistIds([...wishlistIds, productId]);
      } else {
        setWishlistIds(wishlistIds.filter(id => id !== productId));
      }
      Swal.fire({ text: "Failed to update wishlist.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

  const storeDisplayName = storeOwner?.displayName || storeIdentifier || "EchoByte Store";

  return (
    <PageContainer>
      {/* Store Hero Banner with Search Bar */}
      <StoreHero>
        <HeroImage
        //   src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop"
        src="./digitalproducts.png"  
        alt="EchoByte Storefront"
        />
        <HeroContent>
          <StoreBadge>Digital Storefront</StoreBadge>
          <HeroTitle>
            Welcome to <span>{storeDisplayName}'s Store</span>
          </HeroTitle>
          <HeroSubtitle>
            Explore exclusive digital products, software tools, and premium offerings curated specially for you.
          </HeroSubtitle>
          <SearchInput
            type="text"
            placeholder="Search products in this store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </HeroContent>
      </StoreHero>

      {/* Main Layout */}
      <StoreLayout>
        <ProductsWrapper>
          {/* Controls Bar */}
          <StoreControls>
            <ResultsCount>
              Showing <span>{sortedProducts.length}</span> available products
            </ResultsCount>
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Name: A to Z</option>
            </SortSelect>
          </StoreControls>

          {/* Grid */}
          <ProductsGrid>
            {loading ? (
              <LoadingContainer>Loading store products...</LoadingContainer>
            ) : sortedProducts.length === 0 ? (
              <LoadingContainer>No products found in this store.</LoadingContainer>
            ) : (
              sortedProducts.map((product) => {
                const displayImg = product.images?.[0] || product.image || "https://placehold.co/400x300?text=No+Image";
                const productPrice = Number(product.amount || 0);
                const isWishlisted = wishlistIds.includes(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    onClick={() => router.push(`/productdetail/${product.id}`)}
                  >
                    <CardImageWrapper>
                      <CardLoveIcon 
                        onClick={(e) => handleToggleWishlist(e, product.id)}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {isWishlisted ? (
                          <span style={{ color: "#ef4444", fontSize: "14px" }}>❤️</span>
                        ) : (
                          <span style={{ color: Dark, fontSize: "14px" }}>🤍</span>
                        )}
                      </CardLoveIcon>
                      <CardImage src={displayImg} alt={product.name} />
                    </CardImageWrapper>

                    <ProductTitle>
                      {product.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ""}
                    </ProductTitle>
                    <ProductPriceRow>
                      <PriceText>
                        ₦{productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </PriceText>
                      <AddButton onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/productdetail/${product.id}`);
                      }}>
                        View Product
                      </AddButton>
                    </ProductPriceRow>
                  </ProductCard>
                );
              })
            )}
          </ProductsGrid>
        </ProductsWrapper>
      </StoreLayout>
    </PageContainer>
  );
}