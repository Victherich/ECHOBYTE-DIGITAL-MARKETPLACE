"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const FooterContainer = styled.footer`
  background:rgba(0,0,255,0.5);
  color:white;
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  text-align: center;
  font-size: 0.85rem;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PoweredByText = styled.p`
  cursor: pointer;
  margin: 0;
  text-decoration:underline;
  &:hover {
    color:purple;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: #475569;
    text-decoration: none;
    &:hover { color: #6366f1; }
  }
`;

export default function StoreFooter() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <FooterContainer>
      <FooterInner>
        <PoweredByText onClick={() => router.push('/')}>
          Powered by EchoByte Digi-Mart.
        </PoweredByText>
        <Links>
          {/* Add links here if needed */}
        </Links>
      </FooterInner>
    </FooterContainer>
  );
}