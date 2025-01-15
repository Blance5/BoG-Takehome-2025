"use client";

import { useEffect, useState } from "react";
import ItemRequestsTable from "@/components/tables/ItemRequestsTable"; // Ensure this file exists and matches expected implementation
import axios from "axios";

type Request = {
  id: string;
  name: string;
  itemRequested: string;
  created: string;
  updated: string;
  status: string;
};

export default function ItemRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const tabs = ["All", "Pending", "Approved", "Completed", "Rejected"];

  // Fetch data from API with pagination and optional status
  const fetchData = async (page = 1, status: string | null = null) => {
    try {
      const query = `?page=${page}${status ? `&status=${status.toLowerCase()}` : ""}`;
      const response = await axios.get(`http://localhost:5000/api/request${query}`);
      const { data, totalPages: fetchedTotalPages } = response.data;

      const formattedRequests = data.map((request: any) => ({
        id: request._id, // Ensure _id is mapped correctly to id
        name: request.requestorName,
        itemRequested: request.itemRequested,
        created: new Date(request.requestCreatedDate).toLocaleDateString(),
        updated: request.lastEditedDate
          ? new Date(request.lastEditedDate).toLocaleDateString()
          : "N/A",
        status: request.status,
      }));

      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data whenever currentPage or selectedTab changes
  useEffect(() => {
    fetchData(currentPage, selectedTab === "All" ? null : selectedTab);
  }, [currentPage, selectedTab]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1); // Reset to the first page when changing tabs
  };

  // Handle status change from the dropdown
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      console.log("Updating status for request:", id, newStatus);
      // Wrap the update in an array
      await axios.patch("http://localhost:5000/api/request/batch", { 
        updates: [{ id, status: newStatus }] 
      });

      console.log("Status updated successfully!");

      // Update status locally after successful update
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );

      // Also update filteredRequests to ensure the UI updates properly
      setFilteredRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
      await fetchData(currentPage, selectedTab === "All" ? null : selectedTab);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item Requests</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              selectedTab === tab
                ? "border-b-4 border-blue-500 text-blue-500 font-bold"
                : "text-gray-600 hover:text-blue-500"
            } transition`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <ItemRequestsTable data={filteredRequests} onStatusChange={handleStatusChange} />

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-4">
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            &lt;
          </button>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
