import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Smart Campus Booking System</h1>
          <p className="hero-subtitle">Streamline your campus resource bookings with our modern and intuitive platform</p>

          <div className="cta-buttons">
            <a href="/create" className="btn btn-primary btn-lg">
              <span className="btn-icon">+</span>
              Create Booking
            </a>
            <a href="/bookings" className="btn btn-secondary btn-lg">
              <span className="btn-icon">📋</span>
              View Bookings
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our System</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick & Easy</h3>
            <p>Book resources in just a few clicks with our streamlined interface</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>Intelligent scheduling system to avoid conflicts and maximize availability</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security ensures your data is always protected</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Admin Control</h3>
            <p>Comprehensive admin dashboard for complete resource management</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Browse</h4>
            <p>Explore available resources and their schedules</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h4>Select</h4>
            <p>Choose your preferred date and time slot</p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h4>Confirm</h4>
            <p>Complete your booking instantly</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;