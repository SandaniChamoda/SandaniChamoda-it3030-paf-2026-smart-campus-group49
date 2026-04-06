function Home() {
  return (
    <div className="container mt-4">

      <h1>Smart Campus Booking System</h1>

      <p>Welcome to the resource booking system.</p>

      <div className="mt-4">

        <a href="/bookings" className="btn btn-primary me-2">
          View Bookings
        </a>

        <a href="/create" className="btn btn-success">
          Create Booking
        </a>

      </div>

    </div>
  );
}

export default Home;