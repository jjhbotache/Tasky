import { useState } from "react"; 

const PIXABAY_API_KEY = (import.meta as any).env.VITE_PIXABAY_API_KEY; 
export const defaultImg = 'https://pixabay.com/get/gd3a309adf2b6ea526603206f688b32009a9c80d2a6743ebc2417c5fd877365b5830fc15b8f7304b949b55aabceafb9dfedaaa0ccf14f9872504dbc954c9e7e65_640.jpg'; // Default image URL


export default function usePixabay() {
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading status

  
  async function getImgs(text: string) {
    const url = new URL('https://pixabay.com/api/'); 
    let imgs: string[] = []; 
    url.searchParams.append('key', PIXABAY_API_KEY);
    url.searchParams.append('q', text); 
    url.searchParams.append('lang', 'es'); 
    url.searchParams.append('orientation', 'horizontal'); 
    url.searchParams.append('min_width', '500'); 
    url.searchParams.append('min_height', '500'); 

    setLoading(true); 
    try {
      const res = await fetch(url); 
      const response = await res.json(); 
      imgs = response.hits.map((img: any) => img.webformatURL); // Map the response to get image URLs
    } catch (err) {
      console.error(err); 
      imgs = [defaultImg]; 
    } finally {
      setLoading(false); 
    }

    return imgs; 
  }

  return {
    loading, 
    getImgs 
  };
}