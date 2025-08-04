import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/logo2.png"

const VerifyCode = ({email2}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/verify-code', {
        email2,
        code
      });
      /* navigate('/success', { state: { email } }); */
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در تأیید کد');
    } finally {
      setLoading(false);
    }
  };

  if (!email2) {
    /* navigate('/'); */
    return null;
  }

  return (
    <div style={{ padding: '20px' }} className='text-white'>
      <div className='flex gap-2 items-center'>
        <img src={logo} className='w-10'/>
        <p className='text-green-500'>Songify</p>
      </div>
      <h1 className='text-white text-xl font-[600] mt-10 ml-5'>Enter verification code</h1>
      <p className='text-white/50 ml-5'> The code has been sent to your email {email2} </p>
      {error && <p style={{ color: 'red' }} className='ml-5'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col items-center sign'>
        <input
          className='w-[90%]'
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد 6 رقمی"
          required
          maxLength="6"
          style={{ padding: '8px', margin: '10px 0' }}
        />
        <br />
        <button type="submit" disabled={loading} className='text-blue-500'>
          {loading ? 'در حال بررسی...' : 'تأیید کد'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;