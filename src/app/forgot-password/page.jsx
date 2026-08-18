// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import styled from "styled-components";
// import Swal from "sweetalert2";

// // 🎨 ECHOBYTE DIGITAL STORE THEME COLORS
// const PrimaryColor = "#6366f1";
// const Dark = "#0f172a";
// const Border = "#e2e8f0";
// const White = "#ffffff";
// const TextMuted = "#64748b";
// const LightBg = "#f8fafc";
// const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

// const PageContainer = styled.div`
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: ${LightBg};
//   padding: 10px;
// `;

// const AuthWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   width: 100%;
//   max-width: 1000px;
//   background: ${White};
//   border-radius: 12px;
//   border: 1px solid ${Border};
//   box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
//   overflow: hidden;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const BrandingSide = styled.div`
//   background: ${PrimaryColor};
//   color: ${White};
//   padding: 24px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   position: relative;
//   overflow: hidden;

//   &::after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(135deg, rgba(15, 23, 42, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
//     z-index: 1;
//   }
// `;

// const BrandingContent = styled.div`
//   position: relative;
//   z-index: 2;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   margin: auto 0;
// `;

// const BrandLogo = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 800;
//   letter-spacing: -0.5px;
//   color: ${White};
// `;

// const Headline = styled.h1`
//   font-size: 2rem;
//   font-weight: 800;
//   line-height: 1.2;
//   letter-spacing: -0.5px;
// `;

// const Subtext = styled.p`
//   font-size: 0.95rem;
//   line-height: 1.6;
//   color: ${Border};
// `;

// const FormSide = styled.div`
//   padding: 24px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   color: ${TextMuted};
// `;

// const FormHeader = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   margin-bottom: 16px;
// `;

// const Title = styled.h2`
//   font-size: 1.5rem;
//   font-weight: 700;
//   color: ${Dark};
//   text-align: left;
// `;

// const FormGrid = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const InputGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
// `;

// const Label = styled.label`
//   font-size: 0.85rem;
//   font-weight: 600;
//   color: ${TextMuted};
//   text-align: left;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 10px 14px;
//   border: 1px solid ${Border};
//   border-radius: 8px;
//   font-size: 0.9rem;
//   background: ${White};
//   color: ${Dark};
//   outline: none;
//   transition: border-color 0.2s ease, box-shadow 0.2s ease;

//   &:focus {
//     border-color: ${PrimaryColor};
//     box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   background: ${AccentGradient};
//   color: ${White};
//   padding: 12px;
//   font-size: 0.95rem;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
//   font-weight: 700;
//   box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
//   transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

//   &:hover {
//     opacity: 0.95;
//     transform: translateY(-1px);
//     box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
//   }
// `;

// const LinkText = styled.p`
//   margin-top: 12px;
//   cursor: pointer;
//   color: ${TextMuted};
//   font-size: 0.9rem;
//   text-align: center;

//   span {
//     color: ${PrimaryColor};
//     font-weight: 600;

//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

// export default function ForgotPassword() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     Swal.fire({
//       title: "Sending Reset Link...",
//       text: "Please wait while we process your request.",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     try {
//       const response = await fetch("/api/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send reset email.");
//       }

//       Swal.fire({
//         title: "Check Your Email ✉️",
//         text: "If an account exists with this email, a password reset link has been sent via EchoByte Digi-Mart.",
//         icon: "success",
//         confirmButtonColor: PrimaryColor,
//         background: White,
//         color: Dark,
//       });

//       router.push("/login");
//     } catch (error) {
//       Swal.fire({
//         title: "Error ❌",
//         text: error.message || "An unexpected error occurred.",
//         icon: "error",
//         confirmButtonColor: PrimaryColor,
//         background: White,
//         color: Dark,
//       });
//     }
//   };

//   return (
//     <PageContainer>
//       <AuthWrapper>
//         {/* Left Visual Branding Panel */}
//         <BrandingSide>
//           <BrandLogo>ECHOBYTE DIGI-MART</BrandLogo>
//           <BrandingContent>
//             <Headline>Recover Your Account</Headline>
//             <Subtext>
//               Enter your registered email address and we will send you secure instructions to reset your password.
//             </Subtext>
//           </BrandingContent>
//           <div />
//         </BrandingSide>

//         {/* Right Form Panel */}
//         <FormSide>
//           <FormHeader>
//             <Title>Forgot Password</Title>
//           </FormHeader>

//           <form onSubmit={handleSubmit}>
//             <FormGrid>
//               <InputGroup>
//                 <Label>Email Address</Label>
//                 <Input
//                   name="email"
//                   type="email"
//                   placeholder="john@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </InputGroup>

//               <Button type="submit">Send Reset Link</Button>

//               <LinkText onClick={() => router.push("/login")}>
//                 Remembered your password? <span>Login</span>
//               </LinkText>
//             </FormGrid>
//           </form>
//         </FormSide>
//       </AuthWrapper>
//     </PageContainer>
//   );
// }





"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";

// 🎨 ECHOBYTE DIGITAL STORE THEME COLORS
const PrimaryColor = "#6366f1";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${LightBg};
  padding: 10px;
`;

const AuthWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  background: ${White};
  border-radius: 12px;
  border: 1px solid ${Border};
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrandingSide = styled.div`
  background: ${PrimaryColor};
  color: ${White};
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    z-index: 1;
  }
`;

const BrandingContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: auto 0;
`;

const BrandLogo = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${White};
`;

const Headline = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const Subtext = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${Border};
`;

const FormSide = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${TextMuted};
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${Dark};
  text-align: left;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${TextMuted};
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${Border};
  border-radius: 8px;
  font-size: 0.9rem;
  background: ${White};
  color: ${Dark};
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${PrimaryColor};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${AccentGradient};
  color: ${White};
  padding: 12px;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
  transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }
`;

const LinkText = styled.p`
  margin-top: 12px;
  cursor: pointer;
  color: ${TextMuted};
  font-size: 0.9rem;
  text-align: center;

  span {
    color: ${PrimaryColor};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Sending Reset Link...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await sendPasswordResetEmail(auth, email);

      Swal.fire({
        title: "Check Your Email ✉️",
        text: "If an account exists with this email, a password reset link has been sent via EchoByte Digi-Mart. Please check your inbox or spam filder , change your password and then come back here and login with your new password.",
        icon: "success",
        confirmButtonColor: PrimaryColor,
        background: White,
        color: Dark,
        allowOutsideClick:false,
      });

      router.push("/login");
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        // Safe generic message to prevent user enumeration
        errorMessage = "If an account exists with this email, a password reset link has been sent.";
        Swal.fire({
          title: "Check Your Email ✉️",
          text: errorMessage,
          icon: "success",
          confirmButtonColor: PrimaryColor,
          background: White,
          color: Dark,
        });
        router.push("/login");
        return;
      }

      Swal.fire({
        title: "Error ❌",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: PrimaryColor,
        background: White,
        color: Dark,
      });
    }
  };

  return (
    <PageContainer>
      <AuthWrapper>
        <BrandingSide>
          <BrandLogo>ECHOBYTE DIGI-MART</BrandLogo>
          <BrandingContent>
            <Headline>Recover Your Account</Headline>
            <Subtext>
              Enter your registered email address and we will send you secure instructions to reset your password.
            </Subtext>
          </BrandingContent>
          <div />
        </BrandingSide>

        <FormSide>
          <FormHeader>
            <Title>Forgot Password</Title>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <Label>Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              <Button type="submit">Send Reset Link</Button>

              <LinkText onClick={() => router.push("/login")}>
                Remembered your password? <span>Login</span>
              </LinkText>
            </FormGrid>
          </form>
        </FormSide>
      </AuthWrapper>
    </PageContainer>
  );
}