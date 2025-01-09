import React from "react";
import Dropdown from "@/components/atoms/Dropdown";

type ItemRequest = {
  name: string;
  itemRequested: string;
  created: string;
  updated: string;
  status: string;
};

type ItemRequestsTableProps = {
  data: ItemRequest[];
  onStatusChange: (id: string, newStatus: string) => void;
};

export default function ItemRequestsTable({
  data,
  onStatusChange,
}: ItemRequestsTableProps) {
  const statusOptions = ["Pending", "Approved", "Completed", "Rejected"];

  const statusClasses = {
    Pending: "bg-orange-100 text-orange-600",
    Approved: "bg-yellow-100 text-yellow-600",
    Completed: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Item Requested</th>
            <th className="px-4 py-2 text-left font-semibold">Created</th>
            <th className="px-4 py-2 text-left font-semibold">Updated</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`border-t ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.itemRequested}</td>
              <td className="px-4 py-2">{item.created}</td>
              <td className="px-4 py-2">{item.updated}</td>
              <td className="px-4 py-2">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${statusClasses[item.status]}`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      {
                        Pending: "bg-orange-600",
                        Approved: "bg-yellow-600",
                        Completed: "bg-green-600",
                        Rejected: "bg-red-600",
                      }[item.status]
                    }`}
                  ></span>
                  {item.status}
                </div>
                <Dropdown
                  value={item.status}
                  options={statusOptions}
                  onChange={(newStatus) =>
                    onStatusChange(item.name, newStatus)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
