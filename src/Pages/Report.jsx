import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Report = () => {
  const [reportData, setReportData] = useState({
    teams: [],
    summary: {
      totalComments: 0,
      goodComments: 0,
      badComments: 0,
      goodPercentage: 0,
      badPercentage: 0
    },
    matchTypes: {
      international: { t20: {}, odi: {}, test: {} },
      domestic: { t20: {}, odi: {}, test: {} },
      league: { t20: {}, odi: {}, test: {} }
    }
  });

  const [loading, setLoading] = useState(true);

  const calculatePercentage = (value, total) => total > 0 ? Math.round((value / total) * 100) : 0; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sentiment report
        const sentimentResponse = await fetch('http://127.0.0.1:8000/api/comment_sentiment_report/');
        const sentimentData = await sentimentResponse.json();
        
        // Fetch team data
        const teamResponse = await fetch('http://127.0.0.1:8000/api/team_comment_stats/');
        const teamData = await teamResponse.json();
        
        // Fetch match type data
        const matchTypeResponse = await fetch('http://127.0.0.1:8000/api/MatchType_commentPercentage/');
        const matchTypeData = await matchTypeResponse.json();
        
        // Transform team data
        const transformedTeams = teamData.map(team => ({
          name: team.team_name,
          good: team.good_comments,
          bad: team.bad_comments
        }));

        // Transform match type data
        const transformedMatchTypes = {
          international: { t20: { good: 0, bad: 0 }, odi: { good: 0, bad: 0 }, test: { good: 0, bad: 0 } },
          domestic: { t20: { good: 0, bad: 0 }, odi: { good: 0, bad: 0 }, test: { good: 0, bad: 0 } },
          league: { t20: { good: 0, bad: 0 }, odi: { good: 0, bad: 0 }, test: { good: 0, bad: 0 } }
        };

 // In your fetchData function, keep the transformation simple:
matchTypeData.forEach(item => {
  const matchType = item.match_type.toLowerCase();
  if (transformedMatchTypes[matchType]) {
    transformedMatchTypes[matchType].t20.good = item.t20_count || 0;
    transformedMatchTypes[matchType].odi.good = item.one_day_count || 0;
    transformedMatchTypes[matchType].test.good = item.test_count || 0;
    // Since API doesn't provide bad counts, we'll leave them as 0
  }
});

        // Calculate totals
        const teamComments = transformedTeams.reduce((acc, team) => {
          acc.good += team.good;
          acc.bad += team.bad;
          return acc;
        }, { good: 0, bad: 0 });

        // Calculate match type comments
        let matchTypeGood = 0;
        let matchTypeBad = 0;
        
        Object.values(transformedMatchTypes).forEach(category => {
          matchTypeGood += category.t20.good + category.odi.good + category.test.good;
          matchTypeBad += category.t20.bad + category.odi.bad + category.test.bad;
        });

        const totalGood = teamComments.good + matchTypeGood;
        const totalBad = teamComments.bad + matchTypeBad;
        const totalComments = totalGood + totalBad;

        setReportData(prev => ({
          ...prev,
          teams: transformedTeams,
          matchTypes: transformedMatchTypes,
          summary: {
            totalComments: sentimentData.total_comments || totalComments,
            goodComments: sentimentData.good_comments || totalGood,
            badComments: sentimentData.bad_comments || totalBad,
            goodPercentage: sentimentData.good_percentage || calculatePercentage(totalGood, totalComments),
            badPercentage: sentimentData.bad_percentage || calculatePercentage(totalBad, totalComments)
          }
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('international');
  const colors = {
    good: ['#a7f3d0', '#34d399', '#059669'],
    bad: ['#fecaca', '#f87171', '#b91c1c'],
    matchTypes: ['#c7d2fe', '#a5b4fc', '#f0abfc'],
    background: '#f9fafb',
    card: '#ffffff'
  };

  const currentMatchTypes = [
    { type: 'T20', good: reportData.matchTypes[selectedCategory].t20.good, bad: reportData.matchTypes[selectedCategory].t20.bad },
    { type: 'ODI', good: reportData.matchTypes[selectedCategory].odi.good, bad: reportData.matchTypes[selectedCategory].odi.bad },
    { type: 'Test', good: reportData.matchTypes[selectedCategory].test.good, bad: reportData.matchTypes[selectedCategory].test.bad }
  ].filter(match => match.good > 0 || match.bad > 0); // Only show match types with data

  const matchTypeChartData = {
    labels: currentMatchTypes.map(match => `${match.type} `),
    datasets: [
      {
        data: currentMatchTypes.map(match => match.good),
        backgroundColor: colors.matchTypes,
        borderColor: colors.background,
        borderWidth: 2,
      },
      {
        data: currentMatchTypes.map(match => match.bad),
        backgroundColor: colors.matchTypes.map(color => `${color}80`),
        borderColor: colors.background,
        borderWidth: 2,
      }
    ],
  };

  const teamChartData = {
    labels: reportData.teams.map(team => team.name),
    datasets: [
      {
        label: 'Good Comments',
        data: reportData.teams.map(team => team.good),
        backgroundColor: colors.good[1],
        borderRadius: 6,
      },
      {
        label: 'Bad Comments',
        data: reportData.teams.map(team => team.bad),
        backgroundColor: colors.bad[1],
        borderRadius: 6,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-6 rounded-2xl p-6 lg:p-12 mx-auto lg:w-11/12" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto">
        <h1 className="text-3xl font-medium tracking-tight text-gray-800 mb-2">Comment Analytics Dashboard</h1>
        <p className="text-gray-600 mb-8">Analysis of user comments by team and match type</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Total Comments',
              value: reportData.summary.totalComments,
              color: 'blue',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              )
            },
            {
              title: 'Positive Comments',
              value: `${reportData.summary.goodComments} (${reportData.summary.goodPercentage}%)`,
              color: 'green',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              )
            },
            {
              title: 'Negative Comments',
              value: `${reportData.summary.badComments} (${reportData.summary.badPercentage}%)`,
              color: 'red',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              )
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <p className={`text-3xl font-bold mt-1 ${item.color === 'green' ? 'text-green-600' : item.color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>{item.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${item.color === 'green' ? 'bg-green-50' : item.color === 'red' ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <svg className={`w-6 h-6 ${item.color === 'green' ? 'text-green-500' : item.color === 'red' ? 'text-red-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team-wise Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Team Performance Analysis</h2>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.good[1] }}></div>
                <span className="text-sm text-gray-600">Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.bad[1] }}></div>
                <span className="text-sm text-gray-600">Negative</span>
              </div>
            </div>
          </div>
          {reportData.teams.length > 0 ? (
            <div className="h-96">
              <Bar
                data={teamChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        afterLabel: function (context) {
                          const total = reportData.teams[context.dataIndex].good + reportData.teams[context.dataIndex].bad;
                          if (total > 0) {
                            const percentage = Math.round((context.raw / total) * 100);
                            return `Percentage: ${percentage}%`;
                          }
                          return '';
                        }
                      }
                    },
                    legend: { display: false }
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">No team data available</p>
            </div>
          )}
        </div>

        {/* Match Type Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Match Type Analysis</h2>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="international">International</option>
                <option value="domestic">Domestic</option>
                <option value="league">League</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Match Type Distribution</h3>
              {currentMatchTypes.length > 0 ? (
                <div className="h-80">
                  <Doughnut
                    data={matchTypeChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '70%',
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                             
                              return `${label}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No match type data available for this category</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Match Type Comment</h3>
              {currentMatchTypes.length > 0 ? (
                <div className="space-y-6">
                  {currentMatchTypes.map((match) => {
                    const total = match.good + match.bad;
                    const goodPercentage = calculatePercentage(match.good, total);
                    const badPercentage = calculatePercentage(match.bad, total);

                    return (
                      <div key={match.type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{match.type}</span>
                          <span className="text-gray-500">{total} comments</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${goodPercentage}%`,
                              background: `linear-gradient(90deg, ${colors.good[0]}, ${colors.good[2]})`
                            }}
                          ></div>
                        </div>
                        {/* <div className="flex justify-between text-xs text-gray-500">
                          <span>{goodPercentage}% Positive</span>
                          <span>{badPercentage}% Negative</span>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No match type data available for this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;