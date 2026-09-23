import { baseApiSlice } from "./baseApiSlice";

export const jobsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "/jobs",
      transformResponse: (response) => response.jobs || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Jobs", id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response) => response.job || response,
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),
    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Jobs", id: "LIST" },
        { type: "Quotes", id: "LIST" },
      ],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Jobs", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
} = jobsApiSlice;
