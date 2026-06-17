import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    registrska: "",
    ime_priimek: "",
    vozilo: "",
    visina_spredaj: "",
    visina_sredina: "",
    visina_zadaj: "",
  });

  const [vozila, setVozila] = useState([]);

  const prijava = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Prijava uspešna!");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const naloziVozila = async () => {
    const { data, error } = await supabase
      .from("vozila")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setVozila(data);
    }
  };

  const shrani = async (e) => {
    e.preventDefault();

    const povprecna_visina =
      (Number(form.visina_spredaj) +
        Number(form.visina_sredina) +
        Number(form.visina_zadaj)) /
      3;

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
      await naloziVozila();
    }
  };

  useEffect(() => {
    naloziVozila();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auto Show</h1>

      <h2>Prijava</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Geslo"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={prijava}>Prijava</button>

      <hr />

      <form onSubmit={shrani}>
        <input
          name="ime_priimek"
          placeholder="Ime in priimek"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="vozilo"
          placeholder="Vozilo"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="registrska"
          placeholder="Registrska tablica"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          type="number"
          name="visina_spredaj"
          placeholder="Višina spredaj"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          type="number"
          name="visina_sredina"
          placeholder="Stranska višina"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          type="number"
          name="visina_zadaj"
          placeholder="Višina zadaj"
          onChange={handleChange}
        />
        <br />
        <br />

        <p>
          Povprečna višina:{" "}
          {(
            (Number(form.visina_spredaj || 0) +
              Number(form.visina_sredina || 0) +
              Number(form.visina_zadaj || 0)) /
            3
          ).toFixed(2)}
          cm
        </p>

        <button type="submit">Shrani</button>
      </form>

      <h2>Vnesena vozila</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Ime in priimek</th>
            <th>Vozilo</th>
            <th>Registrska</th>
            <th>Spredaj</th>
            <th>Stranska</th>
            <th>Zadaj</th>
            <th>Povprečje</th>
          </tr>
        </thead>

        <tbody>
          {vozila.map((v) => (
            <tr key={v.id}>
              <td>{v.ime_priimek}</td>
              <td>{v.vozilo}</td>
              <td>{v.registrska}</td>
              <td>{v.visina_spredaj}</td>
              <td>{v.visina_sredina}</td>
              <td>{v.visina_zadaj}</td>
              <td>{Number(v.povprecna_visina).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;