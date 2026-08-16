"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

// 🎨 ECHOBYTE DIGITAL STORE THEME COLORS
const PrimaryColor = "#6366f1";
const SecondaryColor = "#a855f7";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";
const AccentGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)";

// 🌟 Styled Components (Matching the SignUp layout & styling standards)
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
  font-size: clamp(1.8rem, 3vw, 2.4rem);
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

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${LightBg};
  color: ${Dark};
  font-size: 1.1rem;
  font-weight: 600;
`;


// ✨ LOGIN COMPONENT
export default function UserLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Please wait...",
      text: "Logging in...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const { email, password } = form;
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Success ✅", "Logged in successfully", "success");
      router.push("/dashboard");
  } catch (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    // Map Firebase error codes to clean, user-friendly messages
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Access temporarily blocked due to too many failed login attempts. Please try again later.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    }

    Swal.fire({
      title: "Login Failed ❌",
      text: errorMessage,
      icon: "error",
      confirmButtonColor: PrimaryColor, // or Blue depending on your theme variables
      background: White,
      color: Dark,
    });
    
    console.error(error); // Keeps the technical log for you in the developer console
  }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
      if (user) router.push("/dashboard");
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;

  return (
    <PageContainer>
      <AuthWrapper>
        {/* Left Visual Branding Panel */}
<BrandingSide>
  <BrandLogo>
    ECHOBYTE <span>DIGITAL STORE</span>
  </BrandLogo>
  <BrandingContent>
    <Headline>Welcome Back to Your Workspace</Headline>
    <Subtext>
      Log in to access your digital solutions, track your active orders, and manage your tech ecosystem effortlessly.
    </Subtext>
  </BrandingContent>
  <div />
</BrandingSide>
        {/* Right Form Panel */}
        <FormSide>
          <FormHeader>
            <Title>Login</Title>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <Label>Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
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

              <Button type="submit">Login</Button>

              <LinkText onClick={() => router.push("/signup")}>
                Don't have an account? <span>Sign Up</span>
              </LinkText>
            </FormGrid>
          </form>
        </FormSide>
      </AuthWrapper>
    </PageContainer>
  );
}