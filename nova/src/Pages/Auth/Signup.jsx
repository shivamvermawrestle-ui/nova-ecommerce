import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupMutation } from '../../services/productsApi'

const Signup = () => {
  const navigate = useNavigate()

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [signup, { isLoading, error }] = useSignupMutation()

  const handleChange = (event) => {
    const { name, value } = event.target

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await signup(signupData).unwrap()

      navigate('/login', {
        state: { message: 'Account created. Please log in.' },
      })
    } catch {
      // RTK Query error ko `error` mein store karega.
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center text-3xl font-semibold">Create an account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={signupData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            className="w-full border border-stone-300 p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={signupData.email}
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
            value={signupData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="w-full border border-stone-300 p-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700">
            {error.data?.message || 'Signup failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-stone-900 px-2 py-4 text-white disabled:opacity-60"
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-right">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline underline-offset-2">
          Log in
        </Link>
      </p>
    </main>
  )
}

export default Signup

