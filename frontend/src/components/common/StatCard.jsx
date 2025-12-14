
function StatCard({ title, value, unit, description, icon: IconComponent, color, bgColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${bgColor} ${color}`}>
          {IconComponent && <IconComponent size={24} strokeWidth={2} />}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {unit && <span className="ml-1 text-lg text-gray-600">{unit}</span>}
      </div>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
}

export default StatCard;