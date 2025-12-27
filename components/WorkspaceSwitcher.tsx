'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Building2, Plus, LogOut } from 'lucide-react';
import { getWorkspaces, switchWorkspace, leaveWorkspace } from '@/app/actions/workspace';
import JoinWorkspaceModal from '@/components/JoinWorkspaceModal';
import Swal from 'sweetalert2';

interface Workspace {
    workspace: {
        _id: string;
        name: string;
    };
    role: string;
}

export default function WorkspaceSwitcher({ currentWorkspaceId }: { currentWorkspaceId: string }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getWorkspaces().then((data: any) => {
            if (Array.isArray(data)) {
                 setWorkspaces(data);
            }
        });
    }, [currentWorkspaceId]); // Refresh when current workspace changes (e.g. after switch/join/leave)

    const handleSwitch = async (workspaceId: string) => {
        if (workspaceId === currentWorkspaceId) return;
        
        setIsLoading(true);
        setIsOpen(false);
        
        const result = await switchWorkspace(workspaceId);
        if (result?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Switch',
                text: result.error,
                confirmButtonColor: '#2563eb',
            });
            setIsLoading(false);
        } else {
            // Refresh the page to update UI with new workspace context
            router.refresh();
            setIsLoading(false);
        }
    };

    const handleLeave = async () => {
        const result = await Swal.fire({
            title: 'Leave Workspace?',
            text: 'Are you sure you want to leave this workspace?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, leave',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);
        const leaveResult = await leaveWorkspace(currentWorkspaceId);
        
        if (leaveResult?.error) {
             Swal.fire({
                icon: 'error',
                title: 'Failed to Leave',
                text: leaveResult.error,
                confirmButtonColor: '#2563eb',
            });
             setIsLoading(false);
        } else {
             // Success - backend redirects
             setIsOpen(false);
        }
    };


    const currentWorkspace = workspaces.find(w => w.workspace._id === currentWorkspaceId);

    return (
        <div className="relative min-w-[200px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="truncate">{currentWorkspace?.workspace.name || 'Select Workspace'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="py-1 max-h-60 overflow-auto">
                        {workspaces.map((w) => (
                            <button
                                key={w.workspace._id}
                                onClick={() => handleSwitch(w.workspace._id)}
                                disabled={isLoading}
                                className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="truncate">{w.workspace.name}</span>
                                {w.workspace._id === currentWorkspaceId && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                )}
                            </button>
                        ))}
                        
                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                                onClick={() => { setIsOpen(false); setIsJoinOpen(true); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-gray-50"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Join Workspace</span>
                            </button>
                            
                            {/* Only show Leave if user is not Owner (handled by backend check too but good UX) */}
                            {currentWorkspace?.role !== 'OWNER' && (
                                <button
                                    onClick={handleLeave}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Leave Workspace</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <JoinWorkspaceModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
        </div>
    );
}
