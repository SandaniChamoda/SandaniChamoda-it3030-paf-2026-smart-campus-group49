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

  const rowsPerPage = 10;

  const sideLinks = [
    { label: "Users" },
    { to: "/admin/resources", label: "Resources" },
    { to: "/admin", label: "Bookings", end: true },
    { to: "/tickets/admin", label: "Tickets" },
  ];

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

    setForm({
      ...form,
      [name]: name === "capacity" ? (value === "" ? "" : Number(value)) : value,
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
      })
      .catch(() => {
        alert("Validation error: please check inputs");
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8086/resources/${id}`, {
      method: "DELETE",
    }).then(() => loadResources());
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
          <path d="M9 3h6" />
          <path d="M10 3v5l-5 8a3 3 0 0 0 2.6 5h8.8a3 3 0 0 0 2.6-5l-5-8V3" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="7" width="18" height="10" rx="2" />
        <circle cx="9" cy="12" r="1.8" />
        <path d="M13 12h5" />
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
            Support
          </Link>
          <Link to="/" className="admin-side-link logout-link">
            Logout
          </Link>
        </div>
      </aside>

      <div className="admin-main-area">
        <div className="admin-resource-shell">
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
              Register New Resource
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

          <section className="admin-resource-toolbar" aria-label="Resource filters">
            <div className="toolbar-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="22" y2="22" />
              </svg>
              <input
                placeholder="Search resources, serial numbers, or tags..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="toolbar-filter-row">
              <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
                <option value="">Type: All</option>
                <option value="FACILITY">Type: Facility</option>
                <option value="EQUIPMENT">Type: Equipment</option>
              </select>

              <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
                <option value="">Category: All</option>
                {[...FACILITY_CATEGORIES, ...EQUIPMENT_CATEGORIES].map((category) => (
                  <option key={category} value={category}>
                    Category: {toTitleCase(category)}
                  </option>
                ))}
              </select>

              <select value={capacityFilter} onChange={(event) => setCapacityFilter(event.target.value)}>
                <option value="ANY">Capacity: Any</option>
                <option value="SMALL">Capacity: 1-20</option>
                <option value="MEDIUM">Capacity: 21-50</option>
                <option value="LARGE">Capacity: 51-150</option>
                <option value="XL">Capacity: 150+</option>
              </select>

              <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
                <option value="ALL">Location: All Blocks</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    Location: {location}
                  </option>
                ))}
              </select>
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
                          <span className="chip">{toTitleCase(normalizeType(resource.type))}</span>
                        </td>
                        <td>
                          <strong>
                            {resource.capacity == null ? "N/A" : `${resource.capacity} Seats`}
                          </strong>
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
                            <button type="button" title="View" aria-label="View">
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            <button type="button" title="Edit" aria-label="Edit" onClick={() => handleEdit(resource)}>
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                                <path d="m12 6 4 4" />
                              </svg>
                            </button>
                            <button type="button" title="Delete" aria-label="Delete" onClick={() => handleDelete(resource.id)}>
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 7h16" />
                                <path d="M9 7V4h6v3" />
                                <path d="M8 7v13h8V7" />
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

          <button className="floating-support-btn" type="button" aria-label="Support agent">
            🎧
          </button>

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
                  <form className="admin-resource-form" onSubmit={handleSubmit}>
                    <input
                      name="name"
                      placeholder="Resource name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                    <select name="type" value={form.type} onChange={handleChange}>
                      <option value="FACILITY">FACILITY</option>
                      <option value="EQUIPMENT">EQUIPMENT</option>
                    </select>

                    <select name="category" value={form.category} onChange={handleChange}>
                      {getCategoryOptionsByType(form.type).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <input
                      name="capacity"
                      placeholder="Capacity"
                      type="number"
                      min="1"
                      value={form.capacity}
                      onChange={handleChange}
                      required={form.type === "FACILITY"}
                    />

                    <input
                      name="location"
                      placeholder="Location"
                      value={form.location}
                      onChange={handleChange}
                      required
                    />

                    <input
                      name="availabilityStart"
                      type="time"
                      value={form.availabilityStart}
                      onChange={handleChange}
                    />

                    <input
                      name="availabilityEnd"
                      type="time"
                      value={form.availabilityEnd}
                      onChange={handleChange}
                    />

                    <textarea
                      name="description"
                      placeholder="Description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                    />

                    <select name="status" value={form.status} onChange={handleChange}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                    </select>

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
        </div>
      </div>
    </section>
  );
}

export default AdminResourcePage;