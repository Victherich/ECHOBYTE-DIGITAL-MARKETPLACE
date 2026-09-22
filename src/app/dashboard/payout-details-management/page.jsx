// "use client";

// import { useEffect, useState } from "react";
// import { db, auth } from "@/firebaseConfig";
// import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
// import styled from "styled-components";
// import Swal from "sweetalert2";

// // 🎨 Theme Colors
// const Primary = "#6366f1";
// const Secondary = "#a855f7";
// const Dark = "#0f172a";
// const Border = "#e5eaf2";
// const White = "#ffffff";
// const TextMuted = "#64748B";
// const Success = "#10b981";

// // 🌟 Styled Components
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   color: ${Dark};
//   width: 100%;
//   padding: 10px;
//   box-sizing: border-box;
// `;

// const HeaderBanner = styled.div`
//   background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
//   color: ${White};
//   padding: 10px;
//   border-radius: 10px;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const ColorfulTitle = styled.h1`
//   font-size: 1.6rem;
//   font-weight: 800;
//   margin: 0;
//   background: linear-gradient(90deg, #ffffff 0%, #e0e7ff 100%);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const FormCard = styled.div`
//   background: ${White};
//   border-radius: 10px;
//   padding: 15px;
//   border: 1px solid ${Border};
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 4px;
// `;

// const FormLabel = styled.label`
//   font-size: 0.85rem;
//   font-weight: 700;
//   color: ${Dark};
// `;

// const StyledInput = styled.input`
//   border: 1px solid ${Border};
//   border-radius: 6px;
//   padding: 8px 10px;
//   width: 100%;
//   box-sizing: border-box;
//   &:focus { border-color: ${Primary}; outline: none; }
// `;

// const StyledSelect = styled.select`
//   border: 1px solid ${Border};
//   border-radius: 6px;
//   padding: 8px 10px;
//   width: 100%;
//   &:focus { border-color: ${Primary}; outline: none; }
// `;

// const SubmitButton = styled.button`
//   background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
//   color: ${White};
//   border: none;
//   border-radius: 6px;
//   padding: 10px;
//   font-weight: 700;
//   cursor: pointer;
//   margin-top: 5px;
//   &:disabled { opacity: 0.6; cursor: not-allowed; }
// `;

// const StatusBox = styled.div`
//   background: #f8fafc;
//   border-radius: 8px;
//   padding: 10px;
//   border: 1px solid ${Border};
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   font-size: 0.9rem;
// `;

// export default function PaystackSubaccountSetupPage() {
//   const [loading, setLoading] = useState(true);
//   const [verifying, setVerifying] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [banks, setBanks] = useState([]);
//   const [accountName, setAccountName] = useState("");
//   const sellerEmail = auth.currentUser?.email;
//   const sellerUid = auth.currentUser?.uid;
//   const [deleting, setDeleting] = useState(false);

//   const [formData, setFormData] = useState({
//     businessName: "",
//     settlementBank: "",
//     accountNumber: "",
//     percentageCharge: 10
//   });

//   const [subaccountInfo, setSubaccountInfo] = useState(null);

// //   useEffect(() => {
// //     const init = async () => {
// //       try {
// //         const bankRes = await fetch("https://api.paystack.co/bank");
// //         const bankJson = await bankRes.json();
// //         if (bankJson.status) setBanks(bankJson.data);

// //         if (sellerEmail) {
// //           const snap = await getDoc(doc(db, "users", sellerEmail));
// //           if (snap.exists() && snap.data().paystackSubaccount) {
// //             setSubaccountInfo(snap.data().paystackSubaccount);
// //           }
// //         }
// //       } catch (err) { console.error(err); } finally { setLoading(false); }
// //     };
// //     init();
// //   }, [sellerEmail]);

 

// useEffect(() => {
//     const init = async () => {
//       try {
//         const bankRes = await fetch("https://api.paystack.co/bank");
//         const bankJson = await bankRes.json();
//         if (bankJson.status) setBanks(bankJson.data);

//         // Fetch subaccount from the 'subaccounts' collection using sellerUid
//         if (sellerUid) {
//           const q = query(collection(db, "subaccounts"), where("sellerUid", "==", sellerUid));
//           const querySnapshot = await getDocs(q);
          
//           if (!querySnapshot.empty) {
//             // Grab the first matching subaccount document data
//             const subaccountData = querySnapshot.docs[0].data();
//             setSubaccountInfo(subaccountData);
//           }
//         }
//       } catch (err) { 
//         console.error(err); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
//     init();
//   }, [sellerUid]);




// const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setAccountName(""); 
//   };

//   const handleVerify = async () => {
//     if (formData.accountNumber.length !== 10 || !formData.settlementBank) {
//       Swal.fire("Warning", "Enter valid bank and 10-digit account.", "warning");
//       return;
//     }
//     setVerifying(true);
//     try {
//       const res = await fetch(`/api/paystack/resolve-account?account_number=${formData.accountNumber}&bank_code=${formData.settlementBank}`);
//       const data = await res.json();
//       if (data.status) {
//         setAccountName(data.data.account_name);
//         Swal.fire("Verified!", `Account belongs to: ${data.data.account_name}`, "success");
//       } else {
//         throw new Error("Account could not be verified.");
//       }
//     } catch (err) {
//       Swal.fire("Error", err.message, "error");
//     } finally { setVerifying(false); }
//   };

//   const handleCreate = async () => {
//     if (!sellerEmail) {
//       Swal.fire("Error", "Seller email is missing.", "error");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         email: sellerEmail,
//         business_name: formData.businessName,
//         settlement_bank: formData.settlementBank,
//         account_number: formData.accountNumber,
//         percentage_charge: parseFloat(formData.percentageCharge)
//       };

//       const res = await fetch("/api/paystack/create-subaccount", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const result = await res.json();
//       if (!result.status) throw new Error(result.message);

//       // Save separately to 'subaccounts' collection with seller UID and email tied to it
//       const subaccountDocData = {
//         ...result.data,
//         sellerUid: sellerUid || "",
//         sellerEmail: sellerEmail,
//         accountName: accountName,
//         createdAt: new Date()
//       };

//       await addDoc(collection(db, "subaccounts"), subaccountDocData);

//     //   // Also update user document reference
//     //   await setDoc(doc(db, "users", sellerEmail), { paystackSubaccount: result.data }, { merge: true });

//       setSubaccountInfo(result.data);
//       Swal.fire("Success!", "Subaccount linked and saved successfully!", "success");
//     } catch (err) {
//       Swal.fire("Error", err.message, "error");
//     } finally { setSubmitting(false); }
//   };





// //   const handleDeleteSubaccount = async () => {
// //     const confirmResult = await Swal.fire({
// //       title: "Are you sure?",
// //       text: "This will remove your payout account.",
// //       icon: "warning",
// //       showCancelButton: true,
// //       confirmButtonColor: "#d33",
// //       cancelButtonColor: "#3085d6",
// //       confirmButtonText: "Yes, delete it!"
// //     });

// //     if (!confirmResult.isConfirmed) return;

// //     setDeleting(true);
// //     try {
// //       // 1. Call backend to disable subaccount on Paystack
// //       const res = await fetch("/api/paystack/delete-subaccount", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ subaccount_code: subaccountInfo.subaccount_code })
// //       });
// //       const result = await res.json();
      
// //       // Even if Paystack says something minor, let's make sure we can clean up local Firestore
// //       if (!result.status) {
// //         console.warn("Paystack warning:", result.message);
// //       }

// //       // 2. Remove / clear the subaccount reference from the user's document in Firestore
   

// //       // Note: If you want to delete or mark the document in the 'subaccounts' collection as well, 
// //       // you can query it by sellerEmail/sellerUid and delete it using deleteDoc().

// //       // 3. Reset state
// //       setSubaccountInfo(null);
// //       setAccountName("");
// //       setFormData({
// //         businessName: "",
// //         settlementBank: "",
// //         accountNumber: "",
// //         percentageCharge: 10
// //       });

// //       Swal.fire("Deleted!", "Your payout account has been unlinked.", "success");
// //     } catch (err) {
// //       Swal.fire("Error", err.message || "Failed to delete subaccount", "error");
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };





//   const handleDeleteSubaccount = async () => {
//     const confirmResult = await Swal.fire({
//       title: "Are you sure?",
//       text: "This will remove your payout account link from your profile and Paystack.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!"
//     });

//     if (!confirmResult.isConfirmed) return;

//     setDeleting(true);
//     try {
//       // 1. Call backend to disable subaccount on Paystack
//       const res = await fetch("/api/paystack/delete-subaccount", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ subaccount_code: subaccountInfo.subaccount_code })
//       });
//       const result = await res.json();
      
//       if (!result.status) {
//         console.warn("Paystack warning:", result.message);
//       }

//       // 2. Query and delete the document from the 'subaccounts' collection using sellerUid
//       if (sellerUid) {
//         const q = query(collection(db, "subaccounts"), where("sellerUid", "==", sellerUid));
//         const querySnapshot = await getDocs(q);
        
//         const deletePromises = querySnapshot.docs.map((documentSnapshot) => 
//           deleteDoc(doc(db, "subaccounts", documentSnapshot.id))
//         );
        
//         await Promise.all(deletePromises);
//       }
//       // 4. Reset component state
//       setSubaccountInfo(null);
//       setAccountName("");
//       setFormData({
//         businessName: "",
//         settlementBank: "",
//         accountNumber: "",
//         percentageCharge: 10
//       });

//       Swal.fire("Deleted!", "Your payout account has been unlinked.", "success");
//     } catch (err) {
//       Swal.fire("Error", err.message || "Failed to delete subaccount", "error");
//     } finally {
//       setDeleting(false);
//     }
//   };



//   if (loading) return <div>Loading...</div>;

//   return (
//     <Container>
//       <HeaderBanner>
//         <ColorfulTitle>Setup Your Payout Account here IN 2 STEPS💳</ColorfulTitle>
//       </HeaderBanner>
// <p>Enter the bank account detail where you wish to be receiving your payouts when you make a sale.</p>
//       {subaccountInfo ? (
//         <FormCard>
//           <h3>Account Linked ✅</h3>
//           <StatusBox>
//             <span><strong>Name:</strong> {subaccountInfo.business_name}</span>
//             <span><strong>Account:</strong> {subaccountInfo.account_number}</span>
//             {/* <span><strong>Subaccount Code:</strong> {subaccountInfo.subaccount_code}</span> */}
//           </StatusBox>
//           {/* Add Delete / Unlink Button Here */}
//           <SubmitButton 
//             onClick={handleDeleteSubaccount} 
//             disabled={deleting}
//             style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", marginTop: "15px", width:"200px" }}
//           >
//             {deleting ? "Unlinking..." : "🗑️ Delete / Unlink Account"}
//           </SubmitButton>
//         </FormCard>
//       ) : (
//         <FormCard>
          

//           <FormGroup>
//             <FormLabel>Bank</FormLabel>
//             <StyledSelect name="settlementBank" value={formData.settlementBank} onChange={handleChange}>
//               <option value="">Select Bank</option>
//               {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
//             </StyledSelect>
//           </FormGroup>

//           <FormGroup>
//             <FormLabel>Account Number</FormLabel>
//             <StyledInput maxLength={10} name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
//           </FormGroup>

//           <FormGroup>
//             <FormLabel>Store Name</FormLabel>
//             <StyledInput name="businessName" value={formData.businessName} onChange={handleChange} />
//           </FormGroup>

//           {!accountName ? (
//             <SubmitButton onClick={handleVerify} disabled={verifying}>
//               {verifying ? "Verifying..." : "STEP 1. Verify Account"}
//             </SubmitButton>
//           ) : (
//             <div style={{ color: Success, fontWeight: 'bold', marginTop: '10px' }}>
//               Verified Owner: {accountName}
//               <SubmitButton onClick={handleCreate} disabled={submitting} style={{ width: '100%' }}>
//                 {submitting ? "Linking..." : "STEP 2. Link Your Account"}
//               </SubmitButton>
//             </div>
//           )}
//         </FormCard>
//       )}
//     </Container>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import styled from "styled-components";
import Swal from "sweetalert2";
import BackToDashboard from "@/components/BackToDashboard";
import { useRouter } from "next/navigation";

// 🎨 Theme Colors
const Primary = "#6366f1";
const Secondary = "#a855f7";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const TextMuted = "#64748B";
const Success = "#10b981";

// 🌟 Styled Components
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
`;

const ColorfulTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 15px;
  border: 1px solid ${Border};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${Dark};
`;

const StyledInput = styled.input`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  width: 100%;
  box-sizing: border-box;
  &:focus { border-color: ${Primary}; outline: none; }
`;

const StyledSelect = styled.select`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  width: 100%;
  &:focus { border-color: ${Primary}; outline: none; }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${Primary} 0%, ${Secondary} 100%);
  color: ${White};
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 5px;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const StatusBox = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid ${Border};
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
`;

export default function PaystackSubaccountSetupPage() {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [banks, setBanks] = useState([]);
  const [accountName, setAccountName] = useState("");
  const sellerEmail = auth.currentUser?.email;
  const sellerUid = auth.currentUser?.uid;
  const [deleting, setDeleting] = useState(false);
const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    settlementBank: "",
    accountNumber: "",
    percentageCharge: 10
  });

  const [subaccountInfo, setSubaccountInfo] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const bankRes = await fetch("https://api.paystack.co/bank");
        const bankJson = await bankRes.json();
        if (bankJson.status) setBanks(bankJson.data);

        // Fetch subaccount from the 'subaccounts' collection using sellerUid or sellerEmail
        if (sellerUid || sellerEmail) {
          const conditions = [];
          if (sellerUid) conditions.push(where("sellerUid", "==", sellerUid));
          if (sellerEmail) conditions.push(where("sellerEmail", "==", sellerEmail));

          // Try querying by sellerUid first, or fallback check
          const qUid = sellerUid ? query(collection(db, "subaccounts"), where("sellerUid", "==", sellerUid)) : null;
          const qEmail = sellerEmail ? query(collection(db, "subaccounts"), where("sellerEmail", "==", sellerEmail)) : null;

          let querySnapshot = qUid ? await getDocs(qUid) : null;
          if ((!querySnapshot || querySnapshot.empty) && qEmail) {
            querySnapshot = await getDocs(qEmail);
          }

          if (querySnapshot && !querySnapshot.empty) {
            const subaccountData = querySnapshot.docs[0].data();
            setSubaccountInfo(subaccountData);
          }
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };

    // Listen to auth state or trigger when auth user becomes available
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        init();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAccountName(""); 
  };

  const handleVerify = async () => {
    if (formData.accountNumber.length !== 10 || !formData.settlementBank) {
      Swal.fire("Warning", "Enter valid bank and 10-digit account.", "warning");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch(`/api/paystack/resolve-account?account_number=${formData.accountNumber}&bank_code=${formData.settlementBank}`);
      const data = await res.json();
      if (data.status) {
        setAccountName(data.data.account_name);
        Swal.fire("Verified!", `Account belongs to: ${data.data.account_name}`, "success");
      } else {
        throw new Error("Account could not be verified.");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally { setVerifying(false); }
  };

  const handleCreate = async () => {
    const currentEmail = auth.currentUser?.email || sellerEmail;
    const currentUid = auth.currentUser?.uid || sellerUid;

    if (!currentEmail) {
      Swal.fire("Error", "Seller email is missing. Please log in again.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email: currentEmail,
        business_name: formData.businessName,
        settlement_bank: formData.settlementBank,
        account_number: formData.accountNumber,
        percentage_charge: parseFloat(formData.percentageCharge)
      };

      const res = await fetch("/api/paystack/create-subaccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.status) throw new Error(result.message);

      const subaccountDocData = {
        ...result.data,
        sellerUid: currentUid || "",
        sellerEmail: currentEmail,
        accountName: accountName,
        createdAt: new Date()
      };

      await addDoc(collection(db, "subaccounts"), subaccountDocData);

      setSubaccountInfo(subaccountDocData);
      Swal.fire("Success!", "Subaccount linked and saved successfully!", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally { setSubmitting(false); }
  };

  const handleDeleteSubaccount = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove your payout account link from your profile and Paystack.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (!confirmResult.isConfirmed) return;

    setDeleting(true);
    try {
      if (subaccountInfo?.subaccount_code) {
        const res = await fetch("/api/paystack/delete-subaccount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subaccount_code: subaccountInfo.subaccount_code })
        });
        const result = await res.json();
        if (!result.status) {
          console.warn("Paystack warning:", result.message);
        }
      }

      const currentUid = auth.currentUser?.uid || sellerUid;
      const currentEmail = auth.currentUser?.email || sellerEmail;

      if (currentUid || currentEmail) {
        const qUid = currentUid ? query(collection(db, "subaccounts"), where("sellerUid", "==", currentUid)) : null;
        const querySnapshot = qUid ? await getDocs(qUid) : null;
        
        if (querySnapshot && !querySnapshot.empty) {
          const deletePromises = querySnapshot.docs.map((documentSnapshot) => 
            deleteDoc(doc(db, "subaccounts", documentSnapshot.id))
          );
          await Promise.all(deletePromises);
        } else if (currentEmail) {
          const qEmail = query(collection(db, "subaccounts"), where("sellerEmail", "==", currentEmail));
          const emailSnapshot = await getDocs(qEmail);
          const deletePromises = emailSnapshot.docs.map((documentSnapshot) => 
            deleteDoc(doc(db, "subaccounts", documentSnapshot.id))
          );
          await Promise.all(deletePromises);
        }
      }

      setSubaccountInfo(null);
      setAccountName("");
      setFormData({
        businessName: "",
        settlementBank: "",
        accountNumber: "",
        percentageCharge: 10
      });

      Swal.fire("Deleted!", "Your payout account has been unlinked.", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete subaccount", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Setup Your Store Name & Payout Account here IN 2 STEPS💳</ColorfulTitle>
      </HeaderBanner>
      <p>Enter the bank account detail where you wish to be receiving your payouts when you make a sale.</p>
      
      {subaccountInfo ? (
        <FormCard>
          <h3>Account Linked ✅</h3>
          <StatusBox>
            <span><strong> Store Name:</strong> {subaccountInfo.business_name}</span>
            <span><strong>Account Number:</strong> {subaccountInfo.account_number}</span>
          </StatusBox>
          <SubmitButton 
            onClick={handleDeleteSubaccount} 
            disabled={deleting}
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", marginTop: "15px", width:"200px" }}
          >
            {deleting ? "Unlinking..." : "🗑️ Delete / Unlink Account"}
          </SubmitButton>
        </FormCard>
      ) : (
        <FormCard>

            
          <FormGroup>
            <FormLabel>Store Name</FormLabel>
            <StyledInput name="businessName" value={formData.businessName} onChange={handleChange} />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Bank</FormLabel>
            <StyledSelect name="settlementBank" value={formData.settlementBank} onChange={handleChange}>
              <option value="">Select Bank</option>
              {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
            </StyledSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Account Number</FormLabel>
            <StyledInput maxLength={10} name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
          </FormGroup>


          {!accountName ? (
            <SubmitButton onClick={handleVerify} disabled={verifying}>
              {verifying ? "Verifying..." : "STEP 1. Verify Account"}
            </SubmitButton>
          ) : (
            <div style={{ color: Success, fontWeight: 'bold', marginTop: '10px' }}>
              Verified Owner: {accountName}
              <SubmitButton onClick={handleCreate} disabled={submitting} style={{ width: '100%' }}>
                {submitting ? "Linking..." : "STEP 2. Link Your Account"}
              </SubmitButton>
            </div>
          )}
        </FormCard>
      )}
      <BackToDashboard/>
      {subaccountInfo&&<SubmitButton onClick={()=>router.push('/dashboard/manage-products')}>
        Proceed to Posting Products &
        Services
      </SubmitButton>}
    </Container>
  );
}