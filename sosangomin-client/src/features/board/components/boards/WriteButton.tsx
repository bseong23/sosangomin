import React from "react";
import { Link } from "react-router-dom";

interface WriteButtonProps {
  boardType: "notice" | "board";
}

const WriteButton: React.FC<WriteButtonProps> = ({ boardType }) => {
  return (
    <Link
      to={`/community/${boardType}/write`}
      className="bg-bit-main hover:bg-blue-900 text-white px-[20px] py-[5px] rounded-md"
    >
      작성하기
    </Link>
  );
};

export default WriteButton;
