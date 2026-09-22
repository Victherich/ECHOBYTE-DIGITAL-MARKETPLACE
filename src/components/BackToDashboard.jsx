import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const BackButtonContainer = styled.div`
  margin:0 auto;
  display: flex;
  align-items: center;
justify-content:center;
  `;

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateX(-3px); /* Subtle slide-left effect */
  }

  &:active {
    transform: translateX(0);
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.1rem;
  line-height: 1;
`;

const BackToDashboard = () => {
  const router = useRouter();

  return (
    <BackButtonContainer>
      <StyledBackButton onClick={() => router.push('/dashboard')}>
        <ArrowIcon>←</ArrowIcon>
        Back to Dashboard
      </StyledBackButton>
    </BackButtonContainer>
  );
};

export default BackToDashboard;