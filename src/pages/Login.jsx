import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!clientId || !clientSecret) {
      setError("Debes ingresar Client ID y Client Secret.");
      return;
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const credentials = btoa(`${clientId}:${clientSecret}`);

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();

      if (data.access_token) {
        // ✅ Guardamos credenciales y token en localStorage
        localStorage.setItem("spotify_token", data.access_token);
        localStorage.setItem("spotify_client_id", clientId);
        localStorage.setItem("spotify_client_secret", clientSecret);

        navigate("/home");
      } else {
        setError("Credenciales incorrectas o fallo al obtener el token.");
      }
    } catch (err) {
      console.error("Error al conectarse con la API:", err);
      setError("Error de conexión con la API de Spotify.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#191414",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>
        {`
          .login-card {
            background: #232323;
            border-radius: 18px;
            box-shadow: 0 2px 16px #1db95422;
            padding: 2.5em 2em 2em 2em;
            max-width: 350px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: fadein 0.7s;
          }
          .login-title {
            color: #fff;
            font-weight: 800;
            font-size: 2em;
            margin-bottom: 0.7em;
            letter-spacing: 0.01em;
          }
          .login-label {
            color: #b3b3b3;
            font-weight: 600;
            margin-bottom: 0.2em;
            margin-top: 1em;
            align-self: flex-start;
          }
          .login-input {
            width: 100%;
            padding: 0.7em 1em;
            border-radius: 8px;
            border: none;
            background: #191414;
            color: #fff;
            font-size: 1em;
            margin-bottom: 0.2em;
            outline: none;
            box-shadow: 0 1px 4px #1db95411;
            transition: background 0.18s;
          }
          .login-input:focus {
            background: #232323;
          }
          .login-btn {
            margin-top: 1.5em;
            width: 100%;
            border: none;
            border-radius: 24px;
            padding: 0.7em 0;
            font-size: 1.1em;
            font-weight: 700;
            background-color: #1db954;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px #1db95433;
          }
          .login-btn:hover {
            background-color: #1ed760;
            color: #191414;
            box-shadow: 0 4px 16px #1db95444;
          }
          .login-error {
            color: #e74c3c;
            margin-top: 1em;
            font-weight: 600;
            letter-spacing: 0.01em;
            text-align: center;
          }
          @keyframes fadein {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>

      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-title">Spotify Login</div>

        <label className="login-label" htmlFor="clientId">Client ID</label>
        <input
          className="login-input"
          id="clientId"
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          autoComplete="off"
        />

        <label className="login-label" htmlFor="clientSecret">Client Secret</label>
        <input
          className="login-input"
          id="clientSecret"
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          autoComplete="off"
        />

        <button className="login-btn" type="submit">Iniciar sesión</button>

        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
