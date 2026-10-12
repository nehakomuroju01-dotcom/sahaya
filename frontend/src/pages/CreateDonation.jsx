
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateDonation() {
  const navigate = useNavigate();
  const [type, setType] = useState("FOOD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    quantityUnit: "kg",
    pickupLocation: "",
    latitude: "",
    longitude: "",
    expiryDate: "",
    foodPreparedAt: "",
    allergens: "",
    storageInstructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type,
        quantity: Number(form.quantity),
        quantityUnit: form.quantityUnit,
        pickupLocation: form.pickupLocation.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        expiryDate: form.expiryDate,
        foodPreparedAt:
          type === "FOOD" && form.foodPreparedAt
            ? form.foodPreparedAt
            : null,
        allergens:
          type === "FOOD" ? form.allergens.trim() : null,
        storageInstructions:
          type === "FOOD"
            ? form.storageInstructions.trim()
            : null,
      };

      await api.post("/donations", payload);
      navigate("/feed");
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data === "string"
          ? data
          : data?.message ||
              "Could not create the donation. Check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const quantityUnits =
    type === "FOOD"
      ? [
          { value: "kg", label: "Kilograms (kg)" },
          { value: "g", label: "Grams (g)" },
          { value: "litres", label: "Litres" },
          { value: "ml", label: "Millilitres (ml)" },
          { value: "packets", label: "Packets" },
          { value: "pieces", label: "Pieces" },
          { value: "boxes", label: "Boxes" },
        ]
      : [
          { value: "pieces", label: "Pieces" },
          { value: "pairs", label: "Pairs" },
          { value: "sets", label: "Sets" },
          { value: "boxes", label: "Boxes" },
          { value: "bags", label: "Bags" },
          { value: "kg", label: "Kilograms (kg)" },
        ];

  return (
    <main className="page-container">
      <section className="form-card">
        <p className="eyebrow">A LITTLE KINDNESS GOES A LONG WAY</p>

        <h1>Share something good.</h1>

        <p className="subtitle">
          Your extra can become someone else's essential.
        </p>

        <div className="type-switch">
          <button
            type="button"
            className={`btn ${
              type === "FOOD" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => {
              setType("FOOD");
              setForm((prev) => ({
                ...prev,
                quantityUnit: "kg",
              }));
            }}
          >
            Food
          </button>

          <button
            type="button"
            className={`btn ${
              type === "GOODS" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => {
              setType("GOODS");
              setForm((prev) => ({
                ...prev,
                quantityUnit: "pieces",
              }));
            }}
          >
            Essentials &amp; goods
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Donation title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            placeholder={
              type === "FOOD"
                ? "Freshly prepared meals"
                : "Clean blankets"
            }
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={1000}
            placeholder="Describe what you're sharing..."
          />

          <label htmlFor="quantity">Quantity *</label>

          <div className="quantity-input-row">
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />

            <select
              id="quantityUnit"
              name="quantityUnit"
              value={form.quantityUnit}
              onChange={handleChange}
              aria-label="Quantity measurement"
              required
            >
              {quantityUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {type === "FOOD" && (
            <>
              <label htmlFor="foodPreparedAt">
                Food prepared at *
              </label>
              <input
                id="foodPreparedAt"
                name="foodPreparedAt"
                type="datetime-local"
                value={form.foodPreparedAt}
                onChange={handleChange}
                required
              />

              <label htmlFor="allergens">Allergens</label>
              <input
                id="allergens"
                name="allergens"
                value={form.allergens}
                onChange={handleChange}
                maxLength={500}
                placeholder="e.g. dairy, nuts"
              />

              <label htmlFor="storageInstructions">
                Storage instructions
              </label>
              <textarea
                id="storageInstructions"
                name="storageInstructions"
                value={form.storageInstructions}
                onChange={handleChange}
                maxLength={500}
                placeholder="e.g. Keep refrigerated"
              />
            </>
          )}

          <label htmlFor="expiryDate">
            Use-by / expiry date and time *
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="datetime-local"
            value={form.expiryDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="pickupLocation">Pickup location *</label>
          <input
            id="pickupLocation"
            name="pickupLocation"
            value={form.pickupLocation}
            onChange={handleChange}
            maxLength={200}
            placeholder="Area or pickup address"
            required
          />

          <div className="coordinates-grid">
            <div>
              <label htmlFor="latitude">Latitude (optional)</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="longitude">Longitude (optional)</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn-primary submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sharing donation..." : "Share donation →"}
          </button>
        </form>
      </section>
    </main>
  );
}
