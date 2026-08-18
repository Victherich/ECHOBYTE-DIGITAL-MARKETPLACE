"use client";

import styled from "styled-components";
import Link from "next/link";
import { Zoom, Fade } from "react-awesome-reveal";

/* ================= COLORS & THEME ================= */

const Blue = "#6366f1";
const Purple = "#a855f7";
const bluePurpleGradient = "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
const Dark = "#0f172a";
const TextMuted = "#64748b";
const Border = "#e2e8f0";
const White = "#ffffff";
const LightBg = "#f8fafc";

/* ================= STYLED COMPONENTS ================= */

const AboutPageWrapper = styled.div`
  font-family: inherit;
  color: ${Dark};
  background: ${White};
  overflow-x: hidden;
`;

/* --- Hero Section --- */
const HeroSection = styled.section`
  position: relative;
  height: 60vh;
  min-height: 400px;
  background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
    url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop")
      no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
`;

const HeroContent = styled.div`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2;
`;

const HeroBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${White};
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  margin: 0 auto;
  backdrop-filter: blur(8px);
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 800;
  color: ${White};
  line-height: 1.2;

  span {
    background: ${bluePurpleGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  color: #cbd5e1;
  line-height: 1.6;
`;

/* --- Mission & Vision Section --- */
const MissionVisionSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 50px 20px;
  }
`;

const InfoCard = styled.div`
  background: ${LightBg};
  border: 1px solid ${Border};
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.08);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${Dark};
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      color: ${Blue};
    }
  }

  p {
    color: ${TextMuted};
    line-height: 1.7;
    font-size: 1rem;
  }
`;

/* --- Story Section --- */
const StorySection = styled.section`
  background: ${LightBg};
  padding: 80px 20px;
  border-top: 1px solid ${Border};
  border-bottom: 1px solid ${Border};
`;

const StoryContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 800;
  color: ${Dark};

  span {
    background: ${bluePurpleGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const StoryText = styled.p`
  font-size: 1.05rem;
  color: ${TextMuted};
  line-height: 1.8;
  max-width: 850px;
  margin: 0 auto;
`;

/* --- Why Choose Us Grid --- */
const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const FeaturesHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${White};
  border: 1px solid ${Border};
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;

  &:hover {
    border-color: ${Blue};
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
  }

  .icon-box {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: rgba(99, 102, 241, 0.1);
    color: ${Blue};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: bold;
  }

  h4 {
    font-size: 1.15rem;
    font-weight: 700;
    color: ${Dark};
  }

  p {
    font-size: 0.95rem;
    color: ${TextMuted};
    line-height: 1.6;
  }
`;

/* --- CTA Section --- */
const CtaSection = styled.section`
  background: ${bluePurpleGradient};
  padding: 80px 20px;
  text-align: center;
  color: ${White};
  margin-bottom: 40px;
  border-radius: 20px;
  max-width: 1140px;
  margin: 40px auto;

  @media (max-width: 768px) {
    border-radius: 0;
    margin: 0;
  }
`;

const CtaContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  h2 {
    font-size: clamp(2rem, 3vw, 2.8rem);
    font-weight: 800;
  }

  p {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
  }
`;

const CtaButton = styled(Link)`
  background: ${White};
  color: ${Blue};
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

/* ================= COMPONENT ================= */

export default function AboutPage() {
  return (
    <AboutPageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <Fade triggerOnce>
          <HeroContent>
            <HeroBadge>About EchoByte Concept</HeroBadge>
            <HeroTitle>
              Empowering Your <span>Digital Future</span> With Excellence
            </HeroTitle>
            <HeroSubtitle>
              We provide cutting-edge web development, high-performance digital store assets, and innovative tech solutions designed to scale your brand to new heights.
            </HeroSubtitle>
          </HeroContent>
        </Fade>
      </HeroSection>

      {/* Mission & Vision Section */}
      <MissionVisionSection>
        <Zoom triggerOnce direction="left">
          <InfoCard>
            <h3>
              <span>🎯</span> Our Mission
            </h3>
            <p>
              To bridge the gap between businesses and premium digital technology by delivering lightning-fast, secure, and user-centric web applications and digital assets that drive real-world results.
            </p>
          </InfoCard>
        </Zoom>

        <Zoom triggerOnce direction="right">
          <InfoCard>
            <h3>
              <span>🚀</span> Our Vision
            </h3>
            <p>
              To become a leading global powerhouse in digital innovation, recognized for transforming creative concepts into robust, scalable, and intuitive digital ecosystems for entrepreneurs and enterprises.
            </p>
          </InfoCard>
        </Zoom>
      </MissionVisionSection>

      {/* Story Section */}
      <StorySection>
        <Fade triggerOnce>
          <StoryContainer>
            <SectionTitle>
              The <span>EchoByte</span> Story
            </SectionTitle>
            <StoryText>
              Founded in Lagos, Nigeria, EchoByte Concept started with a clear vision: to simplify high-end digital transformation for businesses of all sizes. What began as a passionate team of web developers and tech entrepreneurs has expanded into a full-service digital solution hub. We specialize in custom web architectures, e-commerce stores, and high-performance digital products engineered to elevate modern brands in a competitive digital landscape.
            </StoryText>
          </StoryContainer>
        </Fade>
      </StorySection>

      {/* Why Choose Us Section */}
      <FeaturesSection>
        <FeaturesHeader>
          <SectionTitle>
            Why Partner With <span>Us?</span>
          </SectionTitle>
          <p style={{ color: TextMuted, fontSize: "1.05rem" }}>
            Here is what makes EchoByte Concept the ultimate choice for your digital journey.
          </p>
        </FeaturesHeader>

        <FeaturesGrid>
          <FeatureCard>
            <div className="icon-box">⚡</div>
            <h4>Lightning Fast Delivery</h4>
            <p>We optimize every workflow and codebase to guarantee top-tier speed, seamless performance, and rapid project deployment.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-box">🛡️</div>
            <h4>Secure & Reliable</h4>
            <p>Built with enterprise-grade security practices, robust authentication, and dependable cloud database integrations.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-box">💡</div>
            <h4>Innovative Solutions</h4>
            <p>From dynamic e-commerce platforms to custom React & Next.js applications, we integrate state-of-the-art technology stack.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-box">🎨</div>
            <h4>Modern UI/UX Design</h4>
            <p>Clean, visually stunning interfaces paired with styled-components to offer your users an unforgettable digital experience.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-box">🤝</div>
            <h4>Dedicated Support</h4>
            <p>Our technical support team is always ready to guide you through setup, maintenance, and store expansion.</p>
          </FeatureCard>

          <FeatureCard>
            <div className="icon-box">📈</div>
            <h4>Scalable Growth</h4>
            <p>Our solutions are designed to scale effortlessly alongside your business as your customer base and inventory grow.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA Section */}
      <CtaSection>
        <CtaContainer>
          <h2>Ready to Transform Your Digital Presence?</h2>
          {/* <p>Explore our digital store or get in touch with us today to start building your next high-performance project.</p> */}
          <CtaButton href="/login">Start Selling</CtaButton>
        </CtaContainer>
      </CtaSection>
    </AboutPageWrapper>
  );
}