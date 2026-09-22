"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
// 🎨 ECHOBYTE DIGITAL STORE THEME COLORS
const PrimaryColor = "#6366f1";
const SecondaryColor = "#a855f7";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const TextMuted = "#64748b"; // Softer, lighter shade for form text instead of pitch black
const LightBg = "#f8fafc";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

// 🌟 Styled Components
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

  span {
    color: #f472b6;
  }
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${(props) => (props.$full ? "span 2" : "span 1")};

  @media (max-width: 500px) {
    grid-column: span 1;
  }
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

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: ${PrimaryColor};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  line-height: 1.4;
  color: ${TextMuted};
  grid-column: span 2;

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const Checkbox = styled.input`
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${PrimaryColor};
`;

const PolicyText = styled.span`
  text-align: left;
  a {
    color: ${PrimaryColor};
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: ${Dark};
    }
  }
`;

const Button = styled.button`
  grid-column: span 2;
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

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const LinkText = styled.p`
  grid-column: span 2;
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

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;
// ✨ SIGNUP COMPONENT
export default function UserSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user", // Hidden role field set by default, never displayed to user
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email !== form.confirmEmail) {
      return Swal.fire("Error", "Emails do not match", "error");
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    if (!agreed) {
      return Swal.fire(
        "Required",
        "You must agree to the Terms & Privacy Policy to continue",
        "warning"
      );
    }

    Swal.fire({
      title: "Please wait...",
      text: "Setting up your account...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const { name, email, phone, password, role } = form;
      
      // 1. This creates the user AND automatically logs them into Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // 2. Creates their database record
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        role, 
        createdAt: new Date(),
      });

      Swal.fire("Success 🎉", "Welcome! Your account is ready.", "success");
      
      // 3. FIX: Redirect to Dashboard, NOT login, because they are already logged in
      router.push("/dashboard"); 
      
   } catch (err) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    // Map Firebase Sign-Up error codes to clean, user-friendly messages
    if (err.code === "auth/email-already-in-use") {
      errorMessage = "This email address is already registered. Please log in instead.";
    } else if (err.code === "auth/invalid-email") {
      errorMessage = "The email address format is invalid. Please check and try again.";
    } else if (err.code === "auth/weak-password") {
      errorMessage = "Your password is too weak. Please use at least 6 characters with a mix of letters and numbers.";
    } else if (err.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection and try again.";
    }

    Swal.fire({
      title: "Registration Failed ❌",
      text: errorMessage,
      icon: "error",
      confirmButtonColor: PrimaryColor,
      background: White,
      color: Dark,
    });

    console.error(err); // Keeps the raw technical error in your browser console for debugging
  }
  };



  return (
    <PageContainer>
      <AuthWrapper>
        {/* Left Visual Branding Panel */}
      <BrandingSide>
  <BrandLogo>
    ECHOBYTE DIGI-MART
  </BrandLogo>
  <BrandingContent>
    <Headline>Register and start selling and buying Digital Products and Services</Headline>
    <Subtext>
      You can buy and sell from the same account
    </Subtext>
  </BrandingContent>
  <div /> {/* Spacer */}
</BrandingSide>

        {/* Right Form Panel */}
        <FormSide>
          <FormHeader>
            <Title>Create Account</Title>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup $full>
                <Label>Full Name</Label>
                <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Email Address</Label>
                <Input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Confirm Email</Label>
                <Input name="confirmEmail" type="email" placeholder="john@example.com" value={form.confirmEmail} onChange={handleChange} required />
              </InputGroup>

              <InputGroup $full>
                <Label>Phone Number</Label>
                <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <PasswordWrapper>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <EyeButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? "Hide" : "Show"}
                  </EyeButton>
                </PasswordWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Confirm Password</Label>
                <PasswordWrapper>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <EyeButton type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </EyeButton>
                </PasswordWrapper>
              </InputGroup>

              <CheckboxWrapper>
                <Checkbox
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  style={{
    background: "white",
    backgroundColor: "white",
    colorScheme: "light"
  }}
/>
                <PolicyText>
                  I agree to the{" "}
                  <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </PolicyText>
              </CheckboxWrapper>

              <Button type="submit">Create Account</Button>

              <LinkText onClick={() => router.push("/login")}>
                Already have an account? <span>Login</span>
              </LinkText>
            </FormGrid>
          </form>
        </FormSide>
      </AuthWrapper>
    </PageContainer>
  );
}