import { useEffect, useState } from 'react';
import API from "../../../api/axios.ts";
import './Settings.css';
import type {UserPreference} from "../../../types/user/UserPreference.ts";


const Settings = () => {
    const [preferences, setPreferences] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendationEnabled, setRecommendationEnabled] = useState(true);

    useEffect(() => {
        const fetchPreferences = async () => {
            setLoading(true);
            try {
                const response = await API.get<UserPreference>('/user/article/preference');
                setRecommendationEnabled(response.data.preferences_enable);
                setPreferences(response.data.preferences || []);
            } catch (err) {
                console.error('Error fetching preferences', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllTags = async () => {
            try {
                const res = await API.get('/article/tags');
                setTags(res.data.tags || []);
            } catch (e) {
                console.error(e);
            }
        };

        fetchPreferences();
        fetchAllTags();
    }, []);

    const removePreference = (tagToRemove: string) => {
        setPreferences((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await API.post('/article/tags', { search });
            setTags(res.data.tags || []);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceToggle = (tag: string) => {
        if (preferences.includes(tag)) {
            setPreferences(preferences.filter(p => p !== tag));
        } else {
            setPreferences([...preferences, tag]);
        }
    };

    const handleSave = async () => {
        try {
            await API.post('/user/article/preference', { preferences: preferences, preferences_enable: recommendationEnabled });
            alert('Preferences saved!');
        } catch (err) {
            console.error('Save failed', err);
        }
    };

    return (
        <div className="settings-container">
            {preferences.length > 0 && (
                <div className="selected-preferences">
                    <h4>Your Selected Preferences:</h4>
                    <div className="selected-tags">
                        {preferences.map((tag) => (
                            <span key={tag} className="selected-tag">
                                {tag}
                                <button className="remove-btn" onClick={() => removePreference(tag)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="toggle-container">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={recommendationEnabled}
                        onChange={() => setRecommendationEnabled(!recommendationEnabled)}
                    />
                    Enable Recommendations
                </label>
            </div>

            <div className="search-section">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="save-btn" onClick={handleSearch}>Search</button>
            </div>

            {!loading && (<button className="save-btn" onClick={handleSave}>Save Preferences</button>)}

            {loading && <div className="loader">Loading...</div>}

            <div className="tags-list">
                {tags.map(tag => (
                    <button
                        key={tag}
                        className={`tag-btn ${preferences.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handlePreferenceToggle(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Settings;