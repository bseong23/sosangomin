import { Link, useLocation } from 'react-router-dom'; // React Router 사용
import Logo from '@/assets/Logo.svg';
import Profile from '@/assets/profile.svg';

const Header = () => {
  const location = useLocation(); // 현재 URL 경로 가져오기
  const token = localStorage.getItem('token'); // localStorage에서 token 값 가져오기

  const navItems = [
    { name: '서비스 소개', path: '/service' },
    { name: '데이터 분석', path: '/analytics' },
    { name: '상권분석', path: '/community' },
    { name: '커뮤니티', path: '/resources' },
  ];

  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-300 h-[73px] font-inter">
      {/* 로고 */}
      <div className="pl-[28px]">
        <Link to="/">
          <img src={Logo} alt="로고" className="w-[116px] h-[38px] cursor-pointer" />
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex gap-[100px]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`cursor-pointer hover:text-blue-500 text-gray-600 text-[16px] ${
              location.pathname === item.path ? 'font-extrabold' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex pr-[40px]">
        {token ? (
          <>
            <img src={Profile} alt="프로필" className="flex h-[41px] w-[41px] rounded-full" />
            <div className="flex flex-col items-center pl-[12px]">
              <p className="flex text-gray-600 text-[16px]">환영합니다</p>
              <p className="flex text-gray-600 text-[16px]">박보성님</p>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="flex items-center justify-center bg-[#16125D] text-white px-[25px] py-[12px] rounded-md hover:bg-blue-800 w-[116px] h-[40px]"
            >
              로그인
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
