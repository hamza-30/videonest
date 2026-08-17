import logo from "../assets/images/mainlogo.png";
import AuthForm from "../components/AuthForm";

function Signup() {
  return (
    <div
      className={`bg-[#f5f5f58d] min-h-screen w-full flex flex-col justify-center items-center gap-y-7 px-4 py-10`}
    >
      <img src={logo} alt="main app logo" className={`h-auto w-25`} />
      <AuthForm mode={"signup"} />
    </div>
  );
}

export default Signup;
