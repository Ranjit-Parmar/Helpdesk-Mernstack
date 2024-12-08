import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const ticketApi = createApi({

    reducerPath : 'ticketApi',
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_BASE_URL}/api/v1/ticket/`,
        credentials : 'include'
    }),
    tagTypes : ['tickets'],
    endpoints : (builder) => ({
        // fetch all users ticket (for admin)
        getAllTickets: builder.query({
            query: (ticketFilter) => {
              const params = new URLSearchParams();
          
              if (ticketFilter?.status) params.append('status', ticketFilter.status);
              if (ticketFilter?.tags) params.append('tags', ticketFilter.tags);
              if (ticketFilter?.page) params.append('page', ticketFilter.page);
          
              return {
                url: `getAllTickets?${params.toString()}`,
              };
            },
            providesTags: ['tickets'],
          }),
          
          

        // get all customers ticket
        getAllCustomerTickets: builder.query({
            query: ({ id, status, tags }) => {

              const params = new URLSearchParams();
              if (status) params.append('status', status);
              if (tags) params.append('tags', tags);
              const queryString = params.toString();
        
              return {
                url: `getAllCustomerTickets/${id}${queryString ? `?${queryString}` : ''}`,
              };
            },
            providesTags: ['tickets'],
          }),
          

        // get agent admin's ticket
        getAllAgentTickets: builder.query({
            query: ({ id, status, tags, page }) => {

              const params = new URLSearchParams();
              if (status) params.append('status', status);
              if (tags) params.append('tags', tags);
              if (page) params.append('page', page);
          
              const queryString = params.toString(); 

              return {
                url: `getAllAgentTickets/${id}${queryString ? `?${queryString}` : ''}`, 
              };
            },
            providesTags: ['tickets'],
          }),
          
        
        // get single ticket
        getSingleTicket : builder.query({
            query : (id) => ({url : `getSingleTicket/${id}`}),
            providesTags : ['tickets']
        }),

        // create ticket
        createTicket : builder.mutation({
            query : (ticketData) => ({
                url : 'createTicket',
                method : 'POST',
                body : ticketData
            }),
            invalidatesTags : ['tickets']
        }),

        // update status of ticket
        updateTicketStatus : builder.mutation({
            query : (ticketStatus) => ({
                url :  `updateTicket/${ticketStatus?.id}/status`,
                method : 'PUT',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({status: ticketStatus?.status})
            }),
            invalidatesTags : ['tickets']
        }),

        // add note to ticket
        addNotesToTicket : builder.mutation({
            query : ({id,noteData}) => ({                       
                url : `addNote/${id}/note`,
                method : 'POST',
                body : noteData
            }),
            invalidatesTags : ['tickets']
        }),

        // add assignee to ticket
        addAssigneeToTicket : builder.mutation({
            query : (ticketData) => ({
                url : `addAssignee/${ticketData?.id}`,
                method : 'PUT',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({userId:ticketData?.userId})
            }),
            invalidatesTags : ['tickets']
        }),

        // delete ticket
        deleteTicket : builder.mutation({

            query : (id) => ({
                url : `/deleteTicket/${id}`,
                method : 'DELETE',
                headers : {
                    'Content-Type':'application/json'
                }
            }),
            invalidatesTags : ['tickets']

        }),
    })
    
})


export const {useGetAllTicketsQuery, useGetAllCustomerTicketsQuery, useGetAllAgentTicketsQuery, useGetSingleTicketQuery, useCreateTicketMutation, useUpdateTicketStatusMutation, useAddNotesToTicketMutation, useAddAssigneeToTicketMutation, useDeleteTicketMutation} = ticketApi;