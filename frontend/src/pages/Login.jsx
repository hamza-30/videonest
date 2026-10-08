import logo from "../assets/images/mainlogo.png";
import AuthForm from "../components/AuthForm";
import AnimatedBackground from "../components/AnimatedBackground";

function Login() {
  return (
    <div className="flex min-h-screen w-full bg-[#f5f5f5]">
      {/* Left Side: Auth Form (Full width on mobile, 50% on desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-10 relative z-10">
        <img src={logo} alt="main app logo" className="h-auto w-32 mb-8" />
        <div className="w-full flex justify-center">
          <AuthForm mode={"login"} />
        </div>
      </div>

      {/* Right Side: Brand Panel with Animations (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#8132e5] relative justify-center items-center overflow-hidden">
        <AnimatedBackground />

        {/* Marketing Text overlay */}
        <div className="z-10 text-center px-16 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Welcome back to VideoNest.
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed">
            Discover, share, and connect with creators worldwide. Your home for
            high-quality video content.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
