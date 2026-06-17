import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

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

  const odjava = async () => {
    await supabase.auth.signOut();
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

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error) {
      setVozila(data || []);
    }
  };

  const shrani = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Najprej se prijavi.");
      return;
    }

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
      console.log(error);
    } else {
      alert("Podatki uspešno shranjeni!");

      setForm({
        registrska: "",
        ime_priimek: "",
        vozilo: "",
        visina_spredaj: "",
        visina_sredina: "",
        visina_zadaj: "",
      });

      await naloziVozila();
    }
  };

  useEffect(() => {
    const preveriUporabnika = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        naloziVozila();
      }
    };

    preveriUporabnika();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        naloziVozila();
      } else {
        setVozila([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auto Show</h1>

      {!user ? (
        <>
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
        </>
      ) : (
        <>
          <p>
            Prijavljen: <b>{user.email}</b>
          </p>

          <button onClick={odjava}>Odjava</button>

          <hr />

          <form onSubmit={shrani}>
            <input
              name="ime_priimek"
              placeholder="Ime in priimek"
              value={form.ime_priimek}
              onChange={handleChange}
            />
            <br />
            <br />

            <input
              name="vozilo"
              placeholder="Vozilo"
              value={form.vozilo}
              onChange={handleChange}
            />
            <br />
            <br />

            <input
              name="registrska"
              placeholder="Registrska tablica"
              value={form.registrska}
              onChange={handleChange}
            />
            <br />
            <br />

            <input
              type="number"
              name="visina_spredaj"
              placeholder="Višina spredaj"
              value={form.visina_spredaj}
              onChange={handleChange}
            />
            <br />
            <br />

            <input
              type="number"
              name="visina_sredina"
              placeholder="Stranska višina"
              value={form.visina_sredina}
              onChange={handleChange}
            />
            <br />
            <br />

            <input
              type="number"
              name="visina_zadaj"
              placeholder="Višina zadaj"
              value={form.visina_zadaj}
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
        </>
      )}
    </div>
  );
}

export default App;