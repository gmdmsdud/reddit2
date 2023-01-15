import React from "react";
import cls from "classnames";
interface InputGroupProps {
    className?:string;
    type?: string;
    placeholder?: string;
    value:string;
    error: string | undefined;
    setValue: (str: string) => void;//sting을 받는데 리턴값은 void
}

const InputGroup : React.FC<InputGroupProps> = ({//react펑션타입
    className = "mb-2",//기본값 설정해주기
    type ="text",
    placeholder = "",
    error,
    value,
    setValue
})=>{
    return (
        <div className={className}>
            <input
                type={type}
                style={{ minWidth: 300}}
                className={cls(`w-full p-3 transition border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                {"border-red-500": error} //에러가 트루면 border가 빨강색으로 바뀌는 효과 편하게 주기위해 npm i classname --save  설치
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <small className='font-medium text-red-500'>{error}</small>
        </div>
    )
}
export default InputGroup
