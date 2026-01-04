import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import Hero from '@/components/Hero';
import { productApi } from '@/lib/api';
import { Product } from '@/lib/types';

const HomePage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data.slice(0, 12)); // Show limited products on homepage
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products.slice(0, 12));
      return;
    }
    
    const results = await productApi.search(query);
    setFilteredProducts(results);
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredProducts(products.slice(0, 12));
    } else {
      try {
        const response = await productApi.getByCategory(category);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error filtering by category:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FakeStore - Home</title>
        <meta name="description" content="E-commerce website using FakeStore API" />
      </Head>

      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Discover our collection of amazing products</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-800">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
              </h3>
              <span className="text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found. Try a different search.</p>
              </div>
            )}

            {selectedCategory === 'all' && (
              <div className="text-center mt-12">
                <a
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View All Products
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;