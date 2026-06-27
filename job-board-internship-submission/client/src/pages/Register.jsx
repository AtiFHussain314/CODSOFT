import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    companyName: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = await register(form);
      navigate(user.role === "employer" ? "/employer" : "/candidate", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <div className="section-heading">
          <p className="eyebrow">Create account</p>
          <h1>Join TalentBridge</h1>
        </div>
        <label>
          Full name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength="8" value={form.password} onChange={update} required />
        </label>
        <label>
          Account type
          <select name="role" value={form.role} onChange={update}>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        {form.role === "employer" && (
          <label>
            Company name
            <input name="companyName" value={form.companyName} onChange={update} required />
          </label>
        )}
        {error && <div className="notice error">{error}</div>}
        <button className="button" type="submit" disabled={submitting}>
          <UserPlus size={18} />
          {submitting ? "Creating..." : "Create account"}
        </button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

