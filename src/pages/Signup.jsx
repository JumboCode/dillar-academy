import '../App.css'

export default function Signup() {
  return (
<div>
  <div id="signup" className="font-avenir shadow-2xl pt-3 space-y-6 center-div h-20 bg-white rounded-xl">
    <div className="space-y-3">
        <h3 className="text-3xl mt-10 ml-10"> Sign up </h3>
        <p className="mt-8 font-avenir signup-opacity ml-10"> Already have an account? <a className="ml-1 font-bold" href="www.google.com"> Log In</a></p>
    </div>

        {/* Form Values and the Borders */}
    <div className="space-y-3">
        <input
                required
                type="name"
                name="name"
                placeholder="Username"
                className="mt-2 font-avenir w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg">
                </input>
        <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="mt-2 font-avenir w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg">
        </input>
        <input
                required
                type="password"
                name="password"
                placeholder="Password"
                className="mt-2 font-avenir w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg">
        </input>
        <input
                required
                type="password"
                name="password"
                placeholder="Retype Password"
                className="mt-2 font-avenir w-10/12 ml-10 p-3 text-lg border-2 border-black border-opacity-20 h-10 rounded-lg">
        </input>
    </div>
        <button
      className="signup-btn ml-11 font-avenir items-center bg-gray-300 tracking-wide text-lg rounded-lg"
    >
        Sign up
    </button>
      </div>
    </div>
  )
}