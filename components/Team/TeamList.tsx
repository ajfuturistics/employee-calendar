'use client';

import { useState } from 'react';
import { updateMemberRole } from '@/app/actions/workspace';
import { MoreVertical, Shield, User as UserIcon, Briefcase } from 'lucide-react';
import Swal from 'sweetalert2';

interface TeamMember {
    _id: string; // User ID
    membershipId: string;
    name: string;
    email: string;
    role: 'OWNER' | 'HR' | 'EMPLOYEE';
}

interface TeamListProps {
    initialUsers: TeamMember[];
    currentUserRole: string;
}

export default function TeamList({ initialUsers, currentUserRole }: TeamListProps) {
    const [users, setUsers] = useState(initialUsers);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: 'HR' | 'EMPLOYEE') => {
        const confirmResult = await Swal.fire({
            title: 'Change User Role?',
            text: `Are you sure you want to change this user's role to ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change role',
            cancelButtonText: 'Cancel'
        });

        if (!confirmResult.isConfirmed) return;
        
        setUpdatingId(userId);
        try {
            const result = await updateMemberRole(userId, newRole);
            if (result?.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update',
                    text: result.error,
                    confirmButtonColor: '#2563eb',
                });
            } else {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
                Swal.fire({
                    icon: 'success',
                    title: 'Role Updated',
                    text: `User role has been changed to ${newRole}.`,
                    confirmButtonColor: '#2563eb',
                    timer: 2000,
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update role. Please try again.',
                confirmButtonColor: '#2563eb',
            });
        } finally {
            setUpdatingId(null);
        }
    };
    
    const canManageRoles = currentUserRole === 'OWNER';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ul role="list" className="divide-y divide-gray-100">
            {users.map((user) => (
                <li key={user._id} className="flex justify-between gap-x-6 py-5 px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="h-12 w-12 flex-none rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-2">
                                {user.name}
                                {user.role === 'OWNER' && <Shield className="w-3 h-3 text-purple-600" />}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        
                        {canManageRoles && user.role !== 'OWNER' ? (
                            <div className="relative inline-block text-left">
                                <select
                                    disabled={updatingId === user._id}
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value as 'HR' | 'EMPLOYEE')}
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent"
                                >
                                    <option value="EMPLOYEE">Employee</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        ) : (
                             <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                user.role === 'OWNER' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                user.role === 'HR' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' :
                                'bg-blue-50 text-blue-700 ring-blue-600/20'
                             }`}>
                                {user.role}
                            </span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
        </div>
    );
}
