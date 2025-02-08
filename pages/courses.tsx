import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { courses } from '../data/courses';
import { CourseIcons } from '../components/CourseIcons';
import ChatWidget from '../src/components/ChatWidget';
import { Footer } from '../components/Footer';
import { OwlLogo } from '../components/OwlLogo';
import { isCourseCompleted, markCourseCompleted } from '../utils/courseUtils';
import { useMediaQuery } from 'react-responsive';
import { AnimatePresence } from 'framer-motion';

const coursePrice = "0.01"; // Price in ETH

// Add a new type for storing purchases with addresses
interface PurchaseData {
  [courseTitle: string]: {
    purchased: boolean;
    address: string;
    transactionHash?: string;
    purchaseDate?: string;
  };
}

// Add at the top after imports
const certificateUrls: { [key: string]: string } = {
  "AI Mastery": "https://bafkreic33ckqkmyorr2fer2dmfwcn55vmj4dkdlol7fertqjh5bkt5eige.ipfs.flk-ipfs.xyz",
  "Unlocking World History": "https://bafkreiakyzijtrvqzpqltklhmyeji5vnffsan73sdggtrkobp2hjjitvxq.ipfs.flk-ipfs.xyz"
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

const HamburgerIcon = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
      zIndex: 1001,
      position: 'relative',
    }}
  >
    <motion.div
      style={{
        width: '24px',
        height: '3px',
        background: isOpen ? 'transparent' : '#E0E0E0',
        position: 'relative',
        transformOrigin: 'center',
        transition: 'background 0.2s ease',
      }}
    >
      <motion.div
        style={{
          width: '24px',
          height: '3px',
          background: '#E0E0E0',
          position: 'absolute',
          top: '-8px',
          transformOrigin: 'center',
        }}
        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        style={{
          width: '24px',
          height: '3px',
          background: '#E0E0E0',
          position: 'absolute',
          bottom: '-8px',
          transformOrigin: 'center',
        }}
        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  </motion.button>
);

// Add these style definitions after the logoStyle definition and before the formatAddress function
const navLinksStyle: React.CSSProperties = {
  display: "flex",
  gap: "40px",
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#E0E0E0",
  fontSize: "1.1rem",
  fontWeight: "500",
  cursor: "pointer",
  textDecoration: "none",
  position: "relative",
  letterSpacing: "0.5px",
  padding: "8px 0",
  transition: "color 0.3s ease",
};

export default function Courses() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Waiting for MetaMask...");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [unlockedCourses, setUnlockedCourses] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<'all' | 'free' | 'paid' | 'deaf'>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    async function initializeProvider() {
      if (typeof window !== "undefined" && window?.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(browserProvider);

          // Check if already connected
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            const signerInstance = await browserProvider.getSigner();
            setSigner(signerInstance);
            setAccount(accounts[0]);
            setStatus(`Connected: ${accounts[0]}`);
            checkLocalStoragePurchase();
          } else {
            setStatus("MetaMask detected. Please connect.");
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', () => window.location.reload());

        } catch (error) {
          console.error("Provider initialization failed:", error);
          setStatus("Failed to initialize MetaMask.");
        }
      } else {
        setStatus("MetaMask not detected. Please install it.");
      }
    }

    initializeProvider();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isHydrated]);

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount(null);
      setSigner(null);
      setStatus("Please connect MetaMask.");
    } else {
      // Account changed
      const newAccount = accounts[0];
      setAccount(newAccount);
      if (provider) {
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
      }
      setStatus(`Connected: ${newAccount}`);
      checkLocalStoragePurchase();
    }
  };

  function checkLocalStoragePurchase() {
    if (!isHydrated || !account) {
      setUnlockedCourses({});
      return;
    }

    try {
      const purchaseData: PurchaseData = JSON.parse(localStorage.getItem("purchasedCourses") || "{}");
      
      const unlockedCoursesForAddress = Object.keys(purchaseData).reduce((acc, courseTitle) => {
        acc[courseTitle] = purchaseData[courseTitle].address === account;
        return acc;
      }, {} as { [key: string]: boolean });

      setUnlockedCourses(unlockedCoursesForAddress);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setUnlockedCourses({});
    }
  }

  useEffect(() => {
    if (isClient && account) {
      checkLocalStoragePurchase();
    }
  }, [isClient, account]);

  useEffect(() => {
    if (isHydrated && !account) {
      setUnlockedCourses({});
    }
  }, [account, isHydrated]);

  async function buyCourse(courseTitle: string) {
    if (!provider) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    }

    if (!signer || !account) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          const signerInstance = await provider!.getSigner();
          setSigner(signerInstance);
          setAccount(accounts[0]);
          // Continue with transaction after connecting
          processPurchaseTransaction(courseTitle, signerInstance, accounts[0]);
        }
      } catch (error) {
        console.error("Failed to connect:", error);
        setStatus("Please connect MetaMask first.");
        return;
      }
    } else {
      // Already connected, proceed with transaction
      processPurchaseTransaction(courseTitle, signer, account);
    }
  }

  async function processPurchaseTransaction(courseTitle: string, signer: ethers.JsonRpcSigner, account: string) {
    const course = courses.find(c => c.title === courseTitle);
    if (!course || !course.isPaid) return;

    setStatus("Initiating transaction...");

    try {
      const network = await provider?.getNetwork();
      console.log("Current network:", network?.name);

      const tx = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        value: ethers.parseEther(coursePrice),
        gasLimit: ethers.toBigInt("100000"),
      };

      console.log("Transaction details:", tx);

      const transaction = await signer.sendTransaction(tx)
        .catch((err) => {
          console.error("Transaction error:", err);
          if (err.code === 4001 || err.code === "ACTION_REJECTED") {
            setNotificationMessage("Transaction cancelled by user");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
            return Promise.reject(new Error("Transaction cancelled"));
          }
          return Promise.reject(err);
        });

      if (!transaction) return;

      setStatus("Course purchased successfully!");
      
      const existingData: PurchaseData = JSON.parse(localStorage.getItem("purchasedCourses") || "{}");
      const updatedData = {
        ...existingData,
        [courseTitle]: {
          purchased: true,
          address: account,
          transactionHash: transaction.hash,
          purchaseDate: new Date().toISOString()
        }
      };
      localStorage.setItem("purchasedCourses", JSON.stringify(updatedData));
      
      setUnlockedCourses(prev => ({
        ...prev,
        [courseTitle]: true
      }));

    } catch (error: any) {
      console.error("Detailed error:", error);
      if (error.message !== "Transaction cancelled") {
        const errorMessage = error.reason || error.message || "Transaction failed";
        setStatus("Transaction failed. Please try again.");
        setNotificationMessage(errorMessage);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }
  }

  if (!isClient || !isHydrated) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(145deg, #050505, #130A2A, #0A1229)",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(124, 58, 237, 0.2)",
            borderTop: "3px solid #7C3AED",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'free') return !course.isPaid;
    if (filter === 'paid') return course.isPaid;
    return course.category === 'deaf';
  });

  const pageStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, #050505, #130A2A, #0A1229)",
    color: "#F5F5F5",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2rem",
    background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
    letterSpacing: "0.5px",
  };

  const formatAddress = (address: string) => {
    // console.log(address);
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "20px" : "40px 60px",
          height: isMobile ? "80px" : "120px",
          backgroundColor: "rgba(5, 5, 5, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}>
          {/* Left Side - Logo and Platform Name */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <OwlLogo />
            {!isMobile && (
              <div style={{
                fontSize: "2rem",
                background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "800",
              }}>
                Owl: Open World Learning
              </div>
            )}
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && !isMobileMenuOpen && (
            <HamburgerIcon 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={navLinksStyle}>
              {[
                { label: "Home", path: "/home" },
                { label: "Library", path: "/library" },
                { label: "Courses", path: "/courses" },
                { label: "Roadmap", path: "/roadmap" },
                { label: "Jobs", path: "/jobs" },
                { label: "About", path: "/about" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  href={item.path}
                  style={linkStyle}
                >
                  <motion.div
                    whileHover="hover"
                    initial="initial"
                    variants={{
                      initial: { color: "#E0E0E0" },
                      hover: { color: "#FFFFFF" }
                    }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              ))}
              {/* MetaMask Button */}
              {account ? (
                <motion.div
                  style={{
                    background: "linear-gradient(145deg, rgba(19, 10, 42, 0.9), rgba(5, 5, 5, 0.9))",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#4CAF50",
                    borderRadius: "50%",
                  }} />
                  {formatAddress(account)}
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => {
                    if (typeof window !== "undefined" && window?.ethereum) {
                      window.ethereum.request({
                        method: 'eth_requestAccounts'
                      });
                    }
                  }}
                  style={{
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    opacity: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.2)" }}
                >
                  Connect Wallet
                </motion.button>
              )}
            </div>
          )}

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobile && isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(5, 5, 5, 0.98)",
                  backdropFilter: "blur(12px)",
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  width: '100vw',
                  overflowY: 'auto',
                }}
              >
                {/* Close button */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 1002,
                }}>
                  <HamburgerIcon 
                    isOpen={isMobileMenuOpen} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                <div style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '0 30px',
                }}>
                  {/* Mobile Navigation Links */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px",
                    marginBottom: "40px",
                    width: '100%',
                  }}>
                    {[
                      { label: "Home", path: "/home" },
                      { label: "Library", path: "/library" },
                      { label: "Courses", path: "/courses" },
                      { label: "Roadmap", path: "/roadmap" },
                      { label: "Jobs", path: "/jobs" },
                      { label: "About", path: "/about" },
                      { label: "Profile", path: "/profile" }
                    ].map((item, index) => (
                      <Link 
                        key={index}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          color: "#E0E0E0",
                          textDecoration: "none",
                          fontSize: "2rem",
                          fontWeight: "600",
                          padding: "10px 0",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(124, 58, 237, 0.1)",
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Wallet Section */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '20px',
                    background: "rgba(124, 58, 237, 0.1)",
                    borderRadius: "12px",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    marginBottom: '30px',
                  }}>
                    {account ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                      }}>
                        <div style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: "#4CAF50",
                          borderRadius: "50%",
                        }} />
                        <span style={{ color: '#E0E0E0', fontSize: '1.2rem' }}>
                          {formatAddress(account)}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined" && window?.ethereum) {
                            window.ethereum.request({
                              method: 'eth_requestAccounts'
                            });
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        style={{
                          background: "rgba(124, 58, 237, 0.2)",
                          border: "1px solid rgba(124, 58, 237, 0.3)",
                          color: "#E0E0E0",
                          padding: "12px",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

      <main style={{ padding: "60px 80px" }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: "60px",
          gap: isMobile ? "30px" : "0",
        }}>
          <motion.h1 
            style={{ 
              fontSize: isMobile ? "2.8rem" : "3.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #FFFFFF, #BB86FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: isMobile ? "center" : "left",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Courses
          </motion.h1>

          {/* Filter Section */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "10px" : "15px",
            background: "rgba(19, 10, 42, 0.6)",
            padding: isMobile ? "10px" : "8px",
            borderRadius: "12px",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            width: isMobile ? "100%" : "auto",
          }}>
            {[
              { label: "All Courses", value: 'all' },
              { label: "Free Courses", value: 'free' },
              { label: "Paid Courses", value: 'paid' },
              { label: "Sign Language Courses", value: 'deaf' }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setFilter(option.value as 'all' | 'free' | 'paid' | 'deaf')}
                style={{
                  padding: isMobile ? "16px" : "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  width: isMobile ? "100%" : "auto",
                  background: filter === option.value ? 
                    "linear-gradient(135deg, #7C3AED, #3B82F6)" : 
                    "transparent",
                  color: filter === option.value ? "#FFFFFF" : "#E0E0E0",
                  transition: "all 0.3s ease",
                }}
                whileHover={{
                  backgroundColor: filter === option.value ? 
                    undefined : 
                    "rgba(124, 58, 237, 0.1)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <motion.div 
          style={{ 
            display: "grid",
            gridTemplateColumns: isMobile ? 
              "1fr" : 
              "repeat(auto-fit, minmax(350px, 1fr))",
            gap: isMobile ? "30px" : "40px",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: isMobile ? "0 20px" : "0 20px",
            justifyItems: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredCourses.map((course) => (
            <motion.div
              key={course.title}
              style={{
                background: "linear-gradient(145deg, rgba(19, 10, 42, 0.9), rgba(5, 5, 5, 0.9))",
                borderRadius: "24px",
                padding: "30px",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "500px",
                minWidth: "350px",
                maxWidth: "450px",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {/* Icon Section */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
                height: "64px",
              }}>
                {CourseIcons[course.icon as keyof typeof CourseIcons]?.()}
              </div>

              {/* Title and Badges Section */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "15px",
                marginBottom: "20px",
                height: "auto",
              }}>
                <h3 style={{ 
                  fontSize: "1.6rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  margin: 0,
                  flex: "1",
                  lineHeight: "1.3",
                }}>
                  {course.title}
                </h3>
                <div style={{ 
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                  flexDirection: "column",
                }}>
                  {course.category === 'deaf' && (
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                      color: "#FFFFFF",
                      whiteSpace: "nowrap",
                    }}>
                      Sign Language
                    </span>
                  )}
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    background: course.isPaid ? 
                      "linear-gradient(135deg, #7C3AED, #3B82F6)" : 
                      "linear-gradient(135deg, #059669, #10B981)",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}>
                    {course.isPaid ? "Premium" : "Free"}
                  </span>
                </div>
              </div>

              {/* Description and Details Section */}
              <div style={{
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}>
                <div style={{
                  marginBottom: "20px",
                }}>
                  <p style={{
                    fontSize: "1rem",
                    color: "#E0E0E0",
                    opacity: 0.9,
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    lineHeight: "1.5",
                    height: "3em",
                  }}>
                    {course.description}
                  </p>
                </div>

                <div style={{
                  color: "#BB86FC",
                  fontSize: "0.95rem",
                  marginTop: "auto",
                  borderTop: "1px solid rgba(124, 58, 237, 0.2)",
                  paddingTop: "15px",
                  marginBottom: "25px",
                }}>
                  <p style={{ margin: "5px 0" }}>Duration: {course.duration}</p>
                  <p style={{ margin: "5px 0" }}>Instructor: {course.instructor}</p>
                </div>
              </div>

              {/* Add this before the Access/Unlock Course button */}
              {course.id && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: '#E0E0E0',
                    fontSize: '0.9rem',
                  }}>
                    <input
                      type="checkbox"
                      checked={isCourseCompleted(course.id)}
                      onChange={() => markCourseCompleted(course.id, !isCourseCompleted(course.id))}
                      style={{ cursor: 'pointer' }}
                    />
                    Mark as completed
                  </label>

                  {course.isPaid && isCourseCompleted(course.id) && certificateUrls[course.title] && (
                    <motion.a
                      href={certificateUrls[course.title]}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        color: '#7C3AED',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>📜</span>
                      Download Certificate
                    </motion.a>
                  )}
                </div>
              )}

              {/* Button Section */}
              <div style={{
                marginTop: "auto",
                width: "100%",
                height: "48px",
              }}>
                {course.isPaid && !unlockedCourses[course.title] ? (
                  <motion.button
                    onClick={() => buyCourse(course.title)}
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
                      color: "#FFFFFF",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    whileHover={{ 
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 15px rgba(124, 58, 237, 0.3)",
                    }}
                    whileTap={{ transform: "translateY(0px)" }}
                  >
                    Unlock Course
                  </motion.button>
                ) : (
                  <Link 
                    href={`/courses/${course.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "12px 20px",
                      background: "linear-gradient(135deg, #059669, #10B981)",
                      color: "#FFFFFF",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                    }}
                  >
                    Access Course
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Notification Popup */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            padding: "16px 24px",
            background: "rgba(220, 38, 38, 0.95)", // Red background for error
            color: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Error Icon */}
          <div style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}>
            ❌
          </div>
          {notificationMessage}
        </motion.div>
      )}
      <ChatWidget />
    </div>
  );
}