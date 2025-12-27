'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, Link as LinkIcon } from 'lucide-react';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    inviteCode: string;
}

export default function InviteModal({ isOpen, onClose, inviteCode }: InviteModalProps) {
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setInviteLink(`${window.location.origin}/join?code=${inviteCode}`);
    }, [inviteCode]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Invite Members</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Share this link with your team members to let them join your workspace.
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                readOnly
                                value={inviteLink}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            />
                            <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`p-2.5 rounded-lg border transition-all ${
                                copied 
                                    ? 'bg-green-50 border-green-200 text-green-600' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            title="Copy Link"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
