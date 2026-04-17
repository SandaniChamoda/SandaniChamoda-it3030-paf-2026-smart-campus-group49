import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./ResourceList.css";

function ResourceList() {
  const FACILITY_CATEGORIES = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "AUDITORIUM"];
  const EQUIPMENT_CATEGORIES = ["PROJECTOR", "CAMERA", "LAPTOP", "MICROPHONE", "SPEAKER"];

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;
  const themedImageCatalog = {
    FACILITY: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbOo-GZCU2kXvps21H62AxaatHNY0J05YOLyj7QEtxm9F1G4mAG4r8whc0qfcnjhRdB9noYDoOshFOU-gFGpnuj9sUr9JdSC6B5coevGa30hmxBc6ss9fGRWSanEqBDDj2U30R53QMy2gd2vNIBsSlK5loUNk2GJIH6IuDXSEz35njZSrnl7jxJm9YUOvWxfjsHosdfa2KF_ICciz3_co9JTiYHSInjU1h-Eka-dRy1xi5ON3DGKW8Dwb4ZGml2f_1oT2ix2f9DUgi",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhpduodWeBXn-TsDS6Vqc42zsGY2ik1hWq1dO8_FPRqB6lRnaR3OU3DOfFFKY4i1eSHCaQD3ExE7kfeR0-XZeQLaoeMHe0C1ORtAG4FQQ0P10H3nPlFpvamlIHu8gxAPuUZL9u0FkJRFdUc3sJFm_xPLDYb_0r0fVbpEUoOH4bj40b2WDHmKFLVxV1h_wvVIOw4guUof6_60VfPVVdw-p3ZT0oHVF7tBR_9hizempYuRi2XW0ZomiEvsBHyyQdsTnyRXUk9C7kw2J",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9tFrWyXahmYO1LW7Hzg_KNwNjnnFekTzJwFiEEEk47x5z2-DN75ChQ8mVSIoFi0XcaSjzTORefVIcJfFHWGR2IFq2zeuL99kQWW117Y1D7SsTcNONg2hQ5-oVtEBUI15ue_0PJr4yhbR8eDwdA2-1mwGJ9TMkgD8Vis8FWpAxX33N7TlivLAN_mcGqA6G2ajABNDRuoqpP8HA63XPjvCNpUVG9NLa_g7mxU9gIhMC3kjpxn2VOK3Oor-_-rwAETjVjZowjV2JiT-L",
    ],
    EQUIPMENT: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbhXExIZ6t0dxmV-_eVzCD05RhI5EnW1YsgNQ8fVoakfV5FYIwtUjjeJltOlL7QfvVfZ9LBhTKpywi1EV_LMi_R3bWlsPpGMAZPDwqcoGsE8AE-Z3tj69V1wNfkhy-if1fPjL9duD3fE3BKJ8Ik5l3JIdl-Aiu1vEl64h81APxVRbTFapPpEwO5cf37OE0w11YsSG_WQmzv38MtQS5regp0zo5GRU0n7pOqlKssf1YLbw0ktPVH0RTm6STATXmxR85OHlHhEuazIvi",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1lUVgc9BP8EwPlWkzl54TxvunKrDTpvO8f2hiLB3IZang27bEuoaYPfBY6PVklHzNbz5qJczlM7_4myuTUsF3WQB8CMVOCNDxkf_vHFdh9VHLrxlmmmbZC8Xbg2jsi98_3u5W9toPTX1u54bEffpQYhbmxM66U5qB3ieHeBIh8qbCaCFdVyzv2TVXl1Y-MJnjV-1YQ4HKNzURtFOmYll8rk7e8FKJo69DZCVr1o4g3_NX577mfJkVXGceXuAt2yBiF735X4zX_ubh",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDntbsdjTU2cR4LJ-hdwmaTokBpPaqmN1h2KfKjyLANi0K57tC4mRMYoh581pV0J0wei1ShQFAmvaCHWlzerBPjsNo3d8XhUrDuAYpxmp7UgpjHpjbuaWQcLKWC5Ed-DVbi8TxtnODDUZ1X_C6jHqVMIH8xGyeFVZJMKTh5Nol0lSZ7Hf7XvxgaSqVwIzvv5-JXOjZuJ8vhiYc9Ao48bhaS7gMtgqfL25_knKBapZVnz6CMGU79c8xB8g_NfXnQPsNbvf5zDCelRyYW",
    ],
    DEFAULT: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1lUVgc9BP8EwPlWkzl54TxvunKrDTpvO8f2hiLB3IZang27bEuoaYPfBY6PVklHzNbz5qJczlM7_4myuTUsF3WQB8CMVOCNDxkf_vHFdh9VHLrxlmmmbZC8Xbg2jsi98_3u5W9toPTX1u54bEffpQYhbmxM66U5qB3ieHeBIh8qbCaCFdVyzv2TVXl1Y-MJnjV-1YQ4HKNzURtFOmYll8rk7e8FKJo69DZCVr1o4g3_NX577mfJkVXGceXuAt2yBiF735X4zX_ubh",
    ],
  };

  const loadResources = async () => {
    try {
      const response = await API.get("/resources");
      setResources(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load resources", error);
      setResources([]);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory, capacityFilter, locationFilter]);

  const normalizeType = (type) => {
    const normalized = String(type || "").toUpperCase();
    if (normalized === "LAB" || normalized === "ROOM") {
      return "FACILITY";
    }
    return normalized;
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
    if (capacity == null) {
      return capacityFilter === "ALL";
    }

    if (capacityFilter === "ALL") {
      return true;
    }

    if (capacityFilter === "SMALL") {
      return capacity <= 30;
    }

    if (capacityFilter === "MEDIUM") {
      return capacity > 30 && capacity <= 100;
    }

    return capacity > 100;
  };

  const resolveImageGroup = (resource) => {
    const normalizedType = normalizeType(resource.type);
    if (normalizedType === "FACILITY") {
      return themedImageCatalog.FACILITY;
    }

    if (normalizedType === "EQUIPMENT") {
      return themedImageCatalog.EQUIPMENT;
    }

    return themedImageCatalog.DEFAULT;
  };

  const getCardImage = (resource) => {
    const imageGroup = resolveImageGroup(resource);
    const stableIndex = Math.abs(Number(resource.id) || resource.name.length || 0) % imageGroup.length;
    return imageGroup[stableIndex];
  };

  const getLastCheckText = (resource) => {
    const idNum = Number(resource.id) || 1;
    const cycle = idNum % 6;

    if (cycle === 0) {
      return "2h ago";
    }

    if (cycle <= 2) {
      return `${cycle * 5}m ago`;
    }

    return `${cycle}h ago`;
  };

  const getIssueText = (resource) => {
    const issues = [
      "HVAC maintenance in progress",
      "Power module diagnostics active",
      "Network equipment recalibration",
      "Safety inspection pending",
    ];
    const idNum = Number(resource.id) || 1;
    return issues[idNum % issues.length];
  };

  const createPageNumbers = (totalPages, page) => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page, "...", totalPages];
  };

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const haystack = [r.name, r.type, r.location, r.id].join(" ").toLowerCase();
      const locationMatches =
        locationFilter === "ALL" || String(r.location || "") === locationFilter;

      return (
        haystack.includes(search.toLowerCase()) &&
        (filterCategory === "" || String(r.category || "") === filterCategory) &&
        capacityMatches(r.capacity == null ? null : Number(r.capacity)) &&
        locationMatches
      );
    });
  }, [resources, search, filterCategory, capacityFilter, locationFilter]);

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .map((resource) => String(resource.location || "").trim())
          .filter(Boolean)
      )
    ).sort((left, right) => left.localeCompare(right));
  }, [resources]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);
  const pageNumbers = createPageNumbers(totalPages, currentSafePage);
  const pageStart = (currentSafePage - 1) * pageSize;
  const pagedResources = filteredResources.slice(pageStart, pageStart + pageSize);

  const handlePageChange = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="resource-page sc-container">
      <header className="resource-title-wrap">
        <div className="resource-title-row">
          <div>
            <p className="resource-eyebrow">Campus Operations</p>
            <h1 className="resource-title">Facility Directory</h1>
          </div>

          <Link className="resource-report-btn" to="/tickets/create">
            Report Issue
          </Link>
        </div>
      </header>

      <section className="resource-filter-panel" aria-label="Global filters">
        <div className="resource-search-column">
          <label htmlFor="resource-search">Global Search</label>
          <div className="resource-search-input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="22" y2="22" />
            </svg>
            <input
              id="resource-search"
              placeholder="Search by name, code or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="resource-filter-controls">
          <div className="resource-select-group">
            <label htmlFor="resource-category">Category</label>
            <select
              id="resource-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...FACILITY_CATEGORIES, ...EQUIPMENT_CATEGORIES].map((category) => (
                <option key={category} value={category}>
                  {toTitleCase(category)}
                </option>
              ))}
            </select>
          </div>

          <div className="resource-select-group">
            <label htmlFor="resource-capacity">Capacity</label>
            <select
              id="resource-capacity"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
            >
              <option value="ALL">Any Size</option>
              <option value="SMALL">1 - 30 seats</option>
              <option value="MEDIUM">31 - 100 seats</option>
              <option value="LARGE">101+ seats</option>
            </select>
          </div>

          <div className="resource-select-group">
            <label htmlFor="resource-location">Location</label>
            <select
              id="resource-location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="ALL">All Locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <button className="resource-filter-button" type="button" aria-label="Filter controls">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="17" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </section>

      <section className="resource-grid" aria-label="Facilities">
        {pagedResources.map((r) => {
          const isActive = String(r.status).toUpperCase() === "ACTIVE";
          const statusText = isActive ? "ACTIVE" : "OUT_OF_SERVICE";

          return (
            <article className="resource-card" key={r.id}>
              <div className="resource-image-wrap">
                <img
                  className="resource-image"
                  src={getCardImage(r)}
                  alt={`${r.name} overview`}
                  loading="lazy"
                />

                <span className={`resource-status-pill ${isActive ? "active" : "inactive"}`}>
                  {statusText}
                </span>
              </div>

              <div className="resource-card-body">
                <p className="resource-type">
                  {toTitleCase(normalizeType(r.type))}
                  {r.category ? ` • ${toTitleCase(r.category)}` : ""}
                </p>
                <h3>{r.name}</h3>

                <p className="resource-meta">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="16" cy="9" r="2.5" />
                    <path d="M3.5 18c0-2.5 2-4.5 4.5-4.5h0c2.5 0 4.5 2 4.5 4.5" />
                    <path d="M13.5 18c0-1.9 1.5-3.5 3.5-3.5h0c1.9 0 3.5 1.5 3.5 3.5" />
                  </svg>
                  {r.capacity == null ? "Capacity N/A" : `${Number(r.capacity) || 0} seats`}
                </p>

                <div className="resource-card-footer">
                  <span>Last check: {getLastCheckText(r)}</span>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {isActive ? "Manage Details" : "View Ticket"}
                  </a>
                </div>

                {!isActive && <p className="resource-warning">{getIssueText(r)}</p>}
              </div>
            </article>
          );
        })}

        {pagedResources.length === 0 && (
          <div className="resource-empty-state">
            <h3>No facilities found</h3>
            <p>Try changing search keywords or filters to discover more resources.</p>
          </div>
        )}
      </section>

      <nav className="resource-pagination" aria-label="Pagination">
        <button
          type="button"
          onClick={() => handlePageChange(currentSafePage - 1)}
          disabled={currentSafePage === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>

        {pageNumbers.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`dots-${index}`} className="pagination-dots">
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              type="button"
              className={item === currentSafePage ? "active" : ""}
              onClick={() => handlePageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentSafePage ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePageChange(currentSafePage + 1)}
          disabled={currentSafePage === totalPages}
          aria-label="Next page"
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}

export default ResourceList;

