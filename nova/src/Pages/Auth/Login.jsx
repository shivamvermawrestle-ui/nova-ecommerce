import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLazyGetCurrentUserQuery, useLoginMutation } from '../../services/productsApi'

const Login = () => {
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [login, { isLoading:loginLoading, error:loginError }] = useLoginMutation()
const [getCurrentUser,{isLoading:userLoading,error:userError}]=useLazyGetCurrentUserQuery()

const isLoading=loginLoading || userLoading
const error=loginError || userError
  const handleChange = (event) => {
    const { name, value } = event.target

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login(loginData).unwrap()
      const user=await getCurrentUser().unwrap()
      if(user.role === 'ADMIN'){
        navigate('/dashboard')
      }else{   navigate(user.role==='ADMIN'? '/dashboard':'/shop')}

   
    } catch {
        //
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center text-3xl font-semibold">Login</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="w-full border border-stone-300 p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="w-full border border-stone-300 p-2"
          />
        </div>

        {loginError && (
          <p className="text-sm text-red-700">
            {error.data?.message || 'Signup failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={loginLoading}
          className="w-full rounded-xl bg-stone-900 px-2 py-4 text-white disabled:opacity-60"
        >
          {isLoading ? 'Logging...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-right">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 underline underline-offset-2">
          Log in
        </Link>
      </p>
    </main>
  )
}

export default Login

