import { useEffect, useState } from "react";

function ResourcePage() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "LAB",
    capacity: "",
    location: "",
    status: "ACTIVE",
  });

  // LOAD DATA (GET)
  const loadResources = () => {
  let url = "http://localhost:8086/resources";

  if (filterType) {
    url = `http://localhost:8086/resources/type/${filterType}`;
  } else if (filterLocation) {
    url = `http://localhost:8086/resources/location/${filterLocation}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => setResources(data));
};

  useEffect(() => {
  loadResources();
}, [filterType, filterLocation]);

  // HANDLE INPUT
  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: name === "capacity" ? Number(value) : value,
  });
};

  // CREATE (POST)
const handleSubmit = (e) => {
  e.preventDefault();

  if (editingId !== null) {
    // UPDATE
    fetch(`http://localhost:8086/resources/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then(() => {
      loadResources();
      setEditingId(null);
    });
  } else {
    // CREATE
    fetch("http://localhost:8086/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then(() => loadResources());
  }

  // reset form
  setForm({
    name: "",
    type: "LAB",
    capacity: "",
    location: "",
    status: "ACTIVE",
  });
};

  // DELETE
  const handleDelete = (id) => {
    fetch(`http://localhost:8086/resources/${id}`, {
      method: "DELETE",
    }).then(() => loadResources());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resource Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
  <input
    className="form-control"
    name="name"
    placeholder="Name"
    value={form.name}
    onChange={handleChange}
  />
</div>
      
        
<div className="mb-2">
  <input
    className="form-control"
    name="capacity"
    placeholder="Capacity"
    value={form.capacity}
    onChange={handleChange}
  />
</div>

<div className="mb-2">
  <input
    className="form-control"
    name="location"
    placeholder="Location"
    value={form.location}
    onChange={handleChange}
  />
</div>

        <div className="mb-2">
  <select
    className="form-control"
    name="type"
    value={form.type}
    onChange={handleChange}
  >
    <option value="LAB">LAB</option>
    <option value="ROOM">ROOM</option>
  </select>
</div>

        <div className="mb-2">
  <select
    className="form-control"
    name="status"
    value={form.status}
    onChange={handleChange}
  >
    <option value="ACTIVE">ACTIVE</option>
    <option value="INACTIVE">INACTIVE</option>
  </select>
</div>

        <button className="btn btn-primary mt-2" type="submit">
  {editingId !== null ? "Update Resource" : "Add Resource"}
</button>
      </form>

      <hr />

      <h3>Filter</h3>

<select onChange={(e) => setFilterType(e.target.value)}>
  <option value="">All Types</option>
  <option value="LAB">LAB</option>
  <option value="ROOM">ROOM</option>
</select>

<input
  placeholder="Filter by location"
  onChange={(e) => setFilterLocation(e.target.value)}
/>

      {/* LIST */}
      <ul className="list-group">
  {resources.map((r) => (
    <li className="list-group-item" key={r.id}>
  {r.name} | {r.type} | {r.capacity} | {r.location} | {r.status}

  <button onClick={() => handleDelete(r.id)}>Delete</button>

  <button
    onClick={() => {
      setForm({
  name: r.name,
  type: r.type,
  capacity: r.capacity,
  location: r.location,
  status: r.status,
});
      setEditingId(r.id);
    }}
  >
    Edit
  </button>
</li>
        ))}
      </ul>
    </div>
  );
}

export default ResourcePage;