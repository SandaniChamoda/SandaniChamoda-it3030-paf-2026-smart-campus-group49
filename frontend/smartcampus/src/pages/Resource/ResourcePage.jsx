import { useEffect, useState } from "react";

function ResourcePage() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "LAB",
    capacity: "",
    location: "",
    status: "ACTIVE",
  });

  // LOAD DATA (GET)
  const loadResources = () => {
    fetch("http://localhost:8086/resources")
      .then((res) => res.json())
      .then((data) => setResources(data));
  };

  useEffect(() => {
    loadResources();
  }, []);

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
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="LAB">LAB</option>
          <option value="ROOM">ROOM</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button type="submit">
  {editingId !== null ? "Update Resource" : "Add Resource"}
</button>
      </form>

      <hr />

      {/* LIST */}
      <ul>
        {resources.map((r) => (
          <li key={r.id}>
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