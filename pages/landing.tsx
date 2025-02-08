import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { OwlLogo } from '../components/OwlLogo';
import GoogleTranslate from '../components/GoogleTranslate';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

const cyclingWords = ["limitations", "boundaries", "restrictions"];

const testimonials = [
  {
    text: "In our village, the nearby region was caught in conflict, and because of the violence, our school was closed for several months. My son lost his year of schooling, and it affected his future.",
    author: "Asha",
    role: "Parent from Conflict Zone",
    image: "/images/gettyimages-2178594401.jpg.webp"
  },
  {
    text: "At 14, I have been displaced four times due to the Syrian conflict, disrupting my education and leaving me with emotional distress. I dream of returning to school but face the harsh realities of war.",
    author: "Maya",
    role: "Student from Syria",
    image: "/images/image770x420cropped.jpg"
  },
  {
    text: "Our apartment was hit during a missile strike, forcing me to switch to online learning amidst the ongoing conflict. It's hard to focus on studies when you're worried about safety.",
    author: "Danylo",
    role: "Student from Ukraine",
    image: "/images/image1170x530cropped.jpg"
  },
  {
    text: "Due to financial hardships from conflict, I missed six months of schooling. The economic barriers we face in war-torn areas make education seem like a distant dream.",
    author: "Inbarasa",
    role: "Student from Sri Lanka",
    image: "/images/p0hd287j.jpg"
  }
];

export default function Landing() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Vanta effect after scripts are loaded
    const initVanta = () => {
      if (typeof window.VANTA !== 'undefined' && vantaRef.current) {
        window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x0f0f1a,
          colorSecond: 0x1a0b2c,
          shininess: 15.00,
          waveHeight: 20.00,
          waveSpeed: 0.75,
          zoom: 0.85,
          backgroundColor: 0x050508
        })
      }
    }

    // Call initVanta when both scripts are loaded
    if (typeof window.VANTA !== 'undefined') {
      initVanta()
    }

    return () => {
      if (vantaRef.current) {
        // @ts-ignore
        if (vantaRef.current.vanta) {
          // @ts-ignore
          vantaRef.current.vanta.destroy()
        }
      }
    }
  }, [])

  const pageStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, #050505, #130A2A, #0A1229)",
    color: "#F5F5F5",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  const navbarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    backgroundColor: "rgba(15, 15, 20, 0.7)",
    backdropFilter: "blur(20px)",
    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.3), inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.1)",
    position: "fixed",
    top: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "100px",
    maxWidth: "460px",
    width: "90%",
    zIndex: 1000,
    border: "1px solid rgba(255, 255, 255, 0.05)",
  };

  const navLinksStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#E0E0E0",
    fontSize: "1.1rem",
    fontWeight: "600",
  };

  return (
    <div style={pageStyle}>
      {/* Vanta Scripts */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/vanta.waves.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (typeof window.VANTA !== 'undefined' && vantaRef.current) {
            window.VANTA.WAVES({
              el: vantaRef.current,
              mouseControls: false,
              touchControls: false,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x0f0f1a,
              colorSecond: 0x1a0b2c,
              shininess: 15.00,
              waveHeight: 20.00,
              waveSpeed: 0.75,
              zoom: 0.85,
              backgroundColor: 0x050508
            })
          }
        }}
      />

      {/* Vanta Background Container */}
      <div
        ref={vantaRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background: "linear-gradient(145deg, rgba(5, 5, 8, 0.97), rgba(15, 15, 26, 0.95), rgba(26, 11, 44, 0.95))",
        }}
      />

      {/* Navbar */}
      <nav style={{ ...navbarStyle, position: 'relative', zIndex: 2 }}>
        {/* Static OWL logo and text */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))",
          padding: "8px 16px",
          borderRadius: "100px",
          border: "1px solid rgba(124, 58, 237, 0.25)",
        }}>
          <OwlLogo />
          <div style={{
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #FFFFFF, #E9D5FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            textShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
            filter: "drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))",
            position: "relative",
          }}>
            OWL
          </div>
        </div>

        <div style={navLinksStyle}>
          <Link href="/auth">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "rgba(124, 58, 237, 0.05)",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: "100px",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "0.3px",
              }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/auth">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                color: "#FFFFFF",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                transition: "all 0.2s ease",
                letterSpacing: "0.3px",
              }}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          padding: "80px 20px",
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Background gradient effect */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15), transparent 70%)",
            pointerEvents: "none",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            marginTop: "-40px",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.h1 
            style={{ 
              fontSize: "clamp(4.5rem, 9vw, 8rem)",
              color: "#FFFFFF",
              fontWeight: "900",
              lineHeight: "0.9",
              letterSpacing: "-0.03em",
              textAlign: "center",
              maxWidth: "90%",
              marginBottom: "0",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2em",
            }}>
              <div style={{
                display: "flex",
                gap: "0.3em",
                opacity: 0.95,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}>
                <span>Open</span>
                <span>World</span>
              </div>
              <span style={{
                background: "linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                marginTop: "-0.1em",
              }}>
                Learning
              </span>
            </div>
          </motion.h1>

          <motion.p 
            style={{ 
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              color: "#FFFFFF",
              fontWeight: "600",
              maxWidth: "800px",
              lineHeight: "1.3",
              letterSpacing: "-0.01em",
              textAlign: "center",
              padding: "0 20px",
              marginTop: "30px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              height: "60px"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <motion.span
              style={{ 
                display: "inline-block",
                color: "#FFFFFF",
                textShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
                lineHeight: "60px",
                height: "60px",
              }}
            >
              Learn without&nbsp;
            </motion.span>
            {" "}
            <motion.span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minWidth: "250px",
                color: "#BB86FC",
                position: "relative",
                textShadow: "0 0 30px rgba(124, 58, 237, 0.5)",
                height: "60px",
                overflow: "hidden"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={cyclingWords[0]}
            >
              <AnimatedWord words={cyclingWords} />
            </motion.span>
          </motion.p>

          <motion.div 
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "10px",
              width: "100%",
              maxWidth: "560px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
                  color: "#FFFFFF",
                  padding: "16px 36px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                }}
              >
                Get Started
              </motion.button>
            </Link>
            <motion.a
              href="https://bafkreicrpjskcoco23ovvli33f47o4vnfbr7wwjb7pkwr5pn6pfcrcn6tu.ipfs.flk-ipfs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "rgba(124, 58, 237, 0.1)",
                color: "#FFFFFF",
                padding: "16px 36px",
                borderRadius: "12px",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                textDecoration: "none",
                fontSize: "1.2rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      <StatisticsSection />
    </div>
  );
}

function AnimatedWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.span  // Changed from div to span to match parent
      style={{
        background: "linear-gradient(135deg, #BB86FC, #7C3AED)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: "700",
        letterSpacing: "0.5px",
        display: "inline-flex",  // Changed to inline-flex
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <motion.span  // Changed from span to match parent structure
        animate={{
          scale: isAnimating ? [1, 1.1, 1] : 1,
          opacity: isAnimating ? [1, 0.8, 1] : 1
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        {words[index]}
      </motion.span>
    </motion.span>
  );
}

function StatisticsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(472015423);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVisible) {
      interval = setInterval(() => {
        setCount(prevCount => prevCount + 10);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      style={{
        padding: "120px 20px",
        background: "linear-gradient(145deg, #050505 30%, #130A2A 60%, #0A1229 90%)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(124, 58, 237, 0.1)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
    >
      {/* Update the background orbs to match theme */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(19, 10, 42, 0.15) 0%, transparent 70%)",
        top: "-300px",
        left: "-300px",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute",
        width: "800px",
        height: "800px",
        background: "radial-gradient(circle, rgba(10, 18, 41, 0.1) 0%, transparent 70%)",
        bottom: "-400px",
        right: "-400px",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Statistics */}
        <motion.div style={{ marginBottom: "80px" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: "2rem",
              color: "#BB86FC",
              marginBottom: "20px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "4px",
              background: "linear-gradient(135deg, #BB86FC, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
            }}
          >
            more than
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
              fontWeight: "800",
              background: "linear-gradient(135deg, #FFFFFF 30%, #BB86FC 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "30px",
              lineHeight: "1.2",
              fontFamily: "'Inter', sans-serif",
              textShadow: "0 0 40px rgba(187, 134, 252, 0.4)",
              padding: "20px 0",
              position: "relative"
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: -1,
            }} />
            {isVisible && count.toLocaleString()}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <motion.p
              style={{
                fontSize: "2rem",
                background: "linear-gradient(135deg, #FFFFFF 30%, #BB86FC 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: "1.4",
                fontWeight: "600",
                letterSpacing: "1px",
                textAlign: "center",
                padding: "0 20px",
                textTransform: "uppercase",
                textShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
              }}
            >
              are suffering globally
            </motion.p>
            <motion.p
              style={{
                fontSize: "2rem",
                background: "linear-gradient(135deg, #FFFFFF 30%, #BB86FC 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: "1.4",
                fontWeight: "600",
                letterSpacing: "1px",
                textAlign: "center",
                padding: "0 20px",
                textTransform: "uppercase",
                textShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
              }}
            >
              due to wars and conflicts
            </motion.p>
          </motion.div>

          {/* Add pulsing effect behind the number */}
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)",
              zIndex: -1,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Testimonials Carousel */}
        <div style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 0",
          position: "relative",
        }}>
          <div style={{
            overflow: "hidden",
            width: "100%",
          }}>
            <motion.div
              style={{
                display: "flex",
                width: "100%",
              }}
              animate={{
                x: `-${currentTestimonial * 100}%`
              }}
              transition={{
                duration: 0.7,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  style={{
                    width: "100%",
                    flex: "none",
                    padding: "0 20px",
                  }}
                >
                  <div style={{
                    background: "rgba(124, 58, 237, 0.08)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                  }}>
                    {/* Image Ribbon */}
                    <div style={{
                      width: "100%",
                      height: "200px",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={600}
                        height={300}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(to top, rgba(13, 12, 34, 1), transparent)",
                      }} />
                    </div>

                    {/* Content Section */}
                    <div style={{
                      padding: "24px",
                      background: "rgba(13, 12, 34, 0.8)",
                      backdropFilter: "blur(10px)",
                    }}>
                      <p style={{
                        fontSize: "1.1rem",
                        color: "#FFFFFF",
                        lineHeight: "1.6",
                        fontStyle: "italic",
                        marginBottom: "20px",
                      }}>
                        {testimonial.text}
                      </p>

                      <div style={{
                        borderTop: "1px solid rgba(124, 58, 237, 0.2)",
                        paddingTop: "16px",
                      }}>
                        <p style={{
                          color: "#BB86FC",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          marginBottom: "4px",
                        }}>
                          {testimonial.author}
                        </p>
                        <p style={{
                          color: "#A0A0A0",
                          fontSize: "0.9rem",
                        }}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress Dots */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
          }}>
            {testimonials.map((_, index) => (
              <motion.div
                key={index}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: currentTestimonial === index 
                    ? "#BB86FC" 
                    : "rgba(187, 134, 252, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
} 