import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8787/api/admin";

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Settings",
    "AdminProfile",
    "Leads",
    "Quotes",
    "Jobs",
    "Invoices",
    "Bilties",
    "Vehicles",
    "Staff",
    "JobResources",
    "InvoicePayments",
    "Finance",
  ],
  endpoints: () => ({}),
});
