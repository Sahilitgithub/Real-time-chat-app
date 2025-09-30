import getUsersData from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserLists from "./components/UserLists";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getUsersData();
  return (
    <Sidebar>
      <div className="h-full">
        <UserLists items={users} />
        {children}
      </div>
    </Sidebar>
  );
};

export default UsersLayout;
