import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : '';
        const res = await fetch(`${apiBase}/api/products`);
        if (res.ok) {
          const data = await res.json();
          const productsMap = {};
          data.forEach(p => {
            productsMap[p.id] = {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : null,
              image: p.image_url,
              description: p.description
            };
          });
          setProducts(productsMap);
          setProductsList(data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, productsList, loading, refreshProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
