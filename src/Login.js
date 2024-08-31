import React, { useState, useEffect } from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Login() {
  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [insights, setInsights] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Fetch pages managed by the user when profile is set
  useEffect(() => {
    if (profile) {
      fetch(`https://graph.facebook.com/me/accounts?access_token=${profile.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
          setPages(data.data);
        })
        .catch((error) => console.error('Error fetching pages:', error));
    }
  }, [profile]);

  // Fetch insights when a page is selected and dates are set
  useEffect(() => {
    if (selectedPage && profile) {
      const since = startDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const until = endDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      fetch(`https://graph.facebook.com/${selectedPage}/insights?metric=page_fans,page_engaged_users,page_impressions,page_reactions_total&period=total_over_range&since=${since}&until=${until}&access_token=${profile.accessToken}`)
        .then((response) => response.json())
        .then((data) => {
          setInsights(data.data);
        })
        .catch((error) => console.error('Error fetching insights:', error));
    }
  }, [selectedPage, profile, startDate, endDate]);

  // Handle page selection
  const handlePageSelect = (event) => {
    setSelectedPage(event.target.value);
  };

  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          appId="1179063203213147" // Replace with your actual App ID
          onResolve={(response) => {
            setProfile(response.data);
          }}
          onReject={(error) => {
            console.error('Facebook login error:', error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.picture.data.url} alt={profile.name} />

          {pages.length > 0 && (
            <div>
              <h2>Select a Page</h2>
              <select onChange={handlePageSelect}>
                <option value="">Select a page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>

              <div>
                <h2>Select Date Range</h2>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy/MM/dd"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="yyyy/MM/dd"
                />
              </div>
            </div>
          )}

          {insights && (
            <div>
              <h2>Page Insights</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {insights.map((insight) => (
                  <div
                    key={insight.name}
                    style={{
                      border: '1px solid #ccc',
                      padding: '16px',
                      margin: '8px',
                      width: '200px',
                      borderRadius: '8px',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h3>{insight.title}</h3>
                    <p>Total Followers/Fans: {insight.values.find(v => v.name === 'page_fans')?.value}</p>
                    <p>Total Engagement: {insight.values.find(v => v.name === 'page_engaged_users')?.value}</p>
                    <p>Total Impressions: {insight.values.find(v => v.name === 'page_impressions')?.value}</p>
                    <p>Total Reactions: {insight.values.find(v => v.name === 'page_reactions_total')?.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
