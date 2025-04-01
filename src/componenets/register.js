import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    ville: "",
    adresse: "",
    cin: "",
    num_telephone: "",
    date_naissance: "",
    sexe: "Male",
  });

  // Function to calculate age from birth date
  const calculateAge = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the user selects a date of birth, update the calculated age
    if (name === "date_naissance") {
      const age = calculateAge(value);
      setFormData({ ...formData, [name]: value, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5090/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
          <div className="space-x-4 font-myFont">
            <a href="/" className="text-blue-600">Covoiturage</a>
            <a href="#" className="text-gray-600">Trajets</a>
            <a href="#" className="text-gray-600">Terms of Use</a>
          </div>
        </div>
      </nav>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-1 text-center text-4xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="nom" placeholder="Nom" required value={formData.nom} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
              <input type="text" name="prenom" placeholder="Prénom" required value={formData.prenom} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
            </div>

            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="ville" placeholder="Ville" required value={formData.ville} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
              <input type="text" name="adresse" placeholder="Adresse" required value={formData.adresse} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="cin" placeholder="CIN" required value={formData.cin} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
              <input type="text" name="num_telephone" placeholder="Numéro Téléphone" required value={formData.num_telephone} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="date" name="date_naissance" required value={formData.date_naissance} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600" />
              {/* <input type="text" name="age" value={formData.age || ""} hidden
                className="w-full rounded-md border border-gray-300 p-2 text-gray-500 bg-gray-100 cursor-not-allowed" /> */}
                  <select name="sexe" value={formData.sexe} onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>


            <button type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white font-semibold shadow hover:bg-indigo-500 focus:outline-indigo-600">
              Register
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
