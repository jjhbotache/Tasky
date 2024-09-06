import { useState } from "react";

const PIXABAY_API_KEY = (import.meta as any).env.VITE_PIXABAY_API_KEY;

export default function usePixabay() {
  const [loading, setLoading] = useState<boolean>(false);

  async function getImgs(text: string) {

    
    const url = new URL('https://pixabay.com/api/');
    let imgs: string[] = [];
    url.searchParams.append('key', PIXABAY_API_KEY);
    url.searchParams.append('q', text);
    url.searchParams.append('lang', 'es');
    url.searchParams.append('orientation', 'horizontal');
    url.searchParams.append('min_width', '500'); // Tamaño medio
    url.searchParams.append('min_height', '500'); // Tamaño medio

    
    setLoading(true);
    try {
      const res = await fetch(url);
      const response = await res.json();
      imgs = response.hits.map((img: any) => img.webformatURL);
    } catch (err) {
      console.error(err);
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