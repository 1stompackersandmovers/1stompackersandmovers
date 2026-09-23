import { baseApiSlice } from "./baseApiSlice";

export const leadsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: (status) => (status && status !== "all" ? `/leads?status=${status}` : "/leads"),
      transformResponse: (response) => response.leads || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Leads", id })),
              { type: "Leads", id: "LIST" },
            ]
          : [{ type: "Leads", id: "LIST" }],
    }),
    createManualLead: builder.mutation({
      query: (body) => ({
        url: "/leads/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Leads", id: "LIST" }],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/leads/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Leads", id },
        { type: "Leads", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useCreateManualLeadMutation,
  useUpdateLeadMutation,
} = leadsApiSlice;
