// app/(private)/home/users/[userId]/page.tsx
import React from 'react'; // Necessary for JSX
import UserEmail from './UserEmail';

interface Props {
    params: { emailId: string }; // Use params instead of router.query
}

function UserProfile({ params }: Props) {  // Get params as props
    const { emailId } = params;

    if (!emailId) {
        return <div>Loading...</div>; // Or a Skeleton component
    }

    return (
        <div>
            <UserEmail emailId={emailId} />
        </div>
    );
}

export default UserProfile;