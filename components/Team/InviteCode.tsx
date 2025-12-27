'use client';

// This implementation was actually inlined in the page in the previous step,
// but to respect the import I put there, I'll export a simple component.
// Actually, looking back at my generated code for TeamPage, I did:
// <div className="bg-white px-4 py-2 ..."> ... {workspace?.inviteCode} </div>
// But I ALSO imported InviteCode.
// I should probably remove the import from TeamPage if I didn't use it, OR implement it.
// Checking Step 103's code for TeamPage:
// It has `import InviteCode from '@/components/Team/InviteCode';`
// But it DOES NOT use `<InviteCode />` in the JSX. It uses inline <code>{workspace?.inviteCode}</code>.
// So the import is unused and will cause a build error if the file doesn't exist, or just be an unused import.
// However, to be safe and clean, I will remove the unused import from TeamPage.
// AND I will not create the file since it's not used.

// WAIT, I cannot edit the file to remove the import easily without potentially messing up lines if I'm not careful.
// Creating the file is safer to satisfy the import, even if unused (TS handles unused imports as warnings usually, but Next.js might be strict).
// Actually, I'll create the file and generic content, just in case I want to use it later or to satisfy the import.

export default function InviteCode({ code }: { code: string }) {
  return (
    <span className="font-mono font-bold text-lg tracking-widest">{code}</span>
  );
}
