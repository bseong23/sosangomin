import UserInfo from "@/components/mypage/UserInfo";

const MyPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <UserInfo isEditable={true} />
    </div>
  );
};

export default MyPage;
