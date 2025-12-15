import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import FilterDropdown from '../components/common/FilterDropdown.jsx';
import { CheckCircle, AlertTriangle, XCircle, Wrench, LayoutGrid, List as ListIcon } from 'lucide-react';
import { getMachines } from '../api/machines';

function EquipmentPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  const statusOptions = ['All Status', 'Active', 'Warning', 'Maintenance', 'Inactive'];

  useEffect(() => {
    setLoading(true);
    getMachines()
      .then(res => {
        if (Array.isArray(res)) setMachines(res);
        else if (Array.isArray(res?.data)) setMachines(res.data);
        else setMachines([]);
      })
      .catch(() => setMachines([]))
      .finally(() => setLoading(false));
  }, []);

  const safeMachines = Array.isArray(machines) ? machines : [];
  const statusCount = safeMachines.reduce((acc, m) => {
    const status = (m.status || '').toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const equipmentStats = [
    {
      id: 1,
      title: 'Active',
      value: statusCount['active'] || 0,
      description: 'Running smoothly',
      icon: CheckCircle,
      color: 'text-status-success',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      title: 'Warning',
      value: statusCount['warning'] || 0,
      description: 'Needs attention',
      icon: AlertTriangle,
      color: 'text-status-warning',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 3,
      title: 'Maintenance',
      value: statusCount['maintenance'] || 0,
      description: 'Scheduled soon',
      icon: Wrench,
      color: 'text-primary',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      title: 'Inactive',
      value: statusCount['inactive'] || 0,
      description: 'Not running',
      icon: XCircle,
      color: 'text-status-critical',
      bgColor: 'bg-red-50'
    },
  ];

  const filteredMachines = safeMachines.filter(m => {
    return (
      selectedStatus === 'All Status' ||
      (m.status || '').toLowerCase() === selectedStatus.toLowerCase()
    );
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') return 'bg-green-100 text-green-800';
    if (s === 'warning') return 'bg-yellow-100 text-yellow-800';
    if (s === 'critical') return 'bg-red-100 text-red-800';
    if (s === 'maintenance') return 'bg-blue-100 text-blue-800';
    if (s === 'inactive') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment Monitoring</h1>
        <p className="text-gray-600">Real-time status of all industrial equipment</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipmentStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* FILTER & TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2">
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 flex items-center gap-1">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M3 6h13M6 10h7M9 14h1"/></svg>
            Filter:
          </span>
          <FilterDropdown
            options={statusOptions}
            selectedOption={selectedStatus}
            onSelect={setSelectedStatus}
            label="Status"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setViewMode('card')}
            aria-label="Card View"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setViewMode('list')}
            aria-label="List View"
          >
            <ListIcon size={20} />
          </button>
        </div>
      </div>

      {/* EQUIPMENT TABLE/CARDS */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Equipment List</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredMachines.length} of {safeMachines.length} equipment
          </p>
        </div>

        {/* List/Table View */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
                  </tr>
                ) : filteredMachines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">No equipment found.</td>
                  </tr>
                ) : (
                  filteredMachines.map((m) => (
                    <tr key={m.serial} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{m.name || m.serial}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(m.status)}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.location || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.type || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/equipment/${m.serial}`}
                          className="text-primary hover:text-primary-hover font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Card/Grid View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-400">Loading...</div>
            ) : filteredMachines.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No equipment found.</div>
            ) : (
              filteredMachines.map((m) => (
                <div key={m.serial} className="bg-gray-50 rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{m.name || m.serial}</h3>
                      <div className="text-xs text-gray-500">{m.type || '-'}</div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(m.status)}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{m.location || '-'}</div>
                  <Link
                    to={`/equipment/${m.serial}`}
                    className="block w-full text-center py-2 mt-2 text-primary hover:text-primary-hover font-medium text-sm border border-primary rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EquipmentPage;