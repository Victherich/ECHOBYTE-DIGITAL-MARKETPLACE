"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import BackToDashboard from "@/components/BackToDashboard";

// 🎨 ECHOBYTE THEME COLORS
const PrimaryColor = "#6366f1";
const SecondaryColor = "#a855f7";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const TextMuted = "#64748b";
const Danger = "#ef4444";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

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
  background: ${AccentGradient};
  color: ${White};
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
`;

const ColorfulTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  color: ${White};
  letter-spacing: -0.5px;
`;

const ColorfulSub = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: #f8fafc;
  opacity: 0.95;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0 0;
  flex-wrap: wrap;
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: ${AccentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchInput = styled.input`
  border: 1px solid ${Border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 240px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const PrimaryButton = styled.button`
  background: ${AccentGradient};
  color: ${White};
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.35);
  }
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const ProductCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${PrimaryColor};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 250px;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    border-color: ${PrimaryColor};
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
    gap: 6px;
    max-width: calc(50% - 2px); 
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 6px;
  overflow: hidden;
  background: ${Border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const ProductAmount = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${PrimaryColor};
`;

const ProductLinkBadge = styled.a`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${PrimaryColor};
  text-decoration: underline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: auto;
`;

const EditButton = styled.button`
  background: rgba(99, 102, 241, 0.1);
  color: ${PrimaryColor};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: ${Danger};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

// 🌟 Custom Modal Components (Max 10px limit)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${Border};
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  background: ${AccentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px;
  font-size: 0.8rem;
  color: ${TextMuted};
  line-height: 1.4;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const UrlInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${Border};
  border-radius: 6px;
  background: #f8fafc;
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${PrimaryColor};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: ${White};
  }
`;

const UrlPrefix = styled.span`
  background: ${Border};
  color: ${TextMuted};
  padding: 8px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  user-select: none;
  border-right: 1px solid ${Border};
`;

const UrlFieldInput = styled.input`
  border: none;
  background: transparent;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
  margin: 0;
`;

const StyledTextarea = styled.textarea`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 60px;
  margin: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

// 🌟 Single Image Upload Slot Card
const ImageSlotCard = styled.div`
  background: #f8fafc;
  border: 1px dashed ${Border};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  min-height: 120px;
  box-sizing: border-box;
`;

const SlotLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${TextMuted};
  text-align: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButtonLabel = styled.label`
  background: ${PrimaryColor};
  color: ${White};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #4f46e5;
  }
`;

const SlotPreviewWrapper = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${Border};
`;

const RemoveSlotButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: ${White};
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: ${Danger};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
`;

const CancelButton = styled.button`
  background: ${Border};
  color: ${TextMuted};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #cbd5e1;
  }
`;

const SaveButton = styled.button`
  background: ${PrimaryColor};
  color: ${White};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }
`;

const SecondaryActionButton = styled.button`
  background: #f1f5f9;
  color: ${Dark};
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #e2e8f0;
  }
`;

// 🔹 Compression utility function
const compressImage = (file, maxSizeKB = 100) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;

        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.7;

        const compressLoop = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Compression failed"));

              const sizeKB = blob.size / 1024;
              if (sizeKB <= maxSizeKB || quality <= 0.1) {
                resolve(blob);
              } else {
                quality -= 0.1;
                compressLoop();
              }
            },
            "image/jpeg",
            quality
          );
        };

        compressLoop();
      };

      img.onerror = () => reject(new Error("Image load failed"));
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};

export default function ProductsCrudPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Modal State Controls
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    urlPath: "", // stores the user portion after https://
  });

  // Single image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch products.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExistingImageUrl("");
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setExistingImageUrl("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.amount || !form.urlPath) {
        return Swal.fire({
          icon: "warning",
          text: "Please provide product name, amount, and valid product/service URL.",
        });
      }

      if (!imageFile && !existingImageUrl) {
        return Swal.fire({
          icon: "warning",
          text: "Product image is compulsory. Please select an image.",
        });
      }

      Swal.fire({
        text: "Processing...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let finalImageUrl = existingImageUrl;

      if (imageFile) {
        const compressedBlob = await compressImage(imageFile, 100);

        const data = new FormData();
        data.append("file", compressedBlob, "product.jpg");
        data.append("upload_preset", "echobyte_digital_store_upload");
        data.append("folder", "products");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddh4wrbok/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error?.message || "Image upload failed");
        }

        finalImageUrl = result.secure_url;
      }

      const fullUrl = `https://${form.urlPath.trim()}`;

      const payload = {
        name: form.name,
        description: form.description,
        amount: Number(form.amount),
        url: fullUrl,
        userId: auth.currentUser?.uid,
        image: finalImageUrl,
        images: [finalImageUrl],
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Saved!",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowModal(false);
      setForm({ name: "", description: "", amount: "", urlPath: "" });
      setImageFile(null);
      setImagePreview("");
      setExistingImageUrl("");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message || "Try again.",
      });
    }
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    const itemImg = item.image || item.images?.[0] || "";
    
    // Extract path after https:// if stored with prefix
    let cleanUrl = item.url || "";
    if (cleanUrl.startsWith("https://")) {
      cleanUrl = cleanUrl.replace("https://", "");
    } else if (cleanUrl.startsWith("http://")) {
      cleanUrl = cleanUrl.replace("http://", "");
    }

    setForm({
      name: item.name || "",
      description: item.description || "",
      amount: item.amount || "",
      urlPath: cleanUrl,
    });
    setEditingId(item.id);

    setExistingImageUrl(itemImg);
    setImagePreview(itemImg);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: Danger,
      cancelButtonColor: TextMuted,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      Swal.fire("Deleted!", "", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire("Error", "Could not delete product.", "error");
    }
  };


// 📋 Copy Link Handler
  const handleCopyLink = (itemId, e) => {
    e.stopPropagation();
    const fullLink = `${window.location.origin}/productdetail/${itemId}`;
    navigator.clipboard.writeText(fullLink).then(() => {
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Product link copied to clipboard.",
        timer: 1200,
        showConfirmButton: false,
      });
    }).catch(() => {
      Swal.fire("Error", "Failed to copy link.", "error");
    });
  };

  // 🔗 Share Link Handler
  const handleShareLink = (item, e) => {
    e.stopPropagation();
    const fullLink = `${window.location.origin}/productdetail/${item.id}`;
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out ${item.name}!`,
        url: fullLink,
      }).catch(() => {});
    } else {
      handleCopyLink(item.id, e);
    }
  };




  const filteredData = products
    .filter((item) => {
      const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") return Number(a.amount || 0) - Number(b.amount || 0);
      if (sortOrder === "high-low") return Number(b.amount || 0) - Number(a.amount || 0);
      return 0;
    });

  if (loading) {
    return <LoadingContainer>Loading digital products & services...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Digital Products & Services Management 🛍️</ColorfulTitle>
        <ColorfulSub>Post products and services, file links, courses, remote booking service links, meeting or coaching links, communities etc.</ColorfulSub>
      </HeaderBanner>

      <ActionRow>
        <ColorfulSectionTitle>Inventory ({filteredData.length})</ColorfulSectionTitle>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <SearchInput
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              border: `1px solid ${Border}`,
              borderRadius: "8px",
              padding: "8px 10px",
              fontSize: "0.9rem",
              outline: "none",
              color: Dark,
              background: White,
              boxSizing: "border-box",
              margin: 0,
            }}
          >
            <option value="">Sort by Price</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <PrimaryButton onClick={() => {
            setEditingId(null);
            setForm({ name: "", description: "", amount: "", urlPath: "" });
            setImageFile(null);
            setImagePreview("");
            setExistingImageUrl("");
            setShowModal(true);
          }}>
            <span>+ Add Item</span>
          </PrimaryButton>
        </div>
      </ActionRow>

      {filteredData.length === 0 ? (
        <LoadingContainer>No digital products or services found.</LoadingContainer>
      ) : (
        <ProductsGrid>
          {filteredData.map((item) => {
            const displayImg = item.image || item.images?.[0] || "https://placehold.co/400x300?text=No+Image";
            return (
              <ProductCard key={item.id}>
                <ProductImageContainer>
                  <ProductImage src={displayImg} alt={item.name} />
                </ProductImageContainer>
                <ProductInfo>
                  <ProductName>
                    {item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : ""}
                  </ProductName>
                  <ProductAmount>₦{Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ProductAmount>
                  {/* {item.url && (
                  
                  )} */}
                </ProductInfo>
                <ButtonGroup>
                  <EditButton onClick={(e) => handleEdit(item, e)}>Edit</EditButton>
                  <DeleteButton onClick={(e) => handleDelete(item.id, e)}>Delete</DeleteButton>
                </ButtonGroup>

                {/* 👇 ADD THESE TWO NEW BUTTONS HERE 👇 */}
  <SecondaryActionButton onClick={(e) => handleCopyLink(item.id, e)}>
    📋 Copy Link
  </SecondaryActionButton>

  <SecondaryActionButton onClick={(e) => handleShareLink(item, e)}>
    🔗 Share Link
  </SecondaryActionButton>
                  <EditButton onClick={()=>window.open(`${item.url}`,"_blank")}>
                    Access Product link
                  </EditButton>
                  <EditButton onClick={()=>router.push(`/dashboard/productdetail/${item.id}`)}>
                    Preview Post
                  </EditButton>
                  
              </ProductCard>
            );
          })}

        
        </ProductsGrid>
      )}

      {/* 🌟 Add/Edit Product Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingId ? "Edit Digital Product or Service" : "Post New Digital Product or Service"}</ModalTitle>
            
            <InfoBox>
              💡 <strong>Guidance:</strong><br />
              • <strong>Digital Product:</strong> E-books, downloadable templates, source code files, or video assets hosted in cloud storage.<br />
              • <strong>Digital Service:</strong> Remote consultations, scheduled coaching calls, freelance deliverables, or virtual workshop registrations.<br />
              </InfoBox>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
              <StyledInput
                type="text"
                placeholder="Product or Service Name (e.g. Next.js SaaS Starter Kit)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <StyledTextarea
                placeholder="Description: Outline what the buyer gets, requirements, and instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: Dark }}>
                  Product or Service Link (Secured with https://). 
                </label>
                <p style={{fontSize:"0.7rem"}}>Enter the direct download link or meeting room link, or community where users access your product/service after purchase</p>
                <UrlInputWrapper>
                  <UrlPrefix>https://</UrlPrefix>
                  <UrlFieldInput
                    type="text"
                    placeholder="example.com/download-link or meet.google.com/xyz"
                    value={form.urlPath}
                    onChange={(e) => {
                      // Prevent user from prepending or tampering with https:// manually
                      let val = e.target.value;
                      if (val.startsWith("https://")) {
                        val = val.replace("https://", "");
                      }
                      setForm({ ...form, urlPath: val });
                    }}
                    required
                  />
                </UrlInputWrapper>
              </div>

              <StyledInput
                type="number"
                placeholder="Amount (₦)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: Dark }}>
                  Visual Flyer or Cover Image (Required):
                </span>

                <ImageSlotCard>
                  <SlotLabel>Product Visual</SlotLabel>
                  {imagePreview ? (
                    <SlotPreviewWrapper>
                      <ProductImage src={imagePreview} alt="Product Preview" />
                      <RemoveSlotButton type="button" onClick={handleRemoveImage}>
                        ✕
                      </RemoveSlotButton>
                    </SlotPreviewWrapper>
                  ) : (
                    <>
                      <HiddenFileInput
                        id="product-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <UploadButtonLabel htmlFor="product-file-input">
                        Select Image (squared image size, 1:1 is preferred,)
                      </UploadButtonLabel>
                    </>
                  )}
                </ImageSlotCard>
              </div>

              <ModalActions>
                <CancelButton type="button" onClick={() => setShowModal(false)}>Cancel</CancelButton>
                <SaveButton type="submit">{editingId ? "Save Changes" : "Create Item"}</SaveButton>
              </ModalActions>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
      <br/>
        <BackToDashboard/>
    </Container>
  );
}