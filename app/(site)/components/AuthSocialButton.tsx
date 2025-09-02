import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return <button 
   type="button" 
   onClick={onClick}
   className="inline-flex w-full justify-center rounded-md bg-slate-950 
   px-6 py-2 text-gray-500 shadow-sm ring-1 ring-inset hover:ring-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
   >
   <Icon />
  </button>;
};

export default AuthSocialButton;
