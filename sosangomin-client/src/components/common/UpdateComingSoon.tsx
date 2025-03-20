const UpdateComingSoon = () => {
  return (
    <div className="p-8  flex flex-col items-center bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-comment mb-2">
          추후 업데이트 예정입니다
        </h2>
        <p className="text-gray-600">
          현재 이 페이지의 콘텐츠를 준비 중입니다.
        </p>
      </div>

      {/* 간단한 애니메이션 요소 */}
      <div className="relative my-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* 페이지 하단 콘텐츠 */}
      <div className="w-full max-w-sm mt-4 bg-gray-50 p-4 rounded-md">
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            빠른 시일 내에 업데이트될 예정입니다
          </li>
          <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            더 나은 서비스로 찾아뵙겠습니다
          </li>
          {/* <li className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            문의사항은 고객센터를 이용해 주세요
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default UpdateComingSoon;
