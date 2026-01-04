import axios from 'axios';
import { Product, Cart, User, AuthCredentials, AuthResponse } from './types';

const API_BASE_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  getCategories: () => api.get<string[]>('/products/categories'),
  getByCategory: (category: string) => api.get<Product[]>(`/products/category/${category}`),
  getLimited: (limit: number) => api.get<Product[]>(`/products?limit=${limit}`),
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// Carts API
export const cartApi = {
  getAll: () => api.get<Cart[]>('/carts'),
  getById: (id: number) => api.get<Cart>(`/carts/${id}`),
  getUserCarts: (userId: number) => api.get<Cart[]>(`/carts/user/${userId}`),
  create: (cart: Omit<Cart, 'id'>) => api.post<Cart>('/carts', cart),
  update: (id: number, cart: Partial<Cart>) => api.put<Cart>(`/carts/${id}`, cart),
  delete: (id: number) => api.delete<Cart>(`/carts/${id}`),
  addProduct: async (cartId: number, productId: number, quantity: number = 1) => {
    const cart = await cartApi.getById(cartId);
    const updatedCart = {
      ...cart.data,
      products: [
        ...cart.data.products,
        { productId, quantity }
      ]
    };
    return cartApi.update(cartId, updatedCart);
  },
};

// Users API
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
  update: (id: number, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete<User>(`/users/${id}`),
};

// Auth API
export const authApi = {
  login: (credentials: AuthCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),
  register: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
};

export default api;