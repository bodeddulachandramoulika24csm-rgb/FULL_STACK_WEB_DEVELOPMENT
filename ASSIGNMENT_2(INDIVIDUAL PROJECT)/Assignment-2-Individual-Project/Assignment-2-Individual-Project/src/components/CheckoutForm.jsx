import { useState } from "react";

const EMPTY = { name: "", email: "", phone: "", address: "", city: "", pincode: "", payment: "Cash on delivery" };

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 3) errors.name = "Enter your full name (at least 3 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email address, like name@example.com.";
  if (!/^[6-9]\d{9}$/.test(v.phone)) errors.phone = "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
  if (v.address.trim().length < 8) errors.address = "Enter your full delivery address.";
  if (v.city.trim().length < 2) errors.city = "Enter your city.";
  if (!/^\d{6}$/.test(v.pincode)) errors.pincode = "Enter a 6-digit PIN code.";
  return errors;
}

export default function CheckoutForm({ onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  const field = (id, label, props = {}) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={values[id]}
        onChange={set(id)}
        aria-invalid={errors[id] ? "true" : "false"}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        {...props}
      />
      {errors[id] && (
        <p className="error" id={`${id}-error`}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3>Delivery details</h3>
      {field("name", "Full name", { autoComplete: "name" })}
      <div className="row">
        {field("email", "Email", { type: "email", autoComplete: "email" })}
        {field("phone", "Mobile number", { type: "tel", inputMode: "numeric", maxLength: 10, autoComplete: "tel" })}
      </div>
      {field("address", "Address", { autoComplete: "street-address" })}
      <div className="row">
        {field("city", "City", { autoComplete: "address-level2" })}
        {field("pincode", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
      </div>
      <div className="field">
        <label htmlFor="payment">Payment method</label>
        <select id="payment" value={values.payment} onChange={set("payment")}>
          <option>Cash on delivery</option>
          <option>UPI</option>
          <option>Debit or credit card</option>
        </select>
      </div>
      <p className="muted small">This is a demo store. No real payment is taken.</p>
      <button className="btn btn-primary btn-block" type="submit">
        Place order
      </button>
    </form>
  );
}
