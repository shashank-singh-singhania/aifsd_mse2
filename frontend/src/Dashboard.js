import { useEffect, useState } from "react";
import API from "./api";
import "./Dashboard.css";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    date: "",
    contactInfo: ""
  });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      alert("Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addOrUpdateItem = async () => {
    if (!form.itemName || !form.type || !form.location || !form.contactInfo) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await API.put(`/items/${editId}`, form);
        alert("Item updated successfully");
        setEditId(null);
      } else {
        await API.post("/items", form);
        alert("Item added successfully");
      }
      setForm({
        itemName: "",
        description: "",
        type: "Lost",
        location: "",
        date: "",
        contactInfo: ""
      });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await API.delete(`/items/${id}`);
        alert("Item deleted successfully");
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to delete item");
      }
    }
  };

  const editItem = (item) => {
    setEditId(item._id);
    setForm(item);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      itemName: "",
      description: "",
      type: "Lost",
      location: "",
      date: "",
      contactInfo: ""
    });
  };

  const searchItems = async () => {
    if (!search) {
      fetchItems();
      return;
    }
    try {
      const res = await API.get(`/items/search/${search}`);
      setItems(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Lost & Found Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <div className="form-section">
        <h2>{editId ? "Update Item" : "Add New Item"}</h2>
        <div className="form-grid">
          <input 
            placeholder="Item Name *" 
            value={form.itemName}
            onChange={e => setForm({...form, itemName:e.target.value})}
            className="form-input"
          />
          <select 
            value={form.type}
            onChange={e => setForm({...form, type:e.target.value})}
            className="form-input"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <input 
            placeholder="Description" 
            value={form.description}
            onChange={e => setForm({...form, description:e.target.value})}
            className="form-input"
          />
          <input 
            placeholder="Location *" 
            value={form.location}
            onChange={e => setForm({...form, location:e.target.value})}
            className="form-input"
          />
          <input 
            type="date"
            value={form.date}
            onChange={e => setForm({...form, date:e.target.value})}
            className="form-input"
          />
          <input 
            placeholder="Contact Info *" 
            value={form.contactInfo}
            onChange={e => setForm({...form, contactInfo:e.target.value})}
            className="form-input"
          />
        </div>
        <div className="form-buttons">
          <button onClick={addOrUpdateItem} disabled={loading} className="btn-primary">
            {loading ? "Saving..." : (editId ? "Update Item" : "Add Item")}
          </button>
          {editId && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
        </div>
      </div>

      <div className="search-section">
        <input 
          placeholder="Search items by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          onKeyPress={e => e.key === "Enter" && searchItems()}
        />
        <button onClick={searchItems} className="btn-primary">Search</button>
        <button onClick={fetchItems} className="btn-secondary">Show All</button>
      </div>

      <div className="items-section">
        <h2>Items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="no-items">No items found</p>
        ) : (
          <div className="items-grid">
            {items.map(item => (
              <div key={item._id} className="item-card">
                <div className="item-header">
                  <h3>{item.itemName}</h3>
                  <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
                </div>
                <div className="item-details">
                  <p><strong>Description:</strong> {item.description || "N/A"}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Contact:</strong> {item.contactInfo}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => editItem(item)} className="btn-edit">Edit</button>
                  <button onClick={() => deleteItem(item._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}