import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:6543/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Simpan data user untuk sesi ini
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch event untuk update navbar
      window.dispatchEvent(new Event('userLogin'));
      
      // Redirect berdasarkan role_id
      const roleId = data.user.role_id;
      
      if (roleId === 2) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/order', { replace: true });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECFAE5' }}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 m-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-[#ECFAE5] rounded-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C29.9411 4 38 12.0589 38 22C38 31.9411 29.9411 40 20 40C10.0589 40 2 31.9411 2 22C2 12.0589 10.0589 4 20 4ZM20 7.2C11.8275 7.2 5.2 13.8275 5.2 22C5.2 30.1725 11.8275 36.8 20 36.8C28.1725 36.8 34.8 30.1725 34.8 22C34.8 13.8275 28.1725 7.2 20 7.2ZM19.0771 15.2H21.0771V17.2H19.0771V15.2ZM19.0771 19.2H21.0771V29.2H19.0771V19.2Z" fill="#4CAF50"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Masuk dengan Email
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Masuk sekarang untuk mengakses semua fitur pada website kantin Rumah Kayu ITERA!
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-[#4CAF50] hover:text-[#3d8b40]">
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#3d8b40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]"
          >
            Masuk
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="font-medium text-[#4CAF50] hover:text-[#3d8b40]">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 