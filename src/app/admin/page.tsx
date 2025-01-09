"use client";

import { useEffect, useState } from "react";
import Table from "@/components/tables/ItemRequestsTable";
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

  const fetchData = async (page = 1, status: string | null = null) => {
    try {
      const query = `?page=${page}${status ? `&status=${status.toLowerCase()}` : ""}`;
      const response = await axios.get(`http://localhost:5000/api/request${query}`);
      const { data, totalPages: fetchedTotalPages } = response.data;

      const formattedRequests = data.map((request: any) => ({
        id: request.id,
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

  useEffect(() => {
    fetchData(currentPage, selectedTab === "All" ? null : selectedTab);
  }, [selectedTab, currentPage]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1); // Reset to the first page
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
      <Table data={filteredRequests} />

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
