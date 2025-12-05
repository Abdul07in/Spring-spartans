import React from 'react';
import { 
  Search, 
  Menu, 
  User, 
  ChevronDown, 
  QrCode, 
  Network, 
  Building2, 
  ArrowRight 
} from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          {/* Placeholder for Logo */}
          <span style={{ color: '#D74B14', fontWeight: '900' }}>ICICI</span>
          <span>PRUDENTIAL</span>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>MUTUAL FUND</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-item">Funds <ChevronDown size={16} /></div>
          <div className="nav-item">Resources <ChevronDown size={16} /></div>
          <div className="nav-item">Services <ChevronDown size={16} /></div>
          <div className="nav-item">Shareholders Centre</div>
        </nav>

        <div className="header-actions">
          <button className="icon-btn">
            <Search size={20} color="#D74B14" />
          </button>
          
          <button className="investor-btn">
            <User size={18} />
            INVESTOR
            <ChevronDown size={16} />
          </button>
          
          <button className="sign-in-btn">
            SIGN IN
          </button>
          
          <button className="icon-btn" style={{ border: 'none' }}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="breadcrumb" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Sign In
        </div>
        
        <h1 className="page-title">Sign In/Register</h1>

        <div className="content-grid">
          {/* Left Column: Login Card */}
          <div className="login-card">
            {/* QR Section */}
            <div className="qr-section">
              <div className="qr-placeholder">
                <QrCode size={100} color="#333" />
                <div className="qr-overlay-btn">GENERATE QR</div>
              </div>
              <div className="qr-text">
                <h3>Sign in via QR Code</h3>
                <p>Login to the i-Invest Mobile App, open QR scanner from the Home (top-right corner) or More page and scan to login.</p>
              </div>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Form Section */}
            <div className="form-section">
              <h2 className="form-header">Investor</h2>
              
              <div className="input-group">
                <input type="text" placeholder="Login ID" />
              </div>
              
              <a href="#" className="forgot-link">Forgot Login ID?</a>
              
              <button className="action-btn next-btn">NEXT</button>
              <button className="action-btn register-btn">REGISTER</button>
              
              <div className="or-divider">or</div>
              
              <button className="action-btn google-btn">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Right Column: Side Cards */}
          <div className="side-cards">
            <div className="side-card">
              <div className="card-icon">
                <Network size={24} />
              </div>
              <div className="card-content">
                <h3>Distributor</h3>
                <p>I am an ICICI distributor and I want to log in to my account.</p>
              </div>
            </div>

            <div className="side-card">
              <div className="card-icon">
                <Building2 size={24} />
              </div>
              <div className="card-content">
                <h3>Corporate</h3>
                <p>I am investing as a company/ organisation/institution.</p>
              </div>
            </div>

            {/* Promo Card (Bottom Right) */}
            <div className="footer-promo" style={{ marginTop: 'auto', background: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80) center/cover' }}>
              <div className="promo-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(160, 82, 45, 0.9), rgba(205, 133, 63, 0.7))' }}></div>
              <div className="promo-content" style={{ position: 'relative', zIndex: 1 }}>
                <h2>Aim big.</h2>
                <h2>Start small.</h2>
                <div className="promo-link">
                  Check our Smallcap funds <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
