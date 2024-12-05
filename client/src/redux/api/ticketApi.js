import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const ticketApi = createApi({

    reducerPath : 'ticketApi',
    baseQuery : fetchBaseQuery({
        baseUrl : "https://helpdesk-mernstack.onrender.com/api/v1/ticket/",
        credentials : 'include'
    }),
    tagTypes : ['tickets'],
    endpoints : (builder) => ({
        // fetch all users ticket (for admin)
        getAllTickets: builder.query({

            query: (ticketFilter) => { 
              let baseQuery = '';
              if (ticketFilter?.status) baseQuery += `status=${ticketFilter?.status}&`;
              if (ticketFilter?.tags) baseQuery += `tags=${ticketFilter?.tags}&`;
              if (ticketFilter?.page) baseQuery += `page=${ticketFilter?.page}&`;
          
              // Remove the trailing '&' if present
              baseQuery = baseQuery.endsWith('&') ? baseQuery.slice(0, -1) : baseQuery;
          
              return { url: `getAllTickets?${baseQuery}` };
            },
            providesTags: ['tickets'],
          }),
          

        // get all customers ticket
        getAllCustomerTickets : builder.query({
            query : ({id,status,tags}) => {
                            
              let baseQuery = '';
                if(status) baseQuery += `status=${status}&`;
                if(tags) baseQuery += `tags=${tags}&`;
                return {url : `getAllCustomerTickets/${id}?${baseQuery}`};
            },
            providesTags : ['tickets']
        }),

        // get agent admin's ticket
        getAllAgentTickets : builder.query({
            query : ({id, status, tags, page}) => {
                let baseQuery = '';
                if(status) baseQuery += `status=${status}&`;
                if(tags) baseQuery += `tags=${tags}&`;
                if(page) baseQuery += `page=${page}&`;
                return {url : `getAllAgentTickets/${id}?${baseQuery}`};
            },
            providesTags : ['tickets']
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