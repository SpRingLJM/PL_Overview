import { useState, useEffect } from 'react';
import { getCoaches } from '../services/api';
import './StaffInfo.css';

export default function StaffInfo({ teamId }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCoaches(teamId)
      .then((data) => {
        // Filter to current coach (the one whose career end is null for this team)
        const current = data.filter((c) =>
          c.career.some((car) => car.team.id === teamId && !car.end)
        );
        setCoaches(current.length > 0 ? current : data.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading staff...</span>
      </div>
    );
  }

  if (coaches.length === 0) {
    return <p className="no-data">Staff data unavailable</p>;
  }

  return (
    <div className="staff-info">
      {coaches.map((coach) => {
        const currentRole = coach.career.find(
          (c) => c.team.id === teamId && !c.end
        );
        const startDate = currentRole?.start;

        return (
          <div key={coach.id} className="staff-card">
            <img src={coach.photo} alt={coach.name} className="staff-photo" />
            <div className="staff-details">
              <h4 className="staff-name">{coach.firstname} {coach.lastname}</h4>
              <div className="staff-meta">
                <span className="staff-role">Manager</span>
                <span className="staff-nationality">{coach.nationality}</span>
              </div>
              <div className="staff-meta">
                {coach.age && <span>Age: {coach.age}</span>}
                {startDate && <span>Since: {startDate}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
