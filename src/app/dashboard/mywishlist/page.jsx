'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Zoom } from 'react-awesome-reveal';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/firebaseConfig";
import { collection, getDocs, doc, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

// 🎨 ECHOBYTE CONCEPT THEME COLORS (Indigo / Violet Gradient Palette & Light Theme)
const PrimaryColor = "#6366f1";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";
const Danger = "#ef4444";

const ProductsSection = styled.section`
  background: ${White};
  padding: 20px 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
  border: 1px solid ${Border};
  width: 100%;
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${Dark};
  margin: 0;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${TextMuted};
  margin: 0;
  font-weight: 500;
`;

// --- CONTROLS CONTAINER (Search & Filter) ---
const ControlsContainer = styled.div`
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${Border};
  font-size: 0.9rem;
  outline: none;
  background: ${LightBg};
  color: ${Dark};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    background: ${White};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: ${TextMuted};
  }
`;

const SortSelect = styled.select`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${Border};
  font-size: 0.9rem;
  outline: none;
  background: ${LightBg};
  color: ${Dark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    background: ${White};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
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
  padding: 14px;
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
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 768px) {
    padding: 10px;
    gap: 8px;
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 150px;

  @media (max-width: 768px) {
    height: 120px;
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
  height: 150px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ProductTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${Dark};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const PriceText = styled.span`
  font-size: 0.95rem;
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
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ViewMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ViewMoreButton = styled.button`
  background: ${AccentGradient};
  color: ${White};
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: ${TextMuted};
  padding: 30px;
  font-weight: 500;
`;

// --- COMPONENT EXPORT ---
export default function UserWishlistPage() {
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // 1. Listen to authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      if (!user) {
        setWishlistProducts([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Wishlisted Products for the Authenticated User
  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const q = query(collection(db, "wishlists"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const productIds = querySnapshot.docs.map(docSnap => docSnap.data().productId);

        if (productIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        const productPromises = productIds.map(async (prodId) => {
          const productRef = doc(db, "products", prodId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() };
          }
          return null;
        });

        const fetchedProducts = await Promise.all(productPromises);
        setWishlistProducts(fetchedProducts.filter(p => p !== null));
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [currentUser]);

  // 3. Remove/Toggle Wishlist Handler
  const handleRemoveFromWishlist = async (e, productId) => {
    e.stopPropagation();

    if (!currentUser) return;

    const wishlistDocId = `${currentUser.uid}_${productId}`;
    const wishlistRef = doc(db, "wishlists", wishlistDocId);

    setWishlistProducts(prev => prev.filter(p => p.id !== productId));

    try {
      await deleteDoc(wishlistRef);
      Swal.fire({ text: "Removed from wishlist!", icon: "info", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({ text: "Failed to update wishlist.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

  // 4. Filtered and Sorted Products calculation
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...wishlistProducts];

    // Filter by search query (name)
    if (searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name && product.name.toLowerCase().includes(queryLower)
      );
    }

    // Sort by price
    if (sortBy === 'low-high') {
      result.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
    }

    return result;
  }, [wishlistProducts, searchQuery, sortBy]);

  if (loading) {
    return (
      <ProductsSection>
        <SectionHeader>
          <SectionTitle>My Wishlist</SectionTitle>
          <SectionSubtitle>Your saved products and items.</SectionSubtitle>
        </SectionHeader>
        <LoadingText>Loading your wishlist...</LoadingText>
      </ProductsSection>
    );
  }

  if (!currentUser) {
    return (
      <ProductsSection>
        <SectionHeader>
          <SectionTitle>My Wishlist</SectionTitle>
          <SectionSubtitle>Please log in to view your saved wishlist items.</SectionSubtitle>
        </SectionHeader>
        <ViewMoreContainer>
          <ViewMoreButton onClick={() => router.push('/login')}>
            Log In →
          </ViewMoreButton>
        </ViewMoreContainer>
      </ProductsSection>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <ProductsSection>
        <SectionHeader>
          <SectionTitle>My Wishlist</SectionTitle>
          <SectionSubtitle>Your saved products and items.</SectionSubtitle>
        </SectionHeader>
        <LoadingText>Your wishlist is currently empty.</LoadingText>
        <ViewMoreContainer>
          <ViewMoreButton onClick={() => router.push('/store')}>
            Explore Store →
          </ViewMoreButton>
        </ViewMoreContainer>
      </ProductsSection>
    );
  }

  return (
    <ProductsSection>
      <SectionHeader>
        <SectionTitle>My Wishlist</SectionTitle>
        <SectionSubtitle>Review and manage your favorite saved digital and physical products.</SectionSubtitle>
      </SectionHeader>

      {/* Search and Sort Controls */}
      <ControlsContainer>
        <SearchInput 
          type="text"
          placeholder="Search wishlist by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SortSelect 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort by Price</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </SortSelect>
      </ControlsContainer>

      {filteredAndSortedProducts.length === 0 ? (
        <LoadingText>No products match your search query.</LoadingText>
      ) : (
        <ProductsGrid>
          {filteredAndSortedProducts.map((product, idx) => {
            const displayImg = product.images?.[0] || product.image || "https://placehold.co/400x300?text=No+Image";
            const productPrice = Number(product.amount || 0);

            return (
              <Zoom delay={idx * 50} triggerOnce key={product.id} style={{ display: 'contents' }}>
                <ProductCard onClick={() => router.push(`/productdetail/${product.id}`)}>
                  <CardImageWrapper>
                    <CardLoveIcon 
                      onClick={(e) => handleRemoveFromWishlist(e, product.id)}
                      title="Remove from Wishlist"
                    >
                      <span style={{ color: Danger, fontSize: "14px" }}>❤️</span>
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
                    }}>View</AddButton>
                  </ProductPriceRow>
                </ProductCard>
              </Zoom>
            );
          })}
        </ProductsGrid>
      )}

      {/* <ViewMoreContainer>
        <ViewMoreButton onClick={() => router.push('/store')}>
          Continue Shopping →
        </ViewMoreButton>
      </ViewMoreContainer> */}
    </ProductsSection>
  );
}