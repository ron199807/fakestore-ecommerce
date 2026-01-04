import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { productApi } from '@/lib/api';
import { Product } from '@/lib/types';

interface ProductsPageProps {
  initialProducts: Product[];
  categories: string[];
  searchQuery?: string;
}

const ProductsPage: NextPage<ProductsPageProps> = ({ 
  initialProducts, 
  categories,
  searchQuery 
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await productApi.search(query);
      setProducts(results);
      setFilteredProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setLoading(true);
      try {
        const response = await productApi.getByCategory(category);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error filtering by category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);
    
    const sortedProducts = [...filteredProducts];
    switch (sortType) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Reset to original order
        sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(sortedProducts);
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
        <title>FakeStore - Products</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse our complete collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              <div className="bg-white rounded-lg shadow-md p-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-gray-600">
                {filteredProducts.length} products found
              </span>
            </div>

            {searchQuery && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  Search results for: <span className="font-semibold">"{searchQuery}"</span>
                </p>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productApi.getAll(),
      productApi.getCategories()
    ]);

    const searchQuery = context.query.search as string | undefined;

    return {
      props: {
        initialProducts: productsResponse.data,
        categories: categoriesResponse.data,
        searchQuery: searchQuery || null
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialProducts: [],
        categories: [],
        searchQuery: null
      }
    };
  }
};

export default ProductsPage;