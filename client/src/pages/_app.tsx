import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '../context/auth';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials =true;
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  const fetcher = async (url: string) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error:any) {
        throw error.response.data            
    }
}
return <>
<>
  <Script defer src="https://kit.fontawesome.com/0d9816814b.js" crossOrigin="anonymous"></Script>
</>
<SWRConfig
  value = {{
    fetcher
  }}>
  <AuthProvider>
    {!authRoute && <NavBar />}
    <div className={authRoute ? "":"pt-12 bg-gray-200 min-h-screen"}>
     <Component {...pageProps} />
    </div>
  </AuthProvider>
</SWRConfig>
</>
}
export default MyApp
