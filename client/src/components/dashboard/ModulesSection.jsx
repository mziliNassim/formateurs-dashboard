import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { serverURL_MODULES } from "../../assets/data";
import { useSelector } from "react-redux";

const ModulesSection = () => {
  const { user } = useSelector((state) => state.user);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Form state
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    image: "",
  });

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(serverURL_MODULES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (data.success) {
          setModules(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch modules");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error fetching modules", {
          description: err.message,
          action: {
            label: "Retry",
            onClick: () => fetchModules(),
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedModules = React.useMemo(() => {
    if (!modules.length) return [];

    const sortableItems = [...modules];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [modules, sortConfig]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      image: "",
    });
    setCurrentModule(null);
  };

  // Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentModule) {
        // Update existing module
        const { data } = await axios.put(
          `${serverURL_MODULES}/${currentModule._id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (data.success) {
          setModules(
            modules.map((m) => (m._id === data.data._id ? data.data : m))
          );
          toast.success("Module updated successfully");
        }
      } else {
        // Create new module
        const { data } = await axios.post(serverURL_MODULES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (data.success) {
          setModules([...modules, data.data]);
          toast.success("Module created successfully", {
            action: { label: "✖️" },
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Error saving module", {
        description: err.response?.data?.message || err.message,
        action: { label: "✖️" },
      });
    }
  };

  // Handle edit
  const handleEdit = (module) => {
    setCurrentModule(module);
    setFormData({
      titre: module.titre,
      description: module.description,
      image: module.image || "",
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${serverURL_MODULES}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (data.success) {
        setModules(modules.filter((m) => m._id !== id));
        // alert success
        toast.success("Module deleted successfully", {
          action: { label: "✖️" },
        });
      }
    } catch (err) {
      toast.error("Error deleting module", {
        description: err.response?.data?.message || err.message,
        action: { label: "✖️" },
      });
    }
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 inline" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 inline" />
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "256px",
        }}
      >
        <Loader2
          style={{
            width: "32px",
            height: "32px",
            animation: "spin 1s linear infinite",
            color: "#6b7280",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "0.5rem",
          padding: "1rem",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
        }}
      >
        {error}
        <button
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Modules Management
        </h2>
        <div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus
              style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
            />
            Add Module
          </button>
        </div>
      </div>

      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              width: "100%",
              maxWidth: "32rem",
              padding: "1.5rem",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                {currentModule ? "Edit Module" : "Create New Module"}
              </h3>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  htmlFor="titre"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Title
                </label>
                <input
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Image URL (optional)
                </label>
                <input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  paddingTop: "1rem",
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {currentModule ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        style={{
          borderRadius: "0.375rem",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "500",
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                }}
                onClick={() => requestSort("titre")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Title {renderSortIcon("titre")}
                </div>
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "500",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "500",
                  cursor: "pointer",
                  borderBottom: "1px solid #e5e7eb",
                }}
                onClick={() => requestSort("createdAt")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Created At {renderSortIcon("createdAt")}
                </div>
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontWeight: "500",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Courses
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "right",
                  fontWeight: "500",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedModules.length > 0 ? (
              sortedModules.map((module) => (
                <tr
                  key={module._id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td style={{ padding: "1rem", fontWeight: "500" }}>
                    {module.titre}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      color: "#4b5563",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "200px",
                    }}
                  >
                    {module.description}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {new Date(module.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "9999px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {module.cours?.length || 0} courses
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEdit(module)}
                      >
                        <Edit
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.25rem",
                          }}
                        />
                        Edit
                      </button>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "transparent",
                          color: "#dc2626",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDelete(module._id)}
                      >
                        <Trash2
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.25rem",
                          }}
                        />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    height: "6rem",
                  }}
                >
                  No modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModulesSection;
