import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const correctClientId = "a8a4eed0edad4567a0b9b50e1ba69e55";
    const correctClientSecret = "ef5724b47b9a4e7ebbf0ca8b043be1b2";

    if (user !== correctClientId || pass !== correctClientSecret) {
      setError("Credenciales incorrectas");
      return;
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = btoa(`${user}:${pass}`);
    const bodyParams = "grant_type=client_credentials";

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: bodyParams,
      });

      if (!response.ok) {
        setError("Error al conectar con la API de Spotify");
        return;
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("spotify_token", data.access_token);
        localStorage.setItem("CLIENT_ID", user);
        localStorage.setItem("CLIENT_SECRET", pass);
        navigate("/home");
      } else {
        setError("No se pudo obtener el token de Spotify");
      }
    } catch (err) {
      setError("Error de conexión con la API");
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-title">Spotify API</div>
        <div className="login-subtitle">Iniciar Sesión</div>
        <label className="login-label" htmlFor="user">Usuario</label>
        <input
          className="login-input"
          id="user"
          type="text"
          value={user}
          onChange={e => setUser(e.target.value)}
          autoComplete="username"
        />
        <label className="login-label" htmlFor="pass">Contraseña</label>
        <input
          className="login-input"
          id="pass"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          autoComplete="current-password"
        />
        <button className="login-btn" type="submit">Entrar</button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
}

export default Login;