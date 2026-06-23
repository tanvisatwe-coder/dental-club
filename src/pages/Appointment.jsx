import { useState } from "react";
import { Link } from "react-router-dom";

export default function Appointment() {
  const [form, setForm] = useState({
    pain: 0,
    bleeding: "",
    swelling: "",
    sensitivity: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateRisk = () => {
    let score = 0;

    if (form.pain >= 7) score += 3;
    else if (form.pain >= 4) score += 2;
    else score += 1;

    if (form.bleeding === "yes") score += 2;
    if (form.swelling === "yes") score += 2;
    if (form.sensitivity === "yes") score += 1;

    if (score >= 7) return "🔴 Severe - Visit Dentist ASAP";
    if (score >= 4) return "🟡 Moderate - Needs Attention";
    return "🟢 Mild - Basic Care Needed";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateRisk());
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Book Appointment 🦷
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="number"
          name="pain"
          placeholder="Pain level (0-10)"
          className="border p-2"
          onChange={handleChange}
          required
        />

        <select name="bleeding" className="border p-2" onChange={handleChange}>
          <option value="">Bleeding?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <select name="swelling" className="border p-2" onChange={handleChange}>
          <option value="">Swelling?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <select name="sensitivity" className="border p-2" onChange={handleChange}>
          <option value="">Sensitivity?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <button className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded font-semibold">
          {result}
        </div>
      )}

      <Link to="/" className="text-blue-600 underline mt-4 block">
        Back to Login
      </Link>

    </div>
  );
}