import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Guardar en localStorage
    localStorage.setItem('CLIENT_ID', clientId);
    localStorage.setItem('CLIENT_SECRET', clientSecret);

    // Redireccionar a la página principal
    navigate('/home');
  };

  return (
    <div>
      <h2>Login Spotify API</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Client ID:</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Client Secret:</label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar y entrar</button>
      </form>
    </div>
  );
}

export default Login;
