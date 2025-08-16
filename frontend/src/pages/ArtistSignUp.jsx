import React, { useState } from 'react';
import logo from "../assets/logo2.png"
import axios from 'axios';
import { useUser } from "../context/userContext";
import { useNavigate } from 'react-router-dom';

const ArtistSignUp = () => {
  const [step, setStep] = useState(1); // 1: ایمیل, 2: کد, 3: موفقیت
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isArtist, setIsArtist] = useState(true)
  const {login} = useUser()
  const navigate = useNavigate()

  // تایمر برای ارسال مجدد کد
  const startCountdown = () => {
    setResendDisabled(true);
    let seconds = 60;
    setCountdown(seconds);
    
    const timer = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      
      if (seconds <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/send-code', { email });
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/verify-code', {
        email,
        code
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در تأیید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/verification/send-code', { email });
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ارسال مجدد کد');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async(e)=> {
    e.preventDefault()
    
    const response = await fetch("http://localhost:3000/api/account/signup", {
        method: "POST",
        body: JSON.stringify({username, email, password, isArtist}),
        headers: {
            "Content-Type" : "application/json"
        }
    })

    const json = await response.json()

    if(response.ok) {
        setError(null)
        setLoading(false)
        localStorage.setItem("user", JSON.stringify(json))
        login(json)
        navigate('/')
    }
    if(!response.ok) {
        console.log(json.error)
        setError(json.error)
        setLoading(false)
    }
  }

  return (
    <div className="verification-container text-white">
        <div className='flex items-center gap-2 my-10 ml-5'>
            <img src={logo} className='w-10'/>
            <p className='text-green-500'>Songify</p>
        </div>
      {step === 1 && (
        <div className="step flex flex-col items-center mt-10 px-10">
          <form onSubmit={handleEmailSubmit} className='flex flex-col w-[100%] sign'>
            <h2 className='text-xl font-[600] mb-2'>Please enter your E-mail</h2>
            {error && <div className="error-message">{error}</div>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
            />
            <button type="submit" className='mt-5 text-blue-500' disabled={loading}>
              {loading ? 'sending......' : 'send code'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="step flex flex-col px-5 w-[100%]">
          <h2 className='text-xl font-[600]'>Enter verification code</h2>
          <p className="email-notice text-white/50 mb-5"> The code has been sent to your email  <strong>{email}</strong>  </p>
          {error && <div className="error-message text-red-500">{error}</div>}
          <form onSubmit={handleCodeSubmit} className='w-[100%] flex flex-col sign'>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder=" 6 digits code "
              required
              maxLength="6"
            />
            <div className="buttons-container flex justify-between mt-5">
              <button type="submit"className='text-blue-500' disabled={loading}>
                {loading ? 'در حال بررسی...' : 'تأیید کد'}
              </button>
              <button 
                type="button" 
                onClick={handleResendCode} 
                disabled={resendDisabled || loading}
                className="resend-button text-blue-500"
              >
                {resendDisabled ? `ارسال مجدد (${countdown})` : 'ارسال مجدد کد'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="step success-step">
          <form className='flex flex-col w-[90%] mx-auto sign'>
            <label htmlFor="">Your Username</label>
            <input type="text" className='mb-3' value={username} onChange={(e)=> setUsername(e.target.value)} />
            <label htmlFor="">Your Password</label>
            <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)} />

            <button onClick={createAccount} className='py-3 px-5 text-black font-[700] rounded-[7px] mt-10 bg-white block mx-auto'>Create Account</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArtistSignUp;