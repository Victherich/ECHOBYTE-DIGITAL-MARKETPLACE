import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Fade, Slide, Zoom } from 'react-awesome-reveal';
import LandingProductsSection from '@/components/LandingProductsSection';
import Link from 'next/link';
import HeroSection2 from '@/components/Hero';


// --- THEME & ANIMATIONS ---
const primaryBlue = '#2563eb';
const primaryPurple = '#9333ea';
const bluePurpleGradient = 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)';
const accentGradient = 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// --- DATA CONTEXT (Echobyte Digital Store Marketplace Content) ---
const landingData = {
  hero: {
    badge: "The Ultimate Multi-Vendor Digital Marketplace",
    title: "Buy & Sell Digital Products With Your Own Storefront",
    description: "Welcome to Echobyte Digital Store. Anyone can create an account, open a personal storefront, and instantly buy or sell e-books, software, graphics, courses, and templates.",
    primaryCta: "Explore Marketplace",
    secondaryCta: "Start Selling",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  },
  stats: [
    { label: "Active Creators", value: "1,200+" },
    { label: "Digital Assets", value: "8,500+" },
    { label: "Successful Sales", value: "25,000+" },
    { label: "Global Buyers", value: "10,000+" }
  ],
  services: [
    {
      title: "Personal Storefronts",
      desc: "Every registered user gets a dedicated, customizable store link to showcase and manage their digital catalog.",
      icon: "🏪"
    },
    {
      title: "Instant Digital Delivery",
      desc: "Automated secure file delivery right after checkout ensures buyers get immediate access to purchases.",
      icon: "⚡"
    },
    {
      title: "Secure Multi-Vendor Payouts",
      desc: "Reliable transaction processing protecting both creators and buyers with instant settlement systems.",
      icon: "🔒"
    }
  ],

  process: [
    { step: "01", title: "Create Your Account", desc: "Sign up in seconds to unlock your seller dashboard and storefront, you can sell and also buy from the same dashboard." },
    { step: "02", title: "Post Digital Products and Services", desc: "Post e-books, templates, graphics, audios, videos, meeting links, communities links, coaching links and set your prices." },
    { step: "03", title: "Share Your Store Link", desc: "Promote your personal storefront across your social networks." },
    { step: "04", title: "Earn & Scale", desc: "Get paid directly into your bank account for every purchase you make while we the platform handles automatic delivery and security." }
  ],
  testimonials: [
    {
      quote: "Echobyte Digimart Store made it so easy to set up my template shop. I launched my store and made my first sale within 24 hours!",
      author: "Daniel Adebayo",
      role: "UI/UX Creator"
    },
    {
      quote: "As a buyer, finding high-quality developer tools and e-books in one place with instant download is a complete game-changer.",
      author: "Chidinma Okoro",
      role: "Software Developer"
    }
  ],
  ctaBanner: {
    title: "Ready to Launch Your Digital Business?",
    subtitle: "Join thousands of creators buying and selling top-tier digital assets on Echobyte Digi-Mart today.",
    buttonText: "Open Your Store Now"
  }
};

// --- STYLED COMPONENTS WITH SUBTLE SHADES & DEPTH ---
const LandingContainer = styled.div`
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
  // background:red;
  color: #0F172A;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
  // padding: 10px;
  max-width: 1440px;
  // margin: 0 auto;
  box-sizing: border-box;
`;

const Badge = styled.span`
  background: ${accentGradient};
  color: #FFFFFF;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  margin: 0;
  padding: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 0;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #FFFFFF;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);

  @media(max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid rgba(147, 51, 234, 0.2);
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.04);
`;

const StatValue = styled.h3`
  font-size: 24px;
  font-weight: 800;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: #64748B;
  margin: 4px 0 0 0;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
  padding: 0 10px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 4px 0 0 0;
`;

const ServicesSection = styled.section`
  background: #FFFFFF;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: #F8FAFC;
  border-radius: 6px;
  border: 1px solid rgba(37, 99, 235, 0.08);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  transition: transform 0.2s ease, background 0.2s ease;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    background: #FFFFFF;
  }
`;

const ServiceIconContainer = styled.div`
  font-size: 32px;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #EEF2F6;
  border-radius: 6px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${primaryBlue};
  margin: 0;
`;

const CardDesc = styled.p`
  font-size: 12px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
`;

const ProcessSection = styled.section`
  background: #FFFFFF;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessCard = styled.div`
  background: #F8FAFC;
  border: 1px solid rgba(37, 99, 235, 0.08);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  height: 100%;
  box-sizing: border-box;
`;

const StepNumber = styled.div`
  font-size: 18px;
  font-weight: 900;
  background: ${bluePurpleGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TestimonialSection = styled.section`
  background: #FFFFFF;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: #F8FAFC;
  border: 1px solid rgba(147, 51, 234, 0.2);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.05);
  height: 100%;
  box-sizing: border-box;
`;

const Quote = styled.p`
  font-size: 13px;
  font-style: italic;
  color: #334155;
  margin: 0;
  line-height: 1.5;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
`;

const AuthorName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${primaryBlue};
`;

const AuthorRole = styled.span`
  font-size: 10px;
  color: ${primaryPurple};
  font-weight: 600;
`;

const CtaBannerSection = styled.section`
  background: ${bluePurpleGradient};
  color: #FFFFFF;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.3);
`;

const CtaTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CtaSubtitle = styled.p`
  font-size: 13px;
  color: #E2E8F0;
  max-width: 600px;
  margin: 0;
`;

const CtaButton = styled.button`
  background: #FFFFFF;
  color: ${primaryBlue};
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ViewMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  & > a {
    background: ${bluePurpleGradient};
    color: #FFFFFF;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }
  }
`;

export default function CompleteLandingPage() {
  return (
    <>
      <HeroSection2 />
      <LandingContainer>
        {/* 2. STATS SECTION */}
        <Fade direction="up" triggerOnce style={{ display: 'contents' }}>
          <StatsSection>
            {landingData.stats.map((stat, idx) => (
              <StatCard key={idx}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsSection>
        </Fade>

        {/* 5. PROCESS SECTION */}
        <ProcessSection>
          <SectionHeader>
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle>Start your digital storefront and make sales in four simple steps.</SectionSubtitle>
          </SectionHeader>
          <ProcessGrid>
            {landingData.process.map((item, idx) => (
              <Fade direction="up" delay={idx * 100} triggerOnce key={idx} style={{ display: 'contents' }}>
                <ProcessCard>
                  <StepNumber>{item.step}</StepNumber>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDesc>{item.desc}</CardDesc>
                </ProcessCard>
              </Fade>
            ))}
          </ProcessGrid>
          <ViewMoreContainer>
            <Link href="/signup">
              Open Your Store →
            </Link>
          </ViewMoreContainer>
        </ProcessSection>



        {/* 3. SERVICES / FEATURES SECTION (Using Emojis instead of Images) */}
        {/* <ServicesSection>
          <SectionHeader>
            <SectionTitle>Features</SectionTitle>
            <SectionSubtitle>Everything you need to buy and sell digital products seamlessly.</SectionSubtitle>
          </SectionHeader>
          <ServicesGrid>
            {landingData.services.map((service, idx) => (
              <Slide direction="up" delay={idx * 100} triggerOnce key={idx} style={{ display: 'contents' }}>
                <ServiceCard>
                  <ServiceIconContainer>{service.icon}</ServiceIconContainer>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDesc>{service.desc}</CardDesc>
                </ServiceCard>
              </Slide>
            ))}
          </ServicesGrid>

          <ViewMoreContainer>
            <Link href="/store">
              Explore Digital Stores →
            </Link>
          </ViewMoreContainer>
        </ServicesSection> */}


        {/* 4. E-COMMERCE PRODUCTS SECTION */}
        {/* <LandingProductsSection /> */}

        

        {/* 6. TESTIMONIALS SECTION */}
        <TestimonialSection>
          <SectionHeader>
            <SectionTitle>Creator Success Stories</SectionTitle>
            <SectionSubtitle>Hear what our community of buyers and sellers has to say.</SectionSubtitle>
          </SectionHeader>
          <TestimonialGrid>
            {landingData.testimonials.map((test, idx) => (
              <Fade direction={idx % 2 === 0 ? "left" : "right"} triggerOnce key={idx} style={{ display: 'contents' }}>
                <TestimonialCard>
                  <Quote>"{test.quote}"</Quote>
                  <AuthorInfo>
                    <AuthorName>{test.author}</AuthorName>
                    <AuthorRole>{test.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialCard>
              </Fade>
            ))}
          </TestimonialGrid>
        </TestimonialSection>

        {/* 7. CTA BANNER SECTION */}
        <Fade direction="up" triggerOnce style={{ display: 'contents' }}>
          <CtaBannerSection>
            <CtaTitle>{landingData.ctaBanner.title}</CtaTitle>
            <CtaSubtitle>{landingData.ctaBanner.subtitle}</CtaSubtitle>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <CtaButton>{landingData.ctaBanner.buttonText}</CtaButton>
            </Link>
          </CtaBannerSection>
        </Fade>
      </LandingContainer>
    </>
  );
}