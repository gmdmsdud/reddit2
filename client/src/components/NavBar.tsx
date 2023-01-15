import axios from "axios";
import { setMaxListeners } from "events";
import Image from "next/image";
import Link from "next/link"
import { useState } from "react";
// import { FaSearch } from "react-icons/fa";
import { useAuthDispatch, useAuthState } from "../context/auth";

const NavBar: React.FC = () => {

  const [search, setSearch] = useState("");

  const {loading,authenticated} = useAuthState();
  const dispatch =useAuthDispatch();
  
  const handleLogout = () => {

    axios.post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");

        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
    })
  }

  // const onSearch = (e) => {
  //   e.preventDefault();
  //   if(search ===null || search === '') {
  //     axios.get(common.vaseURL + 'user')
  //     .then((res) => {
  //       setMaxListeners(res.data.userList)
  //       setCurrentPosts(res.data.userList.slice(indexOfFirstPost, indexOfLastPost))
  //     });
  //   }else  {
  //     const filterData = lists.filter((row) => row.userId.includes(search))
  //     setLists(filterData)
  //     setCurrentPosts(filterData.slice(indexOfFirstPost, indexOfLastPost))
  //     setCurrentPage(1)
  //   }
  //   setSearch('')
  // }

  // const onChangeSearch = (e) => {
  //   e.preventDefault();
  //  setSearch(e.target.value);
  // }

  return (
    <div className="fixed inset-x-0 top-0 z-10  flex items-center justify-center h-13 bg-white">
      {/* <div className="flex max-w-5xl px-4 pt-5 mx-auto">
        <div className="w-full md:mr-3 md:w-8/12"></div> */}
      {/* 로고이미지 */}
      <span className="text-2xl mt-1 px-10   md:w-6/12 font-semibold text-gray-400">
        <Link href="/">
          
            <Image
              src="/logo6.png"
              alt="logo"
              width={165}
              height={50}
            >
            </Image>
          
        </Link>
      </span>
      {/* <div className= "max-w-full px-20"> */}
        {/* <div className="relative flex items-center  bg-gray-100 border rounded hover:border-gray-700 hover:bg-white"> */}
           {/*서치 돋보기아이콘  */}
           {/* <form onSubmit={e=>onSearch(e)}> */}
            {/* <FaSearch className="ml-2 text-gray-400"/>
            
          <input 
          type="text" value={"searchTerm" } */}
          {/* // onChange={onChangeSearch}
          // enterKeyHint="go"
          // placeholder="Search..."
          // className="px-3 py-1 bg-transparent rounded h-7 focus: outline-none "
          // /> */}

           {/* </form> */}
        {/* </div> */}
      {/* </div> */}
    <div className="flex px-20">
      {!loading && ( 
        authenticated ? (
          <button className="w-20 px-2 py-1 mr-1 text-sm text-center text-white bg-gray-400 rounded h-7"
          onClick={handleLogout}>
             로그아웃
          </button>
          ) : (<>
          <Link href="/login" className="w-20 px-2 py-1 mr-2 text-sm text-center text-blue-500 border border-blue-500 rounded h-7">
              로그인
          
          </Link>
          <Link href="/register" className="w-20 px-2 py-1 text-sm text-center text-white bg-gray-400 rounded h-7">
            회원가입
            
          </Link>
          </>)
          )}
    </div>
    </div>
  )
}

export default NavBar