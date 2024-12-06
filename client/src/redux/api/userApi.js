import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const userApi = createApi({
    reducerPath : 'userApi',
    baseQuery : fetchBaseQuery({
        baseUrl:"https://helpdesk-mernstack.onrender.com/api/v1/user/",
        credentials: 'include'
    }),
    tagTypes : ['users'],
    endpoints : (builder) => ({
        
        createUser : builder.mutation({
            query : (userData) => ({
                url : 'createUser',
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify(userData)
            }),
            invalidatesTags : ['users'],
        }),
        loginUser : builder.mutation({
            query : (userData) => ({
                url : 'loginUser',
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify(userData)      
            }),
            invalidatesTags : ['users']
        }),
        resetPassword : builder.mutation({
            query : ({id,password}) => ({
                url : `resetPassword/${id}`,
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({password})
                
            }),
            invalidatesTags : ['users']
        }),

        getAllUsers : builder.query({
            query : (userFilter) => {
                const params = new URLSearchParams();
                if (userFilter?.role) params.append('role', userFilter.role);
                if (userFilter?.page) params.append('page', userFilter.page);
                return {
                  url: `getAllUsers?${params.toString()}`,
                };
                
            },
            providesTags : ['users']
        }),
        getUser : builder.query({
            query : (id) => ({url : `getUser/${id}`}),
            providesTags : ['users']
        }),
        deleteUser : builder.mutation({

            query : (id) => ({
                url : `deleteUser/${id}`,
                method : 'DELETE',
                headers : {
                    'Content-Type':'application/json'
                }
            }),
            invalidatesTags : ['users']

        }),
        updateUserRole : builder.mutation({
            query : ({id, role}) => ({
                url : `updateUserRole/${id}`,
                method : 'PATCH',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({role:role})               
            }),
            invalidatesTags : ['users']
        }),
        forgotPassword : builder.mutation({
            query : (email) => ({
                url : 'forgotPassword',
                method : 'PUT',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({email})
            }),
            invalidatesTags : ['users']
        })
    })
})

export const { useCreateUserMutation, useLoginUserMutation, useResetPasswordMutation, useGetAllUsersQuery, useGetUserQuery, useDeleteUserMutation, useUpdateUserRoleMutation, useForgotPasswordMutation } = userApi;