import React from "react";
import Dropdown from "@/components/atoms/Dropdown";

type ItemRequest = {
  id: string;
  name: string;
  itemRequested: string;
  created: string;
  updated: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
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

  const statusClasses: { [key in 'Pending' | 'Approved' | 'Completed' | 'Rejected']: string } = {
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
                {/* Styled Status Display */}
                <div
                  className={`flex items-center px-2 py-1 rounded-full font-medium ${
                    {
                      Pending: "bg-orange-100 text-orange-600",
                      Approved: "bg-yellow-100 text-yellow-600",
                      Completed: "bg-green-100 text-green-600",
                      Rejected: "bg-red-100 text-red-600",
                    }[item.status]
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      {
                        Pending: "bg-orange-600",
                        Approved: "bg-yellow-600",
                        Completed: "bg-green-600",
                        Rejected: "bg-red-600",
                      }[item.status]
                    }`}
                  ></span>
                  
                </div>

                {/* Dropdown for Status */}
                <Dropdown
                  value={item.status}
                  options={statusOptions}
                  onChange={(newStatus) => onStatusChange(item.id, newStatus)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
