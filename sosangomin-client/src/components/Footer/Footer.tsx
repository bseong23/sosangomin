import Coin from '@/assets/coin.svg'
const Footer = () =>{
    return(
        <div className="h-[228px] w-full flex flex-col bg-[#16125D] pb-[8px] font-inter">
            <div className="flex justify-between px-[80px] pt-[48px] pb-[30px]">
                <div className="h-[120px] w-[288px]">
                    <p className="flex text-white pb-[28px]"><img src={Coin} alt="" className='h-[21px] w-[21px] mr-[8px]' />소상고민</p>
                    <p className="text-[#9CA3AF]">Transforming data into actionable insights</p>
                </div>
                <div className="h-[120px] w-[288px]">
                    <p className="text-white pb-[28px]">Company</p>
                    <p className="text-[#9CA3AF]">삼성소프트웨어아카데미(SSAFY)</p>
                    <p className="text-[#9CA3AF]">서울특별시 강남구 테헤란로 212</p>
                    <p className="text-[#9CA3AF]">1544-9001</p>    
                </div>
                <div className="h-[120px] w-[288px]">
                    <p className="text-white pb-[28px]">Connect</p>
                    <p className="text-[#9CA3AF]">삼성소프트웨어 아카데미 12기</p>
                    <p className="text-[#9CA3AF]">3반 306팀</p>
                </div>
            </div>
            <div className="flex text-[#9CA3AF] justify-center">
                © 2025 소상고민. All rights reserved.
            </div>
        </div>
    )
} 

export default Footer