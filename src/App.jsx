import { useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [form, setForm] = useState({
    registrska: "",
    ime_priimek: "",
    vozilo: "",
    visina_spredaj: "",
    visina_sredina: "",
    visina_zadaj: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const shrani = async (e) => {
    e.preventDefault();

    const povprecna_visina =
      (Number(form.visina_spredaj) +
        Number(form.visina_sredina) +
        Number(form.visina_zadaj)) / 3;

    const { error } = await supabase.from("vozila").insert([
      {
        registrska: form.registrska,
        ime_priimek: form.ime_priimek,
        vozilo: form.vozilo,
        visina_spredaj: form.visina_spredaj,
        visina_sredina: form.visina_sredina,
        visina_zadaj: form.visina_zadaj,
        povprecna_visina,
      },
    ]);

    if (error) {
      alert("Napaka: " + error.message);
    } else {
      alert("Podatki uspešno shranjeni!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auto Show</h1>

<form onSubmit={shrani}>

  <input
    name="ime_priimek"
    placeholder="Ime in priimek"
    onChange={handleChange}
  />
  <br /><br />

  <input
    name="vozilo"
    placeholder="Vozilo"
    onChange={handleChange}
  />
  <br /><br />

  <input
    name="registrska"
    placeholder="Registrska tablica"
    onChange={handleChange}
  />
  <br /><br />

  <input
    type="number"
    name="visina_spredaj"
    placeholder="Višina spredaj"
    onChange={handleChange}
  />
  <br /><br />

  <input
    type="number"
    name="visina_sredina"
    placeholder="Stranska višina"
    onChange={handleChange}
  />
  <br /><br />

  <input
    type="number"
    name="visina_zadaj"
    placeholder="Višina zadaj"
    onChange={handleChange}
  />
  <br /><br />

  <p>
    Povprečna višina:
    {" "}
    {(
      (Number(form.visina_spredaj || 0) +
       Number(form.visina_sredina || 0) +
       Number(form.visina_zadaj || 0)) / 3
    ).toFixed(2)}
    cm
  </p>

  <button type="submit">Shrani</button>

</form>
    </div>
  );
}

export default App;