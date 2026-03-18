import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const initialForm = {
  title: "",
  description: "",
  price: "",
  category_id: "",
};

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsSubmitting(true);

      await api.post("/products", {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        price: Number(formData.price),
      });

      setFormData(initialForm);
      setSuccess("Product added successfully.");

      window.setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card card-narrow">
      <div className="stack-sm">
        <p className="eyebrow">Seller Tools</p>
        <h2>Create a new listing</h2>
        <p className="muted">
          Logged-in users create products under their own account automatically.
        </p>
      </div>

      <form className="stack-md" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            className="input"
            name="title"
            onChange={handleChange}
            placeholder="Vintage camera"
            required
            type="text"
            value={formData.title}
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            className="input textarea"
            name="description"
            onChange={handleChange}
            placeholder="Condition, brand, pickup details, and anything buyers should know."
            required
            value={formData.description}
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Price</span>
            <input
              className="input"
              min="0"
              name="price"
              onChange={handleChange}
              placeholder="1500"
              required
              type="number"
              value={formData.price}
            />
          </label>

          <label className="field">
            <span>Category ID</span>
            <input
              className="input"
              min="1"
              name="category_id"
              onChange={handleChange}
              placeholder="Optional"
              type="number"
              value={formData.category_id}
            />
          </label>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}
        {success ? <div className="success-banner">{success}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Add Product"}
        </button>
      </form>
    </section>
  );
}

export default AddProduct;
