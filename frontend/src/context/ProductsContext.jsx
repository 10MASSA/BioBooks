import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL, PRODUCTS } from '../utils/constants';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({
    pack: 1,
    book1: 0,
    book2: 0
  });

  const fetchProducts = useCallback(async () => {
    try {
      const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : '';
      const res = await fetch(`${apiBase}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const productsMap = {};
          data.forEach(p => {
            productsMap[p.id] = {
              id: p.id,
              name: p.name,
              name_ar: p.name_ar,
              name_en: p.name_en,
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : null,
              image: p.image_url,
              description: p.description,
              description_ar: p.description_ar,
              description_en: p.description_en,
              is_active: p.is_active !== undefined ? Boolean(p.is_active) : true
            };
          });
          setProducts(productsMap);
          setProductsList(data);
        } else {
          setProducts(PRODUCTS);
        }
      } else {
        setProducts(PRODUCTS);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateCartQuantity = (productId, deltaOrValue, isAbsolute = false) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const nextVal = isAbsolute ? deltaOrValue : current + deltaOrValue;
      return {
        ...prev,
        [productId]: Math.max(0, Math.min(20, nextVal))
      };
    });
  };

  const selectSingleProduct = (productId) => {
    setCart({
      pack: productId === 'pack' ? 1 : 0,
      book1: productId === 'book1' ? 1 : 0,
      book2: productId === 'book2' ? 1 : 0,
    });
  };

  return (
    <ProductsContext.Provider value={{
      products,
      productsList,
      loading,
      refreshProducts: fetchProducts,
      cart,
      setCart,
      updateCartQuantity,
      selectSingleProduct,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
