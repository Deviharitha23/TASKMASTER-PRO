// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const styles = {
    // Main container with enhanced background
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    
    // Enhanced Background Animation
    backgroundAnimation: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 100%)
      `,
      animation: 'floatBackground 20s ease-in-out infinite',
      zIndex: 0,
    },
    
    // Floating Particles
    floatingParticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 60% 20%, rgba(255,255,255,0.4), transparent),
        radial-gradient(3px 3px at 80% 50%, rgba(255,255,255,0.2), transparent),
        radial-gradient(2px 2px at 10% 80%, rgba(255,255,255,0.3), transparent),
        radial-gradient(3px 3px at 90% 10%, rgba(255,255,255,0.2), transparent)
      `,
      animation: 'particleFloat 25s linear infinite',
      zIndex: 1,
    },
    
    // Floating Icons
    floatingIcons: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      pointerEvents: 'none',
    },
    floatingIcon: {
      position: 'absolute',
      fontSize: '24px',
      opacity: '0.6',
      animation: 'floatIcon 20s ease-in-out infinite',
    },
    
    // Navigation
    nav: {
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      fontSize: '28px',
      fontWeight: '800',
      color: 'white',
      background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    navButtons: {
      display: 'flex',
      gap: '16px',
    },
    
    // Hero Section
    hero: {
      padding: '120px 40px 80px',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '72px',
      fontWeight: '800',
      marginBottom: '24px',
      lineHeight: '1.1',
      background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'textGlow 3s ease-in-out infinite alternate',
    },
    heroSubtitle: {
      fontSize: '24px',
      fontWeight: '400',
      marginBottom: '40px',
      opacity: '0.9',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6',
      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    
    // Features Section
    features: {
      padding: '100px 40px',
      background: 'rgba(255, 255, 255, 0.97)',
      position: 'relative',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '52px',
      fontWeight: '800',
      marginBottom: '60px',
      color: '#1a202c',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '40px 30px',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    },
    featureCardHover: {
      transform: 'translateY(-15px) scale(1.02)',
      boxShadow: '0 25px 60px rgba(102, 126, 234, 0.25)',
    },
    featureCardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      animation: 'glowMove 2s ease-in-out infinite alternate',
    },
    featureIcon: {
      fontSize: '64px',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
    },
    featureTitle: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#1a202c',
    },
    featureDescription: {
      fontSize: '16px',
      color: '#718096',
      lineHeight: '1.6',
    },
    
    // Stats Section
    stats: {
      padding: '100px 40px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    statItem: {
      padding: '40px 30px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
    },
    statItemHover: {
      transform: 'translateY(-10px)',
      background: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 15px 40px rgba(255, 255, 255, 0.2)',
    },
    statNumber: {
      fontSize: '52px',
      fontWeight: '800',
      marginBottom: '8px',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    statLabel: {
      fontSize: '18px',
      opacity: '0.9',
      fontWeight: '500',
    },
    
    // CTA Section
    cta: {
      padding: '120px 40px',
      background: 'rgba(255, 255, 255, 0.98)',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
    },
    ctaTitle: {
      fontSize: '52px',
      fontWeight: '800',
      marginBottom: '24px',
      color: '#1a202c',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    ctaSubtitle: {
      fontSize: '20px',
      color: '#718096',
      marginBottom: '50px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6',
    },
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    
    // Footer
    footer: {
      padding: '40px',
      background: 'rgba(26, 32, 44, 0.95)',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      backdropFilter: 'blur(10px)',
    },
    
    // Enhanced Button Styles
    btnPrimary: {
      padding: '20px 40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
      textDecoration: 'none',
      display: 'inline-block',
      position: 'relative',
      overflow: 'hidden',
    },
    btnPrimaryHover: {
      transform: 'translateY(-5px) scale(1.05)',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
    },
    btnSecondary: {
      padding: '20px 40px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
      display: 'inline-block',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    },
    btnSecondaryHover: {
      background: '#667eea',
      color: 'white',
      transform: 'translateY(-5px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
    },
    btnOutline: {
      padding: '20px 40px',
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '16px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
      display: 'inline-block',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    },
    btnOutlineHover: {
      background: 'white',
      color: '#667eea',
      transform: 'translateY(-5px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(255, 255, 255, 0.3)',
      borderColor: 'white',
    },
  };

  // Interactive effects
  const handleMouseEnter = (e, type) => {
    const btn = e.target;
    if (type === 'primary') {
      btn.style.transform = styles.btnPrimaryHover.transform;
      btn.style.boxShadow = styles.btnPrimaryHover.boxShadow;
    } else if (type === 'secondary') {
      btn.style.transform = styles.btnSecondaryHover.transform;
      btn.style.background = styles.btnSecondaryHover.background;
      btn.style.color = styles.btnSecondaryHover.color;
      btn.style.boxShadow = styles.btnSecondaryHover.boxShadow;
    } else if (type === 'outline') {
      btn.style.transform = styles.btnOutlineHover.transform;
      btn.style.background = styles.btnOutlineHover.background;
      btn.style.color = styles.btnOutlineHover.color;
      btn.style.borderColor = styles.btnOutlineHover.borderColor;
      btn.style.boxShadow = styles.btnOutlineHover.boxShadow;
    }
  };

  const handleMouseLeave = (e, type) => {
    const btn = e.target;
    if (type === 'primary') {
      btn.style.transform = 'none';
      btn.style.boxShadow = styles.btnPrimary.boxShadow;
    } else if (type === 'secondary') {
      btn.style.transform = 'none';
      btn.style.background = styles.btnSecondary.background;
      btn.style.color = styles.btnSecondary.color;
      btn.style.boxShadow = 'none';
    } else if (type === 'outline') {
      btn.style.transform = 'none';
      btn.style.background = styles.btnOutline.background;
      btn.style.color = styles.btnOutline.color;
      btn.style.borderColor = styles.btnOutline.border;
      btn.style.boxShadow = 'none';
    }
  };

  const handleFeatureHover = (e) => {
    e.currentTarget.style.transform = styles.featureCardHover.transform;
    e.currentTarget.style.boxShadow = styles.featureCardHover.boxShadow;
  };

  const handleFeatureLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = styles.featureCard.boxShadow;
  };

  const handleStatHover = (e) => {
    e.currentTarget.style.transform = styles.statItemHover.transform;
    e.currentTarget.style.background = styles.statItemHover.background;
    e.currentTarget.style.boxShadow = styles.statItemHover.boxShadow;
  };

  const handleStatLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.background = styles.statItem.background;
    e.currentTarget.style.boxShadow = 'none';
  };

  const features = [
    {
      icon: '🚀',
      title: 'Smart Task Management',
      description: 'Create, organize, and track tasks with intelligent prioritization and deadline management.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Assign tasks to team members, track progress, and collaborate seamlessly in real-time.'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Get automatic reminders, deadline alerts, and team updates via email and in-app notifications.'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Visualize your productivity with detailed analytics and performance insights.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'See changes instantly with live updates and synchronized data across all devices.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted data and role-based access control.'
    }
  ];

  const stats = [
    { number: '99%', label: 'Task Completion Rate' },
    { number: '50%', label: 'Time Saved' },
    { number: '10x', label: 'Productivity Boost' },
    { number: '24/7', label: 'Team Collaboration' }
  ];

  // Floating icons positions
  const floatingIcons = [
    { icon: '📅', top: '20%', left: '5%', animationDelay: '0s' },
    { icon: '✅', top: '15%', left: '85%', animationDelay: '2s' },
    { icon: '👥', top: '70%', left: '10%', animationDelay: '4s' },
    { icon: '📊', top: '65%', left: '90%', animationDelay: '6s' },
    { icon: '🔔', top: '40%', left: '3%', animationDelay: '1s' },
    { icon: '⚡', top: '35%', left: '93%', animationDelay: '3s' },
    { icon: '🎯', top: '80%', left: '15%', animationDelay: '5s' },
    { icon: '💡', top: '85%', left: '80%', animationDelay: '7s' }
  ];

  return (
    <div style={styles.container}>
      {/* Enhanced Background Animation */}
      <div style={styles.backgroundAnimation}></div>
      <div style={styles.floatingParticles}></div>
      
      {/* Floating Icons */}
      <div style={styles.floatingIcons}>
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.floatingIcon,
              top: item.top,
              left: item.left,
              animationDelay: item.animationDelay,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
      
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo}>TaskFlow Pro</div>
        <div style={styles.navButtons}>
          <button 
            style={styles.btnOutline}
            onMouseEnter={(e) => handleMouseEnter(e, 'outline')}
            onMouseLeave={(e) => handleMouseLeave(e, 'outline')}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            style={styles.btnPrimary}
            onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
            onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Transform Your Team's
          <br />
          Productivity
        </h1>
        <p style={styles.heroSubtitle}>
          The ultimate task management platform that brings your team together, 
          streamlines workflows, and boosts productivity with intelligent features 
          designed for modern teams.
        </p>
        <div style={styles.heroButtons}>
          <button 
            style={styles.btnPrimary}
            onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
            onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
            onClick={() => navigate('/register')}
          >
            🚀 Start Free Trial
          </button>
          <button 
            style={styles.btnOutline}
            onMouseEnter={(e) => handleMouseEnter(e, 'outline')}
            onMouseLeave={(e) => handleMouseLeave(e, 'outline')}
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            📋 See Features
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose TaskFlow Pro?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index}
              style={styles.featureCard}
              onMouseEnter={handleFeatureHover}
              onMouseLeave={handleFeatureLeave}
            >
              <div style={styles.featureCardGlow}></div>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={styles.statItem}
              onMouseEnter={handleStatHover}
              onMouseLeave={handleStatLeave}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Boost Your Productivity?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of teams who have transformed their workflow with TaskFlow Pro. 
          Start your free trial today and experience the difference.
        </p>
        <div style={styles.ctaButtons}>
          <button 
            style={styles.btnPrimary}
            onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
            onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
            onClick={() => navigate('/register')}
          >
            🎉 Let's Start - Free Forever
          </button>
          <button 
            style={styles.btnSecondary}
            onMouseEnter={(e) => handleMouseEnter(e, 'secondary')}
            onMouseLeave={(e) => handleMouseLeave(e, 'secondary')}
            onClick={() => navigate('/login')}
          >
            🔐 Login to Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 TaskFlow Pro. All rights reserved. Built with ❤️ for productive teams.</p>
      </footer>

      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes floatBackground {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes particleFloat {
            0% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(0px) translateX(20px); }
            75% { transform: translateY(20px) translateX(10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }

          @keyframes floatIcon {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) rotate(0deg); 
              opacity: 0.6;
            }
            25% { 
              transform: translateY(-30px) translateX(15px) rotate(5deg); 
              opacity: 0.8;
            }
            50% { 
              transform: translateY(0px) translateX(30px) rotate(0deg); 
              opacity: 0.6;
            }
            75% { 
              transform: translateY(30px) translateX(15px) rotate(-5deg); 
              opacity: 0.4;
            }
          }

          @keyframes textGlow {
            0% { text-shadow: 0 4px 20px rgba(0,0,0,0.2); }
            100% { text-shadow: 0 4px 30px rgba(255,255,255,0.3); }
          }

          @keyframes glowMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          /* Enhanced hover effects */
          .btn-primary:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .btn-primary:hover::before {
            left: 100%;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.5);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.7);
          }

          /* Smooth transitions for all interactive elements */
          * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Enhanced focus states */
          button:focus {
            outline: 2px solid rgba(255, 255, 255, 0.5);
            outline-offset: 2px;
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .hero-title {
              font-size: 48px;
            }
            
            .features-grid {
              grid-template-columns: 1fr;
            }
            
            .hero-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .nav-buttons {
              flex-direction: column;
              gap: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;