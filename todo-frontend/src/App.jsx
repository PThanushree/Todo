import { AuthProvider, useAuth } from "./AuthContext.jsx";
import AuthScreen from "./AuthScreen.jsx";
import TodoScreen from "./TodoScreen.jsx";
import "./App.css";

function Gate() {
  const { token } = useAuth();
  return token ? <TodoScreen /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
