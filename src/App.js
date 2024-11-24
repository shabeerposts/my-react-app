import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tab.jsx";
import { Button } from "./components/ui/buttons.jsx";
import { Input } from "./components/ui/input.jsx";
import { Badge } from "./components/ui/badge.jsx";
import { Search, Plus, Edit, Trash2, Check, X } from 'lucide-react';

// Mock data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'viewer', status: 'inactive' },
];

const initialRoles = [
  {
    id: 1,
    name: 'admin',
    permissions: ['create_user', 'edit_user', 'delete_user', 'manage_roles']
  },
  {
    id: 2,
    name: 'editor',
    permissions: ['edit_user', 'view_user']
  },
  {
    id: 3,
    name: 'viewer',
    permissions: ['view_user']
  },
];

const availablePermissions = [
  'create_user',
  'edit_user',
  'delete_user',
  'view_user',
  'manage_roles',
];

const RBACDashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // User management functions
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: 'New User',
      email: 'new@example.com',
      role: 'viewer',
      status: 'active'
    };
    setUsers([...users, newUser]);
    setEditingUser(newUser);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Role management functions
  const handleAddRole = () => {
    const newRole = {
      id: roles.length + 1,
      name: 'New Role',
      permissions: []
    };
    setRoles([...roles, newRole]);
    setEditingRole(newRole);
  };

  const handleUpdateRole = (updatedRole) => {
    setRoles(roles.map(role =>
      role.id === updatedRole.id ? updatedRole : role
    ));
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const togglePermission = (role, permission) => {
    const updatedRole = { ...role };
    if (updatedRole.permissions.includes(permission)) {
      updatedRole.permissions = updatedRole.permissions.filter(p => p !== permission);
    } else {
      updatedRole.permissions = [...updatedRole.permissions, permission];
    }
    handleUpdateRole(updatedRole);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>RBAC Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                onClick={selectedTab === 'users' ? handleAddUser : handleAddRole}
                className="ml-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedTab === 'users' ? 'User' : 'Role'}
              </Button>
            </div>

            <TabsContent value="users" className="mt-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-t">
                        {editingUser?.id === user.id ? (
                          <>
                            <td className="p-2">
                              <Input
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({
                                  ...editingUser,
                                  name: e.target.value
                                })}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({
                                  ...editingUser,
                                  email: e.target.value
                                })}
                              />
                            </td>
                            <td className="p-2">
                              <select
                                className="w-full p-2 border rounded"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({
                                  ...editingUser,
                                  role: e.target.value
                                })}
                              >
                                {roles.map(role => (
                                  <option key={role.id} value={role.name}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <select
                                className="w-full p-2 border rounded"
                                value={editingUser.status}
                                onChange={(e) => setEditingUser({
                                  ...editingUser,
                                  status: e.target.value
                                })}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                            <td className="p-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateUser(editingUser)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingUser(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <Badge variant="secondary">
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-0">
              <div className="space-y-4">
                {filteredRoles.map(role => (
                  <Card key={role.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        {editingRole?.id === role.id ? (
                          <div className="flex items-center gap-4">
                            <Input
                              value={editingRole.name}
                              onChange={(e) => setEditingRole({
                                ...editingRole,
                                name: e.target.value
                              })}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateRole(editingRole)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRole(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">{role.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availablePermissions.map(permission => (
                          <Badge
                            key={permission}
                            variant={role.permissions.includes(permission) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => togglePermission(role, permission)}
                          >
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RBACDashboard;