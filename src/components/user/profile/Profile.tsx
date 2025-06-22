import { useEffect, useState } from 'react';
import './Profile.css';
import API from "../../../api/axios.ts";
import type {User} from "../../../types/user/User.ts";


const Profile = () => {
    const [profile, setProfile] = useState<User>({
        user_id: 'u12345',
        firstname: 'Ingegneria',
        lastname: 'dell\'Informazione',
        email: 'adrien.koumgang@example.com',
        account: {
            status: 'active',
            role: 'reader'
        },
        address: {
            street: 'Via G. Caruso, 16',
            city: 'Pisa',
            state: 'Toscana',
            zip: '56122',
            country: 'Italy'
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        API.get('/user/me')
            .then(res => setProfile(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field: string, value: string) => {
        setProfile({ ...profile, [field]: value });
    };

    const handleNestedChange = <K extends 'account' | 'address', F extends keyof NonNullable<User[K]>>(
        group: K,
        field: F,
        value: string
    ) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [group]: {
                ...(prevProfile[group] || {}),
                [field]: value,
            } as User[K],
        }));
    };

    const handleSave = () => {
        setSaving(true);
        API.post('/user/me', profile)
            .then(() => alert("Profile updated successfully!"))
            .finally(() => setSaving(false));
    };

    if (loading) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="profile-group">
                <label>First Name</label>
                <input type="text" value={profile.firstname} onChange={(e) => handleChange('firstname', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>Last Name</label>
                <input type="text" value={profile.lastname} onChange={(e) => handleChange('lastname', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
            </div>
            <div className="profile-group">
                <label>Status</label>
                <input type="text" value={profile.account?.status || ''} disabled />
            </div>
            <div className="profile-group">
                <label>Role</label>
                <input type="text" value={profile.account?.role || ''} disabled />
            </div>

            <h3>Address</h3>
            <div className="profile-group">
                <label>Street</label>
                <input type="text" value={profile.address?.street || ''} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>City</label>
                <input type="text" value={profile.address?.city || ''} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>State</label>
                <input type="text" value={profile.address?.state || ''} onChange={(e) => handleNestedChange('address', 'state', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>ZIP</label>
                <input type="text" value={profile.address?.zip || ''} onChange={(e) => handleNestedChange('address', 'zip', e.target.value)} />
            </div>
            <div className="profile-group">
                <label>Country</label>
                <input type="text" value={profile.address?.country || ''} onChange={(e) => handleNestedChange('address', 'country', e.target.value)} />
            </div>

            <button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
            </button>
        </div>
    );
};

export default Profile;