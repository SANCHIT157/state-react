import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/login', data);
      alert(res.data.message);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ✅ Header */}
      <header className="bg-blue-800 text-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <img src="/odisha_logo.png" alt="Odisha Logo" className="h-14 w-14 mr-4" />
          <h1 className="text-2xl font-bold">Odisha State Archives</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-semibold text-sm">Shri Mohan Charan Majhi</p>
            <p className="text-xs">Hon'ble Chief Minister</p>
          </div>
          <img src="/mohan-majhi.jpg" alt="CM Mohan Majhi" className="h-14 w-14 border-2 border-white shadow" />
        </div>
      </header>

      {/* ✅ Login Form */}
      <main className="flex justify-center mt-10 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" 
            >
              Log In
            </button>
            <p className="text-sm mt-2">
  <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</a>
</p>
            <p className="text-center mt-4 text-sm">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-blue-600 cursor-pointer underline"
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
