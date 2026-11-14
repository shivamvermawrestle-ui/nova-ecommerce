import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('nova_token') || localStorage.getItem('token')
          : null
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes:['Cart','CartCount','Products',"Users","Orders","Wishlist","Reviews"],

  endpoints: (builder) => ({

    // CART 
      getCart:builder.query({
query:()=>'/viewCartProduct',
transformResponse:(response)=>response.data,
providesTags:['Cart']
    }),
addToCart:builder.mutation({
  query:(productId)=>({
    url:'/addtoCart',
    method:'POST',
    body:{productId},
  }),
  invalidatesTags:['Cart','CartCount']
}),
deleteCartProduct:builder.mutation({
query:(_id)=>({
  url:'/deleteCartProduct',
  method:'POST',
  body:{_id},
}),
invalidatesTags:['Cart','CartCount']
}),
    getCartCount:builder.query({
query:()=> '/countAddToCartProduct',
transformResponse:(response)=>response.data.count,
providesTags:['CartCount']
}),
updateCartProduct:builder.mutation({
query:({_id,quantity})=>({
  url:'/updateCartProduct',
  method:'POST',
  body:{_id,quantity},
}),
invalidatesTags:['Cart']
}),

// PRODUCTS 

    getProducts: builder.query({
      query: () => '/get-product',
      transformResponse: (response) => response.data,
      providesTags:['Products']
    }),
    getFeaturedProducts:builder.query({
query:()=>({
  url:"/get-product",
  params:{
    featured:true,
    page:1,
    limit:8,
  }
}),
transformResponse:(response)=>response.data,
providesTags:["Products"]
    }),
    getPaginatedProducts: builder.query({
      query: ({
        page = 1,
        limit = 12,
        search = "",
        category = "",
        sort = "newest",
      } = {}) => ({
        url: "/get-product",
        params: { page, limit, search, category, sort },
      }),
      providesTags: ["Products"],
    }),
    uploadProductImage:builder.mutation({
      query:(body)=>({
        url:'/upload-image',
        method:'POST',
        body,
      }),
    }),
    UploadProduct:builder.mutation({
  query:(productData)=>({
    url:'/upload-product',
    method:'POST',
    body:productData
  }),
  invalidatesTags:['Products']
}),
    updateProduct:builder.mutation({
  query:(productData)=>({
    url:'/update-product',
    method:'POST',
    body:productData
  }),
  invalidatesTags:['Products']
}),

deleteProduct:builder.mutation({
  query:(productId)=>({
    url:'/delete-product',
    method:'POST',
    body:{productId}
  }),
  invalidatesTags:["Products"]
}),
    getProductsByCategory: builder.query({
      query: (category) => ({
        url: '/filter-product',
        method: 'POST',
        body: { category: [category] },
      }),
      transformResponse: (response) => response.data,
    }),


    getProductDetails: builder.query({
      query: (productId) => ({
        url: '/product-details',
        method: 'POST',
        body: { productId },
      }),
      transformResponse: (response) => response.data,
    }),
    searchProducts: builder.query({
      query: (searchText) => ({
        url: '/search-product',
        params: { q: searchText },
      }),
      transformResponse: (response) => response.data,
    }),
    getCategories: builder.query({
      query: () => '/get-product-category',
      transformResponse: (response) => response.data,
    }),


// SIGNUP AND LOGIN 
    signup: builder.mutation({
      query: (newUser) => ({
        url: '/signup',
        method: 'POST',
        body:  newUser ,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.data && typeof window !== 'undefined') {
            localStorage.setItem('nova_token', data.data)
          }
        } catch {}
      },
    }),
    getCurrentUser: builder.query({
      query: () => '/user-details',
      transformResponse:(response)=>response.data
       
      }),
      logout:builder.mutation({
query:()=>({
  url:'/logout',
  method:'GET'
}),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('nova_token')
            localStorage.removeItem('token')
          }
        }
      },
      }),
      // USERS 
getUsers:builder.query({
  query:()=>'/all-users',
  transformResponse:(response)=>response.data,
  providesTags:["Users"]
}),
updateUser:builder.mutation({
  query:(userData)=>({
    url:"/update-user",
    method:"POST",
    body:userData
  }),
  invalidatesTags:["Users"]
}),
// ORDERS 
      getOrders:builder.query({
        query:()=>'/order-list',
        transformResponse:(response)=>response.data,
        providesTags:["Orders"]
      }),
    getAdminOrders:builder.query({
        query:()=>'/all-order',
        transformResponse:(response)=>response.data,
        providesTags:["Orders"]
      }),
      updateOrderStatus:builder.mutation({
        query:({orderId,orderStatus})=>({
          url:`/orders/${orderId}/status`,
          method:"PATCH",
          body:{orderStatus}
        }),
        invalidatesTags:["Orders"]
      }),
      // PAYMENT 
      createPaymentSession:builder.mutation({
        query:(checkoutData={})=>({
          url:'/payment',
        method:'POST',
        body:checkoutData
        })
      }),
getCheckoutConfirmation:builder.query({
  query:(sessionId)=>`/order-confirmation/${encodeURIComponent(sessionId)}`
}),
getUserOrderById:builder.query({
  query:(orderId)=>`/orders/${encodeURIComponent(orderId)}`,
  transformResponse:(response)=>response.data,
  providesTags:["Orders"]
}),

// WISHLIST 
getWishlist:builder.query({
  query:()=>"/wishlist",
  transformResponse:(response)=>response.data,
  providesTags:["Wishlist"]
}),
addWishlistProduct:builder.mutation({
query:(productId)=>({
  url:"/wishlist",
  method:"POST",
  body:{productId}
}),
invalidatesTags:["Wishlist"]
}),
removeWishlistProduct:builder.mutation({
query:(productId)=>({
  url:`/wishlist/${encodeURIComponent(productId)}`,
  method:"DELETE",
}),
invalidatesTags:["Wishlist"]
}),
//REVIEWS
getProductReviews:builder.query({
query:(productId)=>`/product-reviews/${encodeURIComponent(productId)}`,
transformResponse:(response)=>response.data,
providesTags:(result,error,productId)=>[
  {type:"Reviews",id:productId}
]
}),
submitProductReview:builder.mutation({
query:({productId,rating,comment})=>({
url:`/product-reviews/${encodeURIComponent(productId)}`,
method:"POST",
body:{rating,comment}
}),

invalidatesTags:(result,error,{productId})=>[
  {type:"Reviews",id:productId}
]
}),
    }),
})

export const {
  useGetProductsQuery,
  useGetPaginatedProductsQuery,
  useGetCategoriesQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
useGetProductDetailsQuery,
useSignupMutation,
useLoginMutation,
useGetCurrentUserQuery,
useLazyGetCurrentUserQuery,
useLogoutMutation,
useGetCartQuery,
useGetCartCountQuery,
useAddToCartMutation,
useUpdateCartProductMutation,
useDeleteCartProductMutation,
useCreatePaymentSessionMutation,
useGetOrdersQuery,
useGetAdminOrdersQuery,
useUpdateOrderStatusMutation,
useUploadProductMutation,
useUploadProductImageMutation,
useUpdateProductMutation,
useDeleteProductMutation,
useGetUsersQuery,
useUpdateUserMutation,
useGetCheckoutConfirmationQuery,
useGetUserOrderByIdQuery,
useGetWishlistQuery,
useAddWishlistProductMutation,
useRemoveWishlistProductMutation,
useGetProductReviewsQuery,
useSubmitProductReviewMutation,
useGetFeaturedProductsQuery,

} = productsApi

