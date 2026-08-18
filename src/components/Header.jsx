





"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // Changed getDoc to onSnapshot
import PaymentInProgressModal from "./PaymentInProgressModal";
import { useAppContext } from "./Context";
import { useCart } from "@/components/CartContext";



/* ================= COLORS ================= */
const Blue = "#6366f1";
const Purple = "#a855f7";
const Dark = "#0f172a";
const Border = "#e2e8f0";
const White = "#ffffff";

/* ================= HEADER ================= */
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 300;

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  border-bottom: 1px solid ${Border};
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 1.5rem;
`;

/* ================= LOGO ================= */
const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${Dark};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Purple} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

/* ================= NAV ================= */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 73px;
    right: 0;
    width: 80%;
    max-width: 320px;
    height: calc(100vh - 73px);
    background: ${White};
    border-left: 1px solid ${Border};
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
    flex-direction: column;
    align-items: flex-start;
    padding: 2.5rem 2rem;
    gap: 1.5rem;
    transform: translateX(${(p) => (p.$open ? "0" : "100%")});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

/* ================= LINKS ================= */
const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? Blue : Dark)};
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: ${Blue};
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: ${(p) => (p.$active ? "100%" : "0")};
    height: 2px;
    background: linear-gradient(135deg, ${Blue} 0%, ${Purple} 100%);
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    width: 100%;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${Border};
    &::after {
      display: none;
    }
  }
`;

/* ================= ACTION WRAPPER ================= */
const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    border-top: 1px solid ${Border};
    padding-top: 1.5rem;
  }
`;

const AuthButton = styled(Link)`
  text-decoration: none;
  padding: 0.55rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  transition: all 0.2s ease;

  background: ${(p) => (p.$isPrimary ? `linear-gradient(135deg, ${Blue} 0%, ${Purple} 100%)` : "transparent")};
  color: ${(p) => (p.$isPrimary ? White : Dark)};
  border: ${(p) => (p.$isPrimary ? "none" : `1px solid ${Border}`)};
  box-shadow: ${(p) => (p.$isPrimary ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none")};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    border-color: ${Blue};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem;
  }
`;

/* ================= HAMBURGER ================= */
const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 28px;
    height: 21px;
  }

  div {
    width: 100%;
    height: 2.5px;
    background: ${Dark};
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }

  &.open div:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }

  &.open div:nth-child(2) {
    opacity: 0;
  }

  &.open div:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
`;

/* ================= OVERLAY ================= */
const Overlay = styled.div`
  display: ${(p) => (p.$open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99;
  transition: opacity 0.3s ease;
`;



/* ================= COMPONENT ================= */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  const { paymentSession } = useAppContext();
  const { cartTotalItems } = useCart();

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fix: Listen in real-time. If the signup process is slightly delayed 
        // in creating the document, this will instantly catch it when it finishes.
        const userRef = doc(db, "users", user.uid);
        unsubscribeDoc = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        });
      } else {
        setUserData(null);
        if (unsubscribeDoc) {
          unsubscribeDoc(); // Clean up doc listener when user logs out
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <>
      <Overlay $open={open} onClick={() => setOpen(false)} />

      <HeaderContainer>
        {paymentSession && <PaymentInProgressModal />}
        <Inner>
          <Link href="/" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}> 
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logo.jpeg" alt="Bees Interior Logo" style={{ height: "50px", borderRadius:"50%" }} />    
              <Logo>
                Echobyte<span> Digi-Mart</span>
              </Logo>
            </div>
          </Link>

          <>
            <Nav $open={open}>
              <NavLink href="/" $active={pathname === "/"} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink href="/about" $active={pathname === "/about"} onClick={() => setOpen(false)}>About</NavLink>
              <NavLink href="/stores" $active={pathname === "/stores"} onClick={() => setOpen(false)}>Digital Stores</NavLink>
              
              <NavLink href="/contact" $active={pathname === "/contact"} onClick={() => setOpen(false)}>Contact</NavLink>
         

              <NavActions>
                {!userData && (
                  <AuthButton 
                    href="/signup" 
                    $isPrimary={false}
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </AuthButton>
                )}

                <AuthButton 
                  href={userData ? "/dashboard" : "/login"} 
                  $isPrimary={true}
                  onClick={() => setOpen(false)}
                >
                  {userData ? "My Dashboard" : "Login"}
                </AuthButton>
              </NavActions>
            </Nav>

            <Hamburger
              onClick={() => setOpen(!open)}
              className={open ? "open" : ""}
              aria-label="Toggle navigation menu"
            >
              <div />
              <div />
              <div />
            </Hamburger>
          </>
        </Inner>
      </HeaderContainer>

      <div style={{ height: "73px" }} />
    </>
  );
}