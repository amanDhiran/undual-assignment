import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, Product } from "@/lib/types";

interface ProductState {
  categories: Category[];
  products: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  skip: number;
  hasMore: boolean
}

const initialState: ProductState = {
  categories: [],
  products: [],
  selectedCategory: null,
  searchQuery: "",
  loading: false,
  skip: 0,
  hasMore: true
};

export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await axios.get(
      "https://dummyjson.com/products/categories"
    );

    return response.data;
  }
);

interface FetchProductsParams {
  category: string | null;
  query: string;
  skip: number;
  limit: number;
}

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ category, query, skip, limit }: FetchProductsParams) => {
    let url = "https://dummyjson.com/products";
    if (category) {
      url += `/category/${category}`;
    }
    url += `?limit=${limit}&skip=${skip}`;
    if (query) {
      url = `https://dummyjson.com/products/search?q=${query}`;
      url += `&limit=${limit}&skip=${skip}`;
    }

    const response = await axios.get(url);
    return {
      products: response.data.products,
      total: response.data.total,
      skip: response.data.skip,
    };
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetPagination: (state) => {
      state.skip = 0
      state.hasMore = true
    },
    setSelectedCategory: (
      state: ProductState,
      action: PayloadAction<string | null>
    ) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Reset products array for new searches or category changes
        if (action.payload.skip === 0) {
          state.products = action.payload.products;
        } else {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        }
        state.skip = action.payload.skip + action.payload.products.length
        state.hasMore = state.products.length < action.payload.total
        state.loading = false;
      });
  },
});

export const { setSelectedCategory, setSearchQuery, resetPagination } = productSlice.actions;

export default productSlice.reducer;
