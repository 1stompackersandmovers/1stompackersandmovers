import { baseApiSlice } from "./baseApiSlice";

export const settingsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      transformResponse: (response) => response.settings,
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation({
      query: (formData) => ({
        url: "/settings",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } =
  settingsApiSlice;
