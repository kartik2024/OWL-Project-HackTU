import { ethers } from "ethers";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, LazyMotion, domAnimation, m } from "framer-motion";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { AnimatePresence } from 'framer-motion';

const OwlLogo = memo(() => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "15px" }}>
    <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="url(#paint0_linear)"/>
    <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm-2 16c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" fill="url(#paint1_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED"/>
        <stop offset="1" stopColor="#A78BFA"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED"/>
        <stop offset="1" stopColor="#A78BFA"/>
      </linearGradient>
    </defs>
  </svg>
));
OwlLogo.displayName="OwlLogo";


const bookPrice = "0.01"; // Price in ETH

// First, let's define the book type interface
interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  isPaid: boolean;
  price: string;
  pdfUrl: string;
  isAudio: boolean;
}

// Updated Book Metadata with random authors
const books: Book[] = [
  {
    id: 1,
    title: "Web3 Fundamentals and AI",
    author: "Dr. Sarah Chen",
    coverImage: "/images/web3-ai.jpg",
    description: "Learn the fundamentals of Web3 technology and artificial intelligence in this comprehensive guide.",
    isPaid: false,
    price: "0",
    pdfUrl: "https://bafkreig2bq3xytioly7hxavyeaadys3ofzduk54ys5nyjehp5o4t3xyjfa.ipfs.flk-ipfs.xyz",
    isAudio: false
  },
  {
    id: 2,
    title: "Rise Above All",
    author: "Michael J. Thompson",
    coverImage: "/images/rise-above.jpg", 
    description: "A guide to personal development and achieving your goals through self-motivation.",
    isPaid: false,
    price: "0",
    pdfUrl: "https://bafkreig2bq3xytioly7hxavyeaadys3ofzduk54ys5nyjehp5o4t3xyjfa.ipfs.flk-ipfs.xyz",
    isAudio: false
  },
  {
    id: 3,
    title: "Introduction to Blockchain",
    author: "Prof. Alex Rivera",
    coverImage: "/images/blockchain-intro.jpg",
    description: "Discover the fundamentals of blockchain technology and its applications.",
    isPaid: true,
    price: "0.01",
    pdfUrl: "https://bafkreibouwloe52wmdse4qiq3wkmumdx36hxqrmohrsyte5vgvjthjf5pu.ipfs.flk-ipfs.xyz",
    isAudio: false
  },
  {
    id: 4,
    title: "Understanding AI Networks",
    author: "Dr. Emily Watson",
    coverImage: "/images/ai-networks.jpg",
    description: "An in-depth look at artificial intelligence networks and their implementation.",
    isPaid: true,
    price: "0.01",
    pdfUrl: "https://bafkreifjzdc7xmsxqic7ra6ydm3y65ypbe4e2t7rrv7mwnqamsnb3ozqja.ipfs.flk-ipfs.xyz",
    isAudio: false
  },
  {
    id: 5,
    title: "Realizing the Truth of Self",
    author: "Maya Patel",
    coverImage: "/images/truth-self.jpg",
    description: "An audio journey into self-discovery and personal truth.",
    isPaid: false,
    price: "0",
    pdfUrl: "https://bafybeifyk7cbl65e3zdajt2wht4egujqgp5rc46f5jeghqlifvwjd55dhu.ipfs.flk-ipfs.xyz",
    isAudio: true
  },
  {
    id: 6,
    title: "History of World",
    author: "Prof. David Anderson",
    coverImage: "/images/world-history.jpg",
    description: "An audio exploration of world history and its major events.",
    isPaid: false,
    price: "0",
    pdfUrl: "https://bafybeifyk7cbl65e3zdajt2wht4egujqgp5rc46f5jeghqlifvwjd55dhu.ipfs.flk-ipfs.xyz",
    isAudio: true
  }
];

const ChatWidgetComponent = dynamic(() => import('../src/components/ChatWidget'), {
  ssr: false,
  loading: () => null
});

const BookCard = memo(({ book, unlockedBooks, onBuy, bookPrice }: any) => (
  <m.div
    key={book.title}
    style={{
      background: "rgba(19, 10, 42, 0.9)",
      borderRadius: "24px",
      padding: "40px",
      border: "1px solid rgba(124, 58, 237, 0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      minHeight: "300px",
    }}
    whileHover={{ y: -10 }}
  >
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <h3 style={{ 
          fontSize: "2rem",
          fontWeight: "700",
          color: "#FFFFFF",
        }}>
          {book.title}
        </h3>
        <div style={{
          display: 'flex',
          gap: '10px',
        }}>
          {book.isAudio && (
            <span style={{
              padding: "6px 12px",
              background: "linear-gradient(135deg, #BB86FC, #7C3AED)",
              borderRadius: "20px",
              fontSize: "0.9rem",
              color: "#FFFFFF",
            }}>
              Audio
            </span>
          )}
          <span style={{
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.9rem",
            background: book.isPaid ? 
              "linear-gradient(135deg, #7C3AED, #3B82F6)" : 
              "linear-gradient(135deg, #059669, #10B981)",
            color: "#FFFFFF",
          }}>
            {book.isPaid ? "Premium" : "Free"}
          </span>
        </div>
      </div>
      <p style={{ 
        fontSize: "1.1rem",
        color: "#E0E0E0",
        marginBottom: "10px",
        opacity: 0.9,
      }}>
        by {book.author}
      </p>
      <p style={{ 
        fontSize: "1.1rem",
        color: "#E0E0E0",
        marginBottom: "30px",
        opacity: 0.9,
      }}>
        {book.description}
      </p>
    </div>
    
    {book.isPaid && !unlockedBooks[book.title] ? (
      <motion.button
        onClick={() => onBuy(book.title)}
        style={{
          background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
          color: "#FFFFFF",
          padding: "16px 32px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "1.1rem",
          fontWeight: "600",
          letterSpacing: "0.5px",
          boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
        }}
        whileHover={{ transform: "translateY(-2px)" }}
        whileTap={{ transform: "translateY(0px)" }}
      >
        Buy for {bookPrice} ETH
      </motion.button>
    ) : (
      <motion.a
        href={book.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: unlockedBooks[book.title]
            ? "linear-gradient(135deg, #059669, #10B981)"
            : "linear-gradient(135deg, #059669, #10B981)",
          color: "#FFFFFF",
          padding: "16px 32px",
          border: "none",
          borderRadius: "12px",
          textDecoration: "none",
          textAlign: "center",
          fontSize: "1.1rem",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
        }}
        whileHover={{ 
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(5, 150, 105, 0.4)",
        }}
        whileTap={{ transform: "translateY(0px)" }}
      >
        View {book.title}
      </motion.a>
    )}
  </m.div>
));
BookCard.displayName="BookCard";

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

export default function Library() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Waiting for MetaMask...");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [unlockedBooks, setUnlockedBooks] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<'all' | 'free' | 'paid' | 'audio'>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

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
    const purchaseData = JSON.parse(localStorage.getItem("purchasedBooks") || "{}");
    setUnlockedBooks(purchaseData);
  }

  async function buyBook(bookTitle: string) {
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
          processBookPurchase(bookTitle, signerInstance, accounts[0]);
        }
      } catch (error) {
        console.error("Failed to connect:", error);
        setStatus("Please connect MetaMask first.");
        return;
      }
    } else {
      // Already connected, proceed with transaction
      processBookPurchase(bookTitle, signer, account);
    }
  }

  async function processBookPurchase(bookTitle: string, signer: ethers.JsonRpcSigner, account: string) {
    const book = books.find(b => b.title === bookTitle);
    if (!book || !book.isPaid) return;

    setStatus("Initiating transaction...");

    try {
      const network = await provider?.getNetwork();
      console.log("Current network:", network?.name);

      const tx = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        value: ethers.parseEther(bookPrice),
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

      setStatus("Transaction sent. Waiting for confirmation...");
      const receipt = await transaction.wait();
      
      setStatus("Book purchased successfully!");
      
      const existingData = JSON.parse(localStorage.getItem("purchasedBooks") || "{}");
      const updatedData = {
        ...existingData,
        [bookTitle]: {
          purchased: true,
          address: account,
          transactionHash: receipt.hash,
          purchaseDate: new Date().toISOString()
        }
      };
      localStorage.setItem("purchasedBooks", JSON.stringify(updatedData));
      
      setUnlockedBooks(prev => ({
        ...prev,
        [bookTitle]: true
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

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      if (filter === 'all') return true;
      if (filter === 'free') return !book.isPaid;
      if (filter === 'paid') return book.isPaid && !book.isAudio;
      if (filter === 'audio') return book.isAudio;
      return true;
    });
  }, [filter]);

  const pageStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, #050505, #130A2A, #0A1229)",
    color: "#F5F5F5",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  };

  const logoContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2rem",
    background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
    letterSpacing: "0.5px",
  };

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <LazyMotion features={domAnimation}>
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
            <div style={{
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}>
              {[
                { label: "Home", path: "/home" },
                { label: "Library", path: "/library" },
                { label: "Courses", path: "/courses" },
                { label: "Learn Sign Language", path: "http://localhost:8501" },
                { label: "Roadmap", path: "/roadmap" },
                { label: "Jobs", path: "/jobs" },
                { label: "About", path: "/about" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  href={item.path}
                  target={item.path.startsWith('http') ? '_blank' : undefined}
                  rel={item.path.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                      { label: "Learn Sign Language", path: "http://localhost:8501" },
                      { label: "Roadmap", path: "/roadmap" },
                      { label: "Jobs", path: "/jobs" },
                      { label: "About", path: "/about" },
                      { label: "Profile", path: "/profile" }
                    ].map((item, index) => (
                      <Link 
                        key={index}
                        href={item.path}
                        target={item.path.startsWith('http') ? '_blank' : undefined}
                        rel={item.path.startsWith('http') ? 'noopener noreferrer' : undefined}
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

        {/* Main Content */}
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
              Library
            </motion.h1>

            {/* Filter Section */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "10px" : "20px",
              background: "rgba(19, 10, 42, 0.6)",
              padding: isMobile ? "10px" : "8px",
              borderRadius: "12px",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              width: isMobile ? "100%" : "auto",
            }}>
              {[
                { label: "All Books", value: 'all' },
                { label: "Free Books", value: 'free' },
                { label: "Premium Books", value: 'paid' },
                { label: "Audio Books", value: 'audio' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setFilter(option.value as 'all' | 'free' | 'paid' | 'audio')}
                  style={{
                    padding: isMobile ? "16px" : "12px 24px",
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

          {/* Books Grid */}
          <motion.div 
            style={{ 
              display: "grid",
              gridTemplateColumns: isMobile ? 
                "1fr" : 
                "repeat(auto-fill, minmax(400px, 1fr))",
              gap: isMobile ? "30px" : "40px",
              maxWidth: "1400px",
              margin: "0 auto",
              padding: isMobile ? "0 20px" : "0",
            }}
            initial={false}
          >
            {filteredBooks.map((book, index) => (
              <BookCard 
                key={book.id}
                book={book}
                unlockedBooks={unlockedBooks}
                onBuy={buyBook}
                bookPrice={bookPrice}
              />
            ))}
          </motion.div>

        </main>

        {/* Footer */}
        <footer style={{
          background: "linear-gradient(145deg, rgba(19, 10, 42, 1), rgba(5, 5, 5, 1))",
          padding: "80px 40px 40px",
          color: "#E0E0E0",
          borderTop: "1px solid rgba(187, 134, 252, 0.1)",
          marginTop: "100px",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "60px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}>
            {/* Brand Section */}
            <div>
              <div style={{ ...logoContainerStyle, marginBottom: "20px" }}>
                <OwlLogo />
                <div style={{ ...logoStyle, fontSize: "1.8rem" }}>Open World Learning</div>
              </div>
              <p style={{ color: "#E0E0E0", opacity: 0.8, lineHeight: "1.6" }}>
                Empowering global education through blockchain technology.
              </p>
            </div>

            {/* Quick Links */}
            {[
              {
                title: "Navigation",
                links: ["Home", "Library", "Courses", "About"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "Support"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 style={{ 
                  color: "#FFFFFF", 
                  fontSize: "1.2rem", 
                  fontWeight: "600",
                  marginBottom: "20px",
                  background: "linear-gradient(135deg, #FFFFFF, #BB86FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {section.title}
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} style={{ marginBottom: "12px" }}>
                      <Link 
                        href="#" 
                        style={{ 
                          color: "#E0E0E0", 
                          opacity: 0.8, 
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          fontSize: "1rem",
                          display: "inline-block",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateX(5px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "0.8";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: "1px solid rgba(187, 134, 252, 0.1)",
            marginTop: "60px",
            paddingTop: "30px",
            textAlign: "center",
            color: "#E0E0E0",
            opacity: 0.8,
            fontSize: "0.9rem",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "20px",
            }}>
              {["Facebook", "Twitter", "LinkedIn", "GitHub"].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  style={{
                    color: "#E0E0E0",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#BB86FC"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#E0E0E0"}
                >
                  {social}
                </Link>
              ))}
            </div>
            <p>© 2025 Open World Learning. All rights reserved.</p>
          </div>
        </footer>

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
              background: "rgba(220, 38, 38, 0.95)",
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
        {isClient && <ChatWidgetComponent />}
      </div>
    </LazyMotion>
  );
}