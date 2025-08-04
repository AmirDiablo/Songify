import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo2.png"

const EmailForm = ({changeStage, getEmail}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/send-code', { email });
      /* navigate('/verify-code', { state: { email } }); */
      changeStage()
      getEmail(email)

    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }} className='text-white'>
      <div className='flex items-center gap-2'>
        <img src={logo} className='w-10' />
        <p className='text-green-500'>Songify</p>
      </div>

      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col mt-10'>
          <h1 className='text-xl font-[600] ml-5'>Please enter your E-mail</h1>
          <input
            className='w-[90%] self-center'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            required
            style={{ padding: '8px', margin: '10px 0' }}
          />
          <br />
          <button type="submit" disabled={loading} className='text-blue-500'>
            {loading ? 'sending...' : 'send code'}
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default EmailForm;