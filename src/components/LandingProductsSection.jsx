'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Zoom } from 'react-awesome-reveal';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' if you are on Next.js App Router
import {auth, db } from "@/firebaseConfig"; // Update this import to match your project's Firebase config path
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";



// --- THEME & STYLES ---
const Blue = "#6366f1";
const Purple = "#a855f7";
const bluePurpleGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";

const ProductsSection = styled.section`
  background: ${LightBg};
  padding: 20px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid ${Border};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
  padding: 0 10px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: ${TextMuted};
  margin: 6px 0 0 0;
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ProductCard = styled.div`
  background: ${White};
  border-radius: 12px;
  padding: 12px;
  border: 1px solid ${Border};
  border-left: none;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  
  width: 100%;
  max-width: 260px;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
    border-color: ${Blue};
  }

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
    max-width: calc(50% - 5px); 
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;

  @media (max-width: 768px) {
    height: 130px;
  }
`;

const CardLoveIcon = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${Border};
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${White};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.03);
  }
`;

const ProductTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${Dark};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 38px;
`;

const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 4px;
  border-top: 1px dashed ${Border};

  @media(max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const PriceText = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${Dark};
`;

const AddButton = styled.button`
  background: ${bluePurpleGradient};
  color: ${White};
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

const ViewMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const ViewMoreButton = styled.button`
  background: ${bluePurpleGradient};
  color: ${White};
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(99, 102, 241, 0.5);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${TextMuted};
  padding: 30px;
`;

// --- COMPONENT EXPORT ---
export default function LandingProductsSection() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // 1. Listen to authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch user's wishlist IDs
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

  // 3. Toggle wishlist handler
  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation(); // prevent card router push

    if (!currentUser) {
      Swal.fire({ text: "Please log in to manage your wishlist.", icon: "warning", timer: 2500, showConfirmButton: false });
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const wishlistDocId = `${currentUser.uid}_${productId}`;
    const wishlistRef = doc(db, "wishlists", wishlistDocId);

    // Optimistic update
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
      // Revert on failure
      if (isCurrentlyWishlisted) {
        setWishlistIds([...wishlistIds, productId]);
      } else {
        setWishlistIds(wishlistIds.filter(id => id !== productId));
      }
      Swal.fire({ text: "Failed to update wishlist.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

useEffect(() => {
    let intervalId = null;

    const fetchLastProducts = async () => {
      try {
        // Fetch up to the last 8 products ordered by creation time
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // If results are found, update products, stop loading, and clear the interval
        if (list.length > 0) {
          setProducts(list);
          setLoading(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing products:", error);
      }
    };

    // Initial fetch call
    setLoading(true);
    fetchLastProducts();

    // Set up polling every 10 seconds (10000ms) until results are found
    intervalId = setInterval(() => {
      fetchLastProducts();
    }, 10000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);



  if (loading) {
    return (
      <ProductsSection>
        <SectionHeader>
          {/* <SectionTitle>Shop Our Curated Luxury Accessories</SectionTitle> */}
          {/* <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle> */}
        </SectionHeader>
        <LoadingText>Loading products...</LoadingText>
      </ProductsSection>
    );
  }

  // If no products exist in Firestore, you can optionally show a fallback or empty view
  if (products.length === 0) {
    return (
      <ProductsSection>
        <SectionHeader>
          {/* <SectionTitle>Shop Our Curated Luxury Accessories</SectionTitle> */}
          {/* <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle> */}
        </SectionHeader>
        <LoadingText>No products available yet.</LoadingText>
      </ProductsSection>
    );
  }

  return (
    <ProductsSection>
      <SectionHeader>
          <SectionTitle>FEATURED PRODUCTS AND SERVICES</SectionTitle>
        {/* <SectionTitle style={{ fontSize: '1rem', marginTop:'20px' }}>Shop Our Curated Luxury Accessories</SectionTitle> */}
        {/* <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle> */}
      </SectionHeader>

<ProductsGrid $itemCount={products.length}>
        {products.map((product, idx) => {
          const displayImg = product.images?.[0] || product.image || "https://placehold.co/400x300?text=No+Image";
          const productPrice = Number(product.amount || 0);
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <Zoom delay={idx * 50} triggerOnce key={product.id} style={{ display: 'contents' }}>
              <ProductCard onClick={() => router.push(`/productdetail/${product.id}`)}>
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

                {/* <ProductTag>{product.category || "Decor"}</ProductTag> */}
                <ProductTitle>
                  {product.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ""}
                </ProductTitle>
                <ProductPriceRow>
                  <PriceText>
                    ₦{productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </PriceText>
                  {/* <AddButton onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/productdetail/${product.id}`);
                  }}>View</AddButton> */}
                </ProductPriceRow>
              </ProductCard>
            </Zoom>

          );
        })}
      </ProductsGrid>

      <ViewMoreContainer>
        <ViewMoreButton onClick={() => router.push('/stores')}>
          View More Products & Services →
        </ViewMoreButton>
      </ViewMoreContainer>
    </ProductsSection>
  );
}