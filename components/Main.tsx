"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchCategories,
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
  resetPagination,
} from "@/lib/productSlice";
import CategorySelector from "@/components/CategorySelector";
import ProductList from "@/components/ProductList";
import SearchBar from "@/components/SearchBar";

function Main() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const {
    categories,
    products,
    selectedCategory,
    searchQuery,
    loading,
    skip,
    hasMore,
  } = useSelector((state: RootState) => state.product);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const router = useRouter();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isLoadingMore]
  );

  const loadMoreProducts = useCallback(() => {
    if (!loading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      fetchProductsWithParams(selectedCategory, searchQuery, skip).then(() =>
        setIsLoadingMore(false)
      );
    }
  }, [
    dispatch,
    loading,
    isLoadingMore,
    hasMore,
    selectedCategory,
    searchQuery,
    skip,
  ]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const fetchProductsWithParams = useCallback(
    (
      category: string | null,
      query: string,
      skip: number,
      reset: boolean = false
    ) => {
      if (reset) {
        dispatch(resetPagination());
        return dispatch(fetchProducts({ category, query, skip: 0, limit: 10 }));
      } else {
        return dispatch(fetchProducts({ category, query, skip, limit: 10 }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category !== selectedCategory) {
      dispatch(setSelectedCategory(category));
    }
    if (search !== searchQuery) {
      dispatch(setSearchQuery(search || ""));
    }

    fetchProductsWithParams(category, search || "", skip, true);
  }, [
    searchParams,
    dispatch,
    fetchProductsWithParams,
    selectedCategory,
    searchQuery,
  ]);

  const handleCategoryChange = (category: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category) {
      newSearchParams.set("category", category);
    } else {
      newSearchParams.delete("category");
    }
    router.push(`/?${newSearchParams.toString()}`);
  };

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set("search", query);
    } else {
      newSearchParams.delete("search");
    }
    router.push(`/?${newSearchParams.toString()}`);
  };
  return (
    <>
      <h1 className="text-3xl font-bold my-4">Product Catalog</h1>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      <ProductList products={products} lastProductRef={lastProductElementRef} />
      {(loading || isLoadingMore) && <p>Loading products...</p>}
      {!hasMore && products.length > 0 && <p>No more products to load.</p>}
    </>
  );
}

export default Main;
