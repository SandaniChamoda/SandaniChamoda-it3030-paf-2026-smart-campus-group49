import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../Admin/AdminDashboard.css";
import "./AdminResourcePage.css";

function AdminResourcePage() {
  const FACILITY_CATEGORIES = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "AUDITORIUM"];
  const EQUIPMENT_CATEGORIES = ["PROJECTOR", "CAMERA", "LAPTOP", "MICROPHONE", "SPEAKER"];

  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("ANY");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewResource, setViewResource] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [form, setForm] = useState({
    name: "",
    type: "FACILITY",
    category: "LECTURE_HALL",
    capacity: "",
    location: "",
    availabilityStart: "",
    availabilityEnd: "",
    description: "",
    status: "ACTIVE",
  });

  // Validation state
  const [formErrors, setFormErrors] = useState({});

  const rowsPerPage = 10;

  const sideLinks = [
    { label: "Users" },
    { to: "/admin/resources", label: "Resources" },
    { to: "/admin", label: "Bookings", end: true },
    { to: "/tickets/admin", label: "Tickets" },
  ];


  // Fetch resources from backend
  const loadResources = () => {
    fetch("http://localhost:8086/resources")
      .then((res) => res.json())
      .then((data) => setResources(data));
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterCategory, capacityFilter, locationFilter]);

  useEffect(() => {
    if (!toast.show) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const normalizeType = (type) => {
    const normalized = String(type || "").toUpperCase();
    if (normalized === "LAB" || normalized === "ROOM") {
      return "FACILITY";
    }
    return normalized;
  };

  const getCategoryOptionsByType = (type) => {
    return normalizeType(type) === "EQUIPMENT" ? EQUIPMENT_CATEGORIES : FACILITY_CATEGORIES;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Only allow letters, numbers, spaces, dashes, underscores
      const filtered = value.replace(/[^a-zA-Z0-9 _-]/g, "");
      setForm({
        ...form,
        name: filtered,
      });
      return;
    }

    if (name === "type") {
      const options = getCategoryOptionsByType(value);
      const nextType = normalizeType(value);
      setForm((prev) => ({
        ...prev,
        type: nextType,
        category: options[0],
        capacity: nextType === "EQUIPMENT" ? "" : prev.capacity,
      }));
      return;
    }


    if (name === "capacity") {
      // Only allow digits
      const filtered = value.replace(/[^0-9]/g, "");
      setForm({
        ...form,
        capacity: filtered,
      });
      return;
    }

    if (name === "location") {
      // Only allow letters, numbers, spaces, dashes, underscores, commas
      const filtered = value.replace(/[^a-zA-Z0-9 _\-,]/g, "");
      setForm({
        ...form,
        location: filtered,
      });
      return;
    }

    if (name === "availabilityStart" || name === "availabilityEnd") {
      // Only allow times between 07:00 and 22:00
      if (value && (value < "07:00" || value > "22:00")) {
        setForm({
          ...form,
          [name]: "",
        });
        return;
      }
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      type: "FACILITY",
      category: "LECTURE_HALL",
      capacity: "",
      location: "",
      availabilityStart: "",
      availabilityEnd: "",
      description: "",
      status: "ACTIVE",
    });
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeFormModal = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = (e) => {

    e.preventDefault();


    // --- Resource Name Validation ---
    const errors = {};
    const name = form.name.trim();
    // 1. Min/max length
    if (name.length < 3 || name.length > 50) {
      errors.name = "Resource name must be 3-50 characters.";
    }
    // 2. No special characters (allow letters, numbers, spaces, dashes, underscores)
    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) {
      errors.name = "Resource name can only contain letters, numbers, spaces, dashes, and underscores.";
    }
    // 3. No duplicate names (case-insensitive, ignore self if editing)
    const duplicate = resources.some(
      (r) => r.name.trim().toLowerCase() === name.toLowerCase() && r.id !== editingId
    );
    if (duplicate) {
      errors.name = "A resource with this name already exists.";
    }

    // --- Location Validation ---
    const location = form.location.trim();
    if (location.length < 3 || location.length > 100) {
      errors.location = "Location must be 3-100 characters.";
    }
    // Allow only letters, numbers, spaces, dashes, underscores, commas
    if (!/^[a-zA-Z0-9 _\-,]+$/.test(location)) {
      errors.location = "Location can only contain letters, numbers, spaces, dashes, underscores, and commas.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      ...form,
      type: normalizeType(form.type),
      capacity:
        normalizeType(form.type) === "EQUIPMENT"
          ? 0
          : form.capacity === ""
            ? 0
            : Number(form.capacity),
      availabilityStart: form.availabilityStart || null,
      availabilityEnd: form.availabilityEnd || null,
      description: form.description || null,
    };

    const url =
      editingId !== null
        ? `http://localhost:8086/resources/${editingId}`
        : "http://localhost:8086/resources";

    const method = editingId !== null ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Validation failed");
        }
        return res.json();
      })
      .then(() => {
        loadResources();
        resetForm();
        setShowForm(false);
        setToast({
          show: true,
          message: `${editingId !== null ? "Updated" : "Added"} successfully: ${form.name}`,
          type: "success",
        });
      })
      .catch(() => {
        setToast({
          show: true,
          message: "Validation error: please check inputs",
          type: "error",
        });
      });
  };

  const openDeleteConfirm = (resource) => {
    setDeleteCandidate(resource);
  };

  const closeDeleteConfirm = () => {
    if (!deleteInProgress) {
      setDeleteCandidate(null);
    }
  };

  const confirmDelete = () => {
    if (!deleteCandidate?.id || deleteInProgress) {
      return;
    }

    setDeleteInProgress(true);

    fetch(`http://localhost:8086/resources/${deleteCandidate.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Delete failed");
        }

        loadResources();
        setToast({
          show: true,
          message: `Deleted successfully: ${deleteCandidate.name}`,
          type: "success",
        });
        setDeleteCandidate(null);
      })
      .catch(() => {
        setToast({
          show: true,
          message: "Could not delete resource. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        setDeleteInProgress(false);
      });
  };

  const handleEdit = (resource) => {
    const normalizedType = normalizeType(resource.type);
    const categoryOptions = getCategoryOptionsByType(normalizedType);
    setForm({
      name: resource.name,
      type: normalizedType,
      category: resource.category || categoryOptions[0],
      capacity: resource.capacity ?? "",
      location: resource.location,
      availabilityStart: resource.availabilityStart || "",
      availabilityEnd: resource.availabilityEnd || "",
      description: resource.description || "",
      status: resource.status,
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  const toTitleCase = (value) => {
    return String(value || "")
      .toLowerCase()
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const getCapacityText = (resource) => {
    const normalizedType = normalizeType(resource?.type);
    if (normalizedType === "EQUIPMENT" || resource?.capacity == null) {
      return "N/A";
    }
    return `${resource.capacity} Seats`;
  };

  const capacityMatches = (capacity) => {
    if (capacityFilter === "ANY") {
      return true;
    }

    if (capacityFilter === "SMALL") {
      return capacity <= 20;
    }

    if (capacityFilter === "MEDIUM") {
      return capacity > 20 && capacity <= 50;
    }

    if (capacityFilter === "LARGE") {
      return capacity > 50 && capacity <= 150;
    }

    return capacity > 150;
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const normalizedType = normalizeType(resource.type);
      const text = [resource.name, resource.location, normalizedType, resource.category, resource.id]
        .join(" ")
        .toLowerCase();

      const locationMatches =
        locationFilter === "ALL" ||
        String(resource.location || "") === locationFilter;

      const resourceCapacity = Number(resource.capacity);
      const capacityAllowed =
        normalizedType === "EQUIPMENT" ? capacityFilter === "ANY" : capacityMatches(Number.isNaN(resourceCapacity) ? 0 : resourceCapacity);

      return (
        text.includes(search.toLowerCase()) &&
        (filterType === "" || normalizedType === filterType) &&
        (filterCategory === "" || String(resource.category || "") === filterCategory) &&
        capacityAllowed &&
        locationMatches
      );
    });
  }, [resources, search, filterType, filterCategory, capacityFilter, locationFilter]);

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .map((resource) => String(resource.location || "").trim())
          .filter(Boolean)
      )
    ).sort((left, right) => left.localeCompare(right));
  }, [resources]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / rowsPerPage));
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pagedResources = filteredResources.slice(pageStart, pageStart + rowsPerPage);

  const activeCount = resources.filter((resource) => String(resource.status).toUpperCase() === "ACTIVE").length;
  const inactiveCount = resources.length - activeCount;
  const availabilityPercent = resources.length === 0
    ? 0
    : Math.round((activeCount / resources.length) * 100);

  const pageNumbers =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, 2, 3, "...", totalPages];

  const renderResourceGlyph = (type) => {
    const normalizedType = normalizeType(type);

    if (normalizedType === "FACILITY") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 20V4" />
          <path d="M15 20V4" />
          <path d="M4 10h16" />
          <path d="M4 15h16" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="6" width="14" height="12" rx="2" />
        <path d="M8 10h8" />
        <path d="M8 14h5" />
        <path d="M10 3v3" />
        <path d="M14 3v3" />
      </svg>
    );
  };

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-side-kicker">Admin Panel</p>
          <h2 className="admin-side-title">Operations</h2>

          <nav className="admin-side-nav" aria-label="Admin sections">
            {sideLinks.map((item) => (
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-side-link${isActive ? " active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <button key={item.label} type="button" className="admin-side-link admin-side-link-button">
                  {item.label}
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="admin-side-bottom">
          <Link to="/tickets/create" className="admin-side-link support-link">
            <span style={{display: 'inline-flex', alignItems: 'center', marginRight: '0.5em'}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginRight: '0.18em'}}>
                <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M10 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
              </svg>
            </span>
            Support
          </Link>
          <Link to="/" className="admin-side-link logout-link">
            <span style={{display: 'inline-flex', alignItems: 'center', marginRight: '0.5em'}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginRight: '0.18em'}}>
                <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2.75" y="3.75" width="8.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            Logout
          </Link>
        </div>
      </aside>

      <div className="admin-main-area">
        <div className="admin-resource-shell">
          {toast.show && (
            <div className={`admin-resource-toast ${toast.type === "error" ? "error" : "success"}`} role="status" aria-live="polite">
              {toast.message}
            </div>
          )}

          <div className="admin-resource-page">
          <header className="admin-resource-header">
            <div>
              <p className="admin-resource-tag">Resource Management</p>
              <h1>Resource Management</h1>
              <p>Coordinate and monitor campus assets with academic precision.</p>
            </div>

            <button
              className="admin-resource-create-btn"
              type="button"
              onClick={openCreateForm}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.6em' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '0.18em' }}>
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="10" y1="6" x2="10" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              Add New Resources
            </button>
          </header>

          <section className="admin-resource-metrics" aria-label="Resource metrics">
            <article className="metric-card metric-card-primary">
              <p>Current Availability</p>
              <h2>{availabilityPercent}%</h2>
              <span>Across all departments</span>
            </article>

            <article className="metric-card metric-card-warning">
              <p>Pending Repairs</p>
              <h2>{inactiveCount.toString().padStart(2, "0")}</h2>
              <span>Maintenance required</span>
            </article>

            <article className="metric-card metric-card-neutral">
              <p>Next Inspection</p>
              <h2>Oct 24, 2026</h2>
              <span>Science District Audit</span>
            </article>
          </section>

          <section className="admin-resource-filter-panel" aria-label="Resource filters">
            <div className="admin-resource-search-column">
              <label htmlFor="admin-resource-search">Global Search</label>
              <div className="admin-resource-search-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="22" y2="22" />
                </svg>
                <input
                  id="admin-resource-search"
                  placeholder="Search resources, serial numbers, or tags..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="admin-resource-filter-controls">
              <div className="admin-resource-select-group">
                <label htmlFor="admin-resource-type">Type</label>
                <select
                  id="admin-resource-type"
                  value={filterType}
                  onChange={(event) => setFilterType(event.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="FACILITY">Facility</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div className="admin-resource-select-group">
                <label htmlFor="admin-resource-category">Category</label>
                <select
                  id="admin-resource-category"
                  value={filterCategory}
                  onChange={(event) => setFilterCategory(event.target.value)}
                >
                  <option value="">All Categories</option>
                  {[...FACILITY_CATEGORIES, ...EQUIPMENT_CATEGORIES].map((category) => (
                    <option key={category} value={category}>
                      {toTitleCase(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-resource-select-group">
                <label htmlFor="admin-resource-capacity">Capacity</label>
                <select
                  id="admin-resource-capacity"
                  value={capacityFilter}
                  onChange={(event) => setCapacityFilter(event.target.value)}
                >
                  <option value="ANY">Any Size</option>
                  <option value="SMALL">1 - 20 seats</option>
                  <option value="MEDIUM">21 - 50 seats</option>
                  <option value="LARGE">51 - 150 seats</option>
                  <option value="XL">150+ seats</option>
                </select>
              </div>

              <div className="admin-resource-select-group">
                <label htmlFor="admin-resource-location">Location</label>
                <select
                  id="admin-resource-location"
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                >
                  <option value="ALL">All Blocks</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <button className="admin-resource-filter-button" type="button" aria-label="Filter controls">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="17" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </section>

          <section className="admin-resource-registry" aria-label="Resource registry">
            <div className="registry-head">
              <h3>Resource Registry</h3>
              <p>
                Showing {filteredResources.length === 0 ? 0 : pageStart + 1}-
                {Math.min(pageStart + rowsPerPage, filteredResources.length)} of {filteredResources.length} resources
              </p>
            </div>

            <div className="registry-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Resource Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedResources.map((resource) => {
                    const active = String(resource.status).toUpperCase() === "ACTIVE";
                    const normalizedType = normalizeType(resource.type);
                    const capacityText = getCapacityText(resource);
                    return (
                      <tr key={resource.id}>
                        <td>
                          <div className="resource-name-cell">
                            <span className="resource-icon-badge">
                              {renderResourceGlyph(resource.type)}
                            </span>

                            <div className="resource-name-meta">
                              <strong>{resource.name}</strong>
                              <span>ID: FAC-{String(resource.id).padStart(3, "0")}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="chip">{toTitleCase(normalizedType)}</span>
                        </td>
                        <td>
                          <strong>{capacityText}</strong>
                          <span>{toTitleCase(resource.category) || resource.location}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${active ? "active" : "inactive"}`}>
                            <span className="status-dot" />
                            {active ? "ACTIVE" : "OUT OF SERVICE"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="action-btn action-btn-view"
                              title="View"
                              aria-label="View"
                              onClick={() => setViewResource(resource)}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            <button type="button" className="action-btn action-btn-edit" title="Edit" aria-label="Edit" onClick={() => handleEdit(resource)}>
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 21h3.8L18.8 9 15 5.2 3 17.2V21Z" />
                                <path d="m14.8 5.2 4 4" />
                              </svg>
                            </button>
                            <button type="button" className="action-btn action-btn-delete" title="Delete" aria-label="Delete" onClick={() => openDeleteConfirm(resource)}>
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 7h16" />
                                <path d="M9 7V4h6v3" />
                                <path d="M6 7l1 13h10l1-13" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {pagedResources.length === 0 && (
                <div className="registry-empty">No resources match the current filters.</div>
              )}
            </div>

            <div className="registry-footer">
              <p>Showing {rowsPerPage} per page</p>

              <div className="registry-pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {pageNumbers.map((item, index) => {
                  if (item === "...") {
                    return <span key={`dots-${index}`}>...</span>;
                  }

                  return (
                    <button
                      key={item}
                      type="button"
                      className={item === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </section>
          </div>

          {viewResource && (
            <div
              className="admin-resource-modal-backdrop"
              role="presentation"
              onClick={() => setViewResource(null)}
            >
              <section
                className="admin-resource-details-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Resource details"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="admin-resource-modal-head">
                  <h3>Resource Details</h3>
                  <button
                    className="admin-resource-modal-close"
                    type="button"
                    onClick={() => setViewResource(null)}
                    aria-label="Close details"
                  >
                    ×
                  </button>
                </div>

                <div className="resource-details-grid">
                  <div className="resource-detail-item">
                    <span>Name</span>
                    <strong>{viewResource.name || "N/A"}</strong>
                  </div>

                  <div className="resource-detail-item">
                    <span>Resource ID</span>
                    <strong>FAC-{String(viewResource.id || "0").padStart(3, "0")}</strong>
                  </div>

                  <div className="resource-detail-item">
                    <span>Type</span>
                    <strong>{toTitleCase(normalizeType(viewResource.type))}</strong>
                  </div>

                  <div className="resource-detail-item">
                    <span>Category</span>
                    <strong>{toTitleCase(viewResource.category) || "N/A"}</strong>
                  </div>

                  <div className="resource-detail-item">
                    <span>Capacity</span>
                    <strong>{getCapacityText(viewResource)}</strong>
                  </div>

                  <div className="resource-detail-item">
                    <span>Status</span>
                    <strong>{String(viewResource.status || "").toUpperCase() === "ACTIVE" ? "ACTIVE" : "OUT OF SERVICE"}</strong>
                  </div>

                  <div className="resource-detail-item resource-detail-item-full">
                    <span>Location</span>
                    <strong>{viewResource.location || "N/A"}</strong>
                  </div>

                  <div className="resource-detail-item resource-detail-item-full">
                    <span>Description</span>
                    <strong>{viewResource.description || "No description provided."}</strong>
                  </div>
                </div>
              </section>
            </div>
          )}

          {showForm && (
            <div
              className="admin-resource-modal-backdrop"
              role="presentation"
              onClick={closeFormModal}
            >
              <section
                className="admin-resource-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Resource form"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="admin-resource-modal-head">
                  <h3>{editingId !== null ? "Edit Resource" : "Add New Resource"}</h3>
                  <button
                    className="admin-resource-modal-close"
                    type="button"
                    onClick={closeFormModal}
                    aria-label="Close form"
                  >
                    ×
                  </button>
                </div>

                <section className="admin-resource-form-wrap" aria-label="Resource form">
                  <form className="admin-resource-form creative" onSubmit={handleSubmit}>

                    {/* Resource Name */}
                    <div className="form-group">
                      <label htmlFor="resource-name">Resource Name</label>
                      <input
                        id="resource-name"
                        name="name"
                        placeholder="e.g. EEE Lab 1"
                        value={form.name}
                        onChange={handleChange}
                        required
                        minLength={3}
                        maxLength={50}
                        pattern="^[a-zA-Z0-9 _-]+$"
                        autoComplete="off"
                      />
                      <span className="form-helper">Official campus designation only.</span>
                      {formErrors.name && (
                        <span className="form-helper" style={{ color: '#dc2626', fontWeight: 700 }}>{formErrors.name}</span>
                      )}
                    </div>

                    {/* Resource Type */}
                    <div className="form-group">
                      <label htmlFor="resource-type">Resource Type</label>
                      <select id="resource-type" name="type" value={form.type} onChange={handleChange}>
                        <option value="">Select Type...</option>
                        <option value="FACILITY">Facility</option>
                        <option value="EQUIPMENT">Equipment</option>
                      </select>
                    </div>

                    {/* Capacity */}
                    <div className="form-group">
                      <label htmlFor="resource-capacity">Capacity</label>
                      <input
                        id="resource-capacity"
                        name="capacity"
                        placeholder="e.g. 40"
                        type="text"
                        min="1"
                        value={form.capacity}
                        onChange={handleChange}
                        required={form.type === "FACILITY"}
                        autoComplete="off"
                      />
                    </div>

                    {/* Location / Building */}
                    <div className="form-group">
                      <label htmlFor="resource-location">Location / Building</label>
                      <input
                        id="resource-location"
                        name="location"
                        placeholder="e.g. Main Building, 2nd Floor"
                        value={form.location}
                        onChange={handleChange}
                        required
                        minLength={3}
                        maxLength={100}
                        pattern="^[a-zA-Z0-9 _\-,]+$"
                        autoComplete="off"
                      />
                      <span className="form-helper">Building, floor, or area (3-100 chars, no special characters).</span>
                      {formErrors.location && (
                        <span className="form-helper" style={{ color: '#dc2626', fontWeight: 700 }}>{formErrors.location}</span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label htmlFor="resource-category">Category</label>
                      <select id="resource-category" name="category" value={form.category} onChange={handleChange}>
                        {getCategoryOptionsByType(form.type).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Availability Window */}
                    <div className="form-group form-group-availability" style={{ gridColumn: '1 / -1' }}>
                      <label>Availability Window</label>
                      <div className="availability-window">
                        <div className="availability-time">
                          <input
                            name="availabilityStart"
                            type="time"
                            value={form.availabilityStart}
                            onChange={handleChange}
                            placeholder="Start Time"
                            min="07:00"
                            max="22:00"
                          />
                          <span className="availability-label">START TIME</span>
                        </div>
                        <span className="availability-arrow">→</span>
                        <div className="availability-time">
                          <input
                            name="availabilityEnd"
                            type="time"
                            value={form.availabilityEnd}
                            onChange={handleChange}
                            placeholder="End Time"
                            min="07:00"
                            max="22:00"
                          />
                          <span className="availability-label">END TIME</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="resource-description">Description</label>
                      <textarea
                        id="resource-description"
                        name="description"
                        placeholder="Description (optional, max 300 characters)"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        maxLength={300}
                      />
                    </div>

                    {/* Status */}
                    <div className="form-group">
                      <label htmlFor="resource-status">Status</label>
                      <select id="resource-status" name="status" value={form.status} onChange={handleChange}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                      </select>
                    </div>

                    <div className="admin-resource-form-actions">
                      <button className="resource-btn-primary" type="submit">
                        {editingId !== null ? "Update Resource" : "Add Resource"}
                      </button>
                      <button
                        className="resource-btn-light"
                        type="button"
                        onClick={closeFormModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              </section>
            </div>
          )}

          {deleteCandidate && (
            <div
              className="admin-resource-modal-backdrop"
              role="presentation"
              onClick={closeDeleteConfirm}
            >
              <section
                className="admin-resource-delete-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Confirm delete resource"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="admin-resource-delete-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7h16" />
                    <path d="M9 7V4h6v3" />
                    <path d="M8 7v13h8V7" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </div>

                <h3>Delete Resource?</h3>
                <p>
                  You are about to remove <strong>{deleteCandidate.name}</strong>. This action cannot be undone.
                </p>

                <div className="admin-resource-delete-actions">
                  <button
                    type="button"
                    className="resource-btn-light"
                    onClick={closeDeleteConfirm}
                    disabled={deleteInProgress}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="resource-btn-danger"
                    onClick={confirmDelete}
                    disabled={deleteInProgress}
                  >
                    {deleteInProgress ? "Deleting..." : "Delete Resource"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminResourcePage;