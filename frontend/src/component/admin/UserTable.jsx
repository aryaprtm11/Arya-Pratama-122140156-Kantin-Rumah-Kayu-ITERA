import React from 'react';

const UserTable = ({ users = [] }) => {
  console.log('Users data:', users); // Debugging line

  const getStatusColor = (status) => {
    return status === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleName = (role) => {
    // Mengakses role_id dari objek role
    const roleId = role?.role_id;
    console.log('Role object:', role);
    console.log('Role ID:', roleId);
    
    switch (roleId) {
      case 1:
        return 'Pembeli';
      case 2:
        return 'Admin';
      default:
        return 'Pembeli';
    }
  };

  const getRoleBadgeColor = (role) => {
    // Mengakses role_id dari objek role
    const roleId = role?.role_id;
    
    switch (roleId) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pengguna</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => {
              // Debugging line
              console.log('User data:', user);
              console.log('Role ID for user:', user.role_id);
              
              return (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nama_lengkap}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.is_active)}`}>
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Tidak ada data pengguna
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
