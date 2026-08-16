"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Send, 
  Sparkles
} from "lucide-react";
import Swal from "sweetalert2";

// Sleek Entrance Animation
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Clean Light Theme for EchoByte Concept (Centered Form Layout)
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: inherit;

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

const HeaderBox = styled.header`
  max-width: 600px;
  margin: 0 auto 28px auto;
  text-align: center;
  animation: ${slideUp} 0.6s ease-out forwards;
`;

const NeonBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 50px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 14px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.08);
`;

const TitleHeading = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  line-height: 1.15;
  margin-bottom: 12px;

  span {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const DescText = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const FormContainerWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
`;

const FormBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);

  @media (min-width: 640px) {
    padding: 36px;
  }
`;

const FormHeaderTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
`;

const FormHeaderDesc = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 24px;
`;

const FormFieldsWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.02em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
    background-color: #ffffff !important;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  min-height: 130px;
  resize: vertical;
  transition: all 0.25s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
    background-color: #ffffff !important;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  margin-top: 6px;

  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Message Sent Successfully!",
          text: "Thank you for reaching out to EchoByte Concept. One of our digital specialists will get back to you shortly.",
          icon: "success",
          confirmButtonText: "Done",
          confirmButtonColor: "#6366f1",
          background: "#ffffff",
          color: "#0f172a"
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        throw new Error(data.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while sending your message. Please try again later.",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#6366f1",
        background: "#ffffff",
        color: "#0f172a"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <HeaderBox>
        <NeonBadge>
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Get In Touch With Us</span>
        </NeonBadge>
        <TitleHeading>
          Let’s Build Your <span>Digital Future</span> Together
        </TitleHeading>
        <DescText>
          Whether you are launching a new e-commerce store, need custom web development, or require top-tier digital assets, our expert team is ready to scale your brand.
        </DescText>
      </HeaderBox>

      {/* Main Centered Form Container */}
      <FormContainerWrapper>
        <FormBox>
          <FormHeaderTitle>Send Us a Message</FormHeaderTitle>
          <FormHeaderDesc>
            Fill out the form below and our technical support team will respond within 24 hours.
          </FormHeaderDesc>

          <FormFieldsWrapper onSubmit={handleSubmit}>
            <FieldBlock>
              <StyledLabel htmlFor="name">Full Name</StyledLabel>
              <StyledInput
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FieldBlock>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <FieldBlock>
                <StyledLabel htmlFor="email">Email Address</StyledLabel>
                <StyledInput
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </FieldBlock>

              <FieldBlock>
                <StyledLabel htmlFor="phone">Phone Number</StyledLabel>
                <StyledInput
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                />
              </FieldBlock>
            </div>

            <FieldBlock>
              <StyledLabel htmlFor="message">Your Message</StyledLabel>
              <StyledTextArea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your project, store requirements, or technical goals..."
              />
            </FieldBlock>

            <ActionButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending Message..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </ActionButton>
          </FormFieldsWrapper>
        </FormBox>
      </FormContainerWrapper>
    </PageContainer>
  );
}