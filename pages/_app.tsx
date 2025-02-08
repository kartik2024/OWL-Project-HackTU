import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '../context/ThemeContext'

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    botpressWebChat: {
      init: (config: any) => void;
      sendEvent: (payload: any) => void;
    };
  }
}

// Voice Navigation setup
class VoiceNavigation {
  private recognition: any;
  private isListening: boolean;
  private routes: { [key: string]: string };

  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.routes = {
      'take me to the home page': '/home',
      'go to home': '/home',
      'take me to the course page': '/courses',
      'go to courses': '/courses',
      'take me to about page': '/about',
      'go to about': '/about',
      'take me to library': '/library',
      'go to library': '/library',
      'take me to profile': '/profile',
      'go to profile': '/profile',
    };
  }

  initialize(router: any) {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.setupRecognition(router);
    }
  }

  private setupRecognition(router: any) {
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      // Restart if it was still supposed to be listening
      if (this.isListening) {
        this.recognition.start();
      }
    };

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();
      
      console.log('Recognized command:', command);
      this.handleCommand(command, router);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice navigation');
        this.stopListening();
      }
    };
  }

  private handleCommand(command: string, router: any) {
    for (const [phrase, route] of Object.entries(this.routes)) {
      if (command.includes(phrase)) {
        router.push(route);
        break;
      }
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      localStorage.setItem('voiceNavigationEnabled', 'true');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      localStorage.setItem('voiceNavigationEnabled', 'false');
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
    return this.isListening;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [voiceNav] = useState(() => new VoiceNavigation());
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceNav.initialize(router);
      
      // Check if voice navigation was enabled
      const isEnabled = localStorage.getItem('voiceNavigationEnabled') === 'true';
      if (isEnabled) {
        voiceNav.startListening();
        setIsListening(true);
      }
    }

    // Initialize Botpress webchat
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.async = true;
    document.body.appendChild(script);

    // Add the configuration script
    const configScript = document.createElement('script');
    configScript.src = "https://files.bpcontent.cloud/2025/02/06/17/20250206170433-M38DOAO3.js";
    configScript.async = true;
    document.body.appendChild(configScript);

    return () => {
      // Cleanup scripts on unmount
      document.body.removeChild(script);
      document.body.removeChild(configScript);
    };
  }, [router]);

  const toggleVoiceNavigation = () => {
    if (!isListening) {
      // Show tooltip with instructions when starting
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000); // Hide after 5 seconds
    }
    const newState = voiceNav.toggleListening();
    setIsListening(newState);
  };

  // Add voice navigation button to all pages except landing and auth
  const showVoiceNav = !['/landing', '/auth', '/'].includes(router.pathname);

  return (
    <ThemeProvider>
      <React.Fragment>
        {showVoiceNav && (
          <React.Fragment>
            {/* Circular Voice Navigation Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'fixed',
                bottom: '120px',
                right: '32px',
                zIndex: 999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '16px'
              }}
            >
              <motion.button
                onClick={toggleVoiceNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? {
                  boxShadow: [
                    '0 0 0 0 rgba(124, 58, 237, 0.2)',
                    '0 0 0 8px rgba(124, 58, 237, 0)',
                  ],
                } : {}}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                  }
                }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#7C3AED',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.25)',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={isListening ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <svg 
                    width="24"
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </motion.div>
                {isListening && (
                  <motion.div 
                    style={{ 
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#EF4444',
                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '80px',
                      padding: '20px',
                      background: '#0F0F13',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '1rem',
                      width: '240px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      {[
                        "Take me to the course page",
                        "Go to home",
                        "Take me to library"
                      ].map((command, index) => (
                        <motion.div
                          key={command}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#FFFFFF',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            position: 'relative',
                            paddingLeft: '12px',
                          }}
                        >
                          <motion.div
                            style={{
                              width: '4px',
                              height: '4px',
                              background: '#7C3AED',
                              borderRadius: '50%',
                              position: 'absolute',
                              left: 0,
                            }}
                          />
                          {command}
                        </motion.div>
                      ))}
                    </div>

                    {/* Add arrow pointing to button */}
                    <div style={{
                      position: 'absolute',
                      right: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderLeft: '6px solid #0F0F13',
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </React.Fragment>
        )}
        <Component {...pageProps} />
      </React.Fragment>
    </ThemeProvider>
  )
}

export default MyApp