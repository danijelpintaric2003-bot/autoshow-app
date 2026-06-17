import "./App.css";
import logo from "./assets/devilscrew.png";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [sortiranje, setSortiranje] = useState("asc");

  const [filterKategorija, setFilterKategorija] =
    useState("Vse");

  const [form, setForm] = useState({
    registrska: "",
    ime_priimek: "",
    vozilo: "",
    kategorija: "Airride",
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
      .order("povprecna_visina", {
        ascending: sortiranje === "asc",
      });

    if (error) {
      console.log(error);
      return;
    }

    setVozila(data || []);
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
  kategorija: form.kategorija,
  visina_spredaj: form.visina_spredaj,
  visina_sredina: form.visina_sredina,
  visina_zadaj: form.visina_zadaj,
  povprecna_visina,
},
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Podatki uspešno shranjeni!");

setForm({
  registrska: "",
  ime_priimek: "",
  vozilo: "",
  kategorija: "Airride",
  visina_spredaj: "",
  visina_sredina: "",
  visina_zadaj: "",
});

    await naloziVozila();
  };

  const izbrisiVozilo = async (id) => {
    const potrdi = window.confirm(
      "Ali res želiš izbrisati vozilo?"
    );

    if (!potrdi) return;

    const { error } = await supabase
      .from("vozila")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await naloziVozila();
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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          naloziVozila();
        } else {
          setVozila([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [sortiranje]);
const prikazanaVozila =
  filterKategorija === "Vse"
    ? vozila
    : vozila.filter(
        (v) => v.kategorija === filterKategorija
      );
  return (
<div className="container">
  <div className="header">
    <img
      src={logo}
      alt="Devils Crew"
      className="logo"
    />

    <h1>
      DEVILS CREW
      <span> AUTO SHOW</span>
    </h1>
  </div>

      {!user ? (
        <>
          <h2>Prijava</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />
          <br />

          <button onClick={prijava}>
            Prijava
          </button>
        </>
      ) : (
        <>
          <p>
            Prijavljen: <b>{user.email}</b>
          </p>

          <button onClick={odjava}>
            Odjava
          </button>

          <hr />

          <form onSubmit={shrani}>
            <input
              name="ime_priimek"
              placeholder="Ime in priimek"
              value={form.ime_priimek}
              onChange={handleChange}
            />

            <br /><br />

            <input
              name="vozilo"
              placeholder="Vozilo"
              value={form.vozilo}
              onChange={handleChange}
            />
<br /><br />

<select
  name="kategorija"
  value={form.kategorija}
  onChange={handleChange}
>
  <option value="Airride">Airride</option>
  <option value="Gewinde">Gewinde</option>
  <option value="Vzmeti">Vzmeti</option>
</select>
            <br /><br />

            <input
              name="registrska"
              placeholder="Registrska tablica"
              value={form.registrska}
              onChange={handleChange}
            />

            <br /><br />

            <input
              type="number"
              name="visina_spredaj"
              placeholder="Višina spredaj"
              value={form.visina_spredaj}
              onChange={handleChange}
            />

            <br /><br />

            <input
              type="number"
              name="visina_sredina"
              placeholder="Stranska višina"
              value={form.visina_sredina}
              onChange={handleChange}
            />

            <br /><br />

            <input
              type="number"
              name="visina_zadaj"
              placeholder="Višina zadaj"
              value={form.visina_zadaj}
              onChange={handleChange}
            />

            <br /><br />

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

            <button type="submit">
              Shrani
            </button>
          </form>

          <hr />

          <h2>🏆 Lestvica vozil</h2>

          <button
            onClick={() => setSortiranje("asc")}
            style={{ marginRight: "10px" }}
          >
            Najnižja višina
          </button>

          <button
            onClick={() => setSortiranje("desc")}
          >
            Najvišja višina
          </button>
<br /><br />

<select
  value={filterKategorija}
  onChange={(e) =>
    setFilterKategorija(e.target.value)
  }
>
  <option value="Vse">Vse kategorije</option>
  <option value="Airride">Airride</option>
  <option value="Gewinde">Gewinde</option>
  <option value="Vzmeti">Vzmeti</option>
</select>
          <br />
          <br />

          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Mesto</th>
                <th>Ime in priimek</th>
                <th>Vozilo</th>
                <th>Kategorija</th>
                <th>Registrska</th>
                <th>Spredaj</th>
                <th>Stranska</th>
                <th>Zadaj</th>
                <th>Povprečje</th>
                <th>Akcija</th>
              </tr>
            </thead>

<tbody>
  {prikazanaVozila.map((v, index) => (
    <tr
      key={v.id}
      className={
        index === 0
          ? "gold"
          : index === 1
          ? "silver"
          : index === 2
          ? "bronze"
          : ""
      }
    >
      <td>
        {index === 0
          ? "🥇"
          : index === 1
          ? "🥈"
          : index === 2
          ? "🥉"
          : index + 1}
      </td>

      <td>{v.ime_priimek}</td>
      <td>{v.vozilo}</td>
      <td>{v.kategorija}</td>
      <td>{v.registrska}</td>
      <td>{v.visina_spredaj}</td>
      <td>{v.visina_sredina}</td>
      <td>{v.visina_zadaj}</td>

      <td>
        {Number(v.povprecna_visina).toFixed(2)}
      </td>

      <td>
        <button
          onClick={() => izbrisiVozilo(v.id)}
        >
          Izbriši
        </button>
      </td>
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