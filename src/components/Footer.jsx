"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ================= COLORS (Light Theme) ================= */

const Blue = "#6366f1";
const Purple = "#a855f7";
const Dark = "#0f172a";
const TextMuted = "#475569";
const Border = "#e2e8f0";
const White = "#ffffff";
const LightBg = "#f8fafc";

/* ================= FOOTER STYLES ================= */

const FooterContainer = styled.footer`
  background: ${LightBg};
  color: ${Dark};
  border-top: 1px solid ${Border};
  font-family: inherit;
  position: relative;
  padding:1rem;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 40px 1.5px 20px 1.5px;

  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 30px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${Dark};
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Purple} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterText = styled.p`
  color: ${TextMuted};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const ColTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${Dark};
  letter-spacing: 0.5px;
  margin-bottom: 0px;
`;

const FooterLink = styled(Link)`
  color: ${TextMuted};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  width: fit-content;

  &:hover {
    color: ${Blue};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${TextMuted};
  font-size: 0.9rem;

  span {
    color: ${Dark};
    font-weight: 500;
  }
`;

const SocialIconsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${White};
  border: 1px solid ${Border};
  color: ${TextMuted};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, ${Blue} 0%, ${Purple} 100%);
    color: ${White};
    border-color: transparent;
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px 1.5px;
  border-top: 1px solid ${Border};

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${TextMuted};
  font-size: 0.85rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: ${TextMuted};
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${Blue};
    }
  }
`;

/* ================= FLOATING WHATSAPP ================= */

const WhatsAppFloat = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 300;
  background-color: #25d366;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
  }
`;

/* ================= COMPONENT ================= */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const pathname = usePathname();

  // Define allowed routes / route prefixes
  const isDashboard = pathname.startsWith("/dashboard");
  const isAllowedRoute = 
    pathname === "/privacy-policy" || 
    pathname === "/terms-conditions" || 
    pathname ==='/'||
    pathname === '/about'||
    pathname ==='/'||
    pathname==='/stores'||
    pathname==='/contact'||
    isDashboard;

  // If we are not on an allowed route, don't render the footer or WhatsApp float
  if (!isAllowedRoute) {
    return null;
  }

  return (
    <>
      <FooterContainer>
        <FooterInner>
          {/* Col 1: Brand Info */}
          <FooterCol>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img src="/logo.jpeg" alt="EchoByte Logo" style={{ height: "50px", marginBottom: "10px", borderRadius: "10px" }} />  
              <Logo>
                Echobyte <span>Digi-Mart</span>
              </Logo>
            </Link>
            <FooterText>
              Empowering your digital journey with professional web development, high-performance digital store solutions, and innovative technology services.
            </FooterText>
          </FooterCol>

          {/* Col 2: Quick Links */}
          <FooterCol>
            <ColTitle>Quick Links</ColTitle>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/stores">Digital Stores</FooterLink>
  
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          {/* Col 3: Contact & Support */}
          <FooterCol>
            <ColTitle>Get in Touch</ColTitle>
            <ContactInfo>
              <p>Email: <span>echobyteconcept@gmail.com</span></p>
              <p>Phone: <span>+234 706 348 0314</span></p>
              {/* <p>Location: <span>Lagos state, Nigeria</span></p> */}
            </ContactInfo>
          </FooterCol>

          {/* Col 4: Social Media */}
          <FooterCol>
            <ColTitle>Connect With Us</ColTitle>
            <FooterText>
              Follow us on social media for tech updates, promotions, and digital store releases.
            </FooterText>
            <SocialIconsContainer>
              {/* Instagram / Social */}
              <SocialIconLink 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialIconLink>
            </SocialIconsContainer>
          </FooterCol>
        </FooterInner>

        {/* Bottom Bar */}
        <BottomBar>
          <Copyright>
            &copy; {currentYear} EchoByte Concept. All rights reserved.
          </Copyright>
          <LegalLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-conditions">Terms & Conditions</Link>
          </LegalLinks>
        </BottomBar>
      </FooterContainer>

      {/* Floating WhatsApp Icon */}
      <WhatsAppFloat 
        href="https://wa.me/2347063480314" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={24}
          height={24}
        />
      </WhatsAppFloat>
    </>
  );
}