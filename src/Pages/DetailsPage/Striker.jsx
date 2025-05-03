import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Striker = ({match_id}) => {
    const [error, setError] = useState(null);
    const [strikerInfo, setStrikerInfo] = useState([]);

    useEffect(() => {

        const fetchStrikerInfo = async() =>{
            try {

                const response = await axios.get(`http://127.0.0.1:8000/ballByball/${match_id}/`);
                setStrikerInfo(response.data);
                console.log(strikerInfo)

            } 
            
            catch (error) {
                setError("There was an error fetching the StrikerInfo!");
                console.error("There was an error fetching the StrikerInfo!", error);
            }
        }

        fetchStrikerInfo()
    }, [match_id])

    if (error) {
        return <div className="text-red-500">{error}</div>;
      }
    
      // if (!strikerInfo.length) {
      //   return <div className="text-center text-gray-500">Loading...</div>;
      // }
    


      return (
        <div className="py-0">
          {strikerInfo.map((info, index) => (
            <div key={index} className="space-y-4 w-1/2 lg:w-2/3">

              {/* Current Over Stats */}
              <div className="text-sm font-semibold text-gray-600 bg-white p-2 rounded-md shadow-md">
                <span className="font-bold">Recent:</span> {info.cur_overs_stats}
              </div>

              {/* Batter Section */}
              <table className="table-auto w-full text-left border-collapse border border-gray-300 mb-4 bg-white ">
                <thead>
                  <tr>
                    <th className="p-2">Batter</th>
                    <th className="p-2">R</th>
                    <th className="p-2">B</th>
                    <th className="p-2">4s</th>
                    <th className="p-2">6s</th>
                    <th className="p-2">SR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border text-sm border-gray-300 text-slate-700">
                    <td className="p-2 font-bold">
                      {info.batsman_striker.name} *
                    </td>
                    <td className="p-2">{info.batsman_striker.runs ?? 0}</td>
                    <td className="p-2">{info.batsman_striker.balls ?? 0}</td>
                    <td className="p-2">{info.batsman_striker.fours ?? 0}</td>
                    <td className="p-2">{info.batsman_striker.sixes ?? 0}</td>
                    <td className="p-2">{info.batsman_striker.strkRate ?? 0}</td>
                  </tr>
                  <tr className="text-slate-700 text-sm">
                    <td className=" p-2 font-bold">
                      {info.batsman_non_striker.name}
                    </td>
                    <td className="p-2">{info.batsman_non_striker.runs ?? 0}</td>
                    <td className="p-2">{info.batsman_non_striker.balls ?? 0}</td>
                    <td className="p-2">{info.batsman_non_striker.fours ?? 0}</td>
                    <td className="p-2">{info.batsman_non_striker.sixes ?? 0}</td>
                    <td className="p-2">{info.batsman_non_striker.strkRate ?? 0}</td>
                  </tr>
                </tbody>
              </table>
      
              {/* Bowler Section */}
              <table className="table-auto w-full text-left border-collapse border border-gray-300 mb-4 bg-white">
                <thead>
                  <tr>
                    <th className="p-2">Bowler</th>
                    <th className="p-2">O</th>
                    <th className="p-2">M</th>
                    <th className="p-2">R</th>
                    <th className="p-2">ECO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-300 text-slate-700 text-sm">
                    <td className="p-2 font-bold">
                      {info.bowler_striker.name} *
                    </td>
                    <td className="p-2">{info.bowler_striker.overs ?? 0}</td>
                    <td className="p-2">{info.bowler_striker.maidens ?? 0}</td>
                    <td className="p-2">{info.bowler_striker.runs ?? 0}</td>
                    <td className="p-2">{info.bowler_striker.economy ?? 0}</td>
                  </tr>
                  <tr className="text-slate-700 text-sm">
                    <td className="p-2 font-bold">
                      {info.bowler_non_striker.name}
                    </td>
                    <td className="p-2">{info.bowler_non_striker.overs ?? 0}</td>
                    <td className="p-2">{info.bowler_non_striker.maidens ?? 0}</td>
                    <td className="p-2">{info.bowler_non_striker.runs ?? 0}</td>
                    <td className="p-2">{info.bowler_non_striker.economy ?? 0}</td>
                  </tr>
                </tbody>
              </table>
      
            </div>
          ))}
        </div>
      );
      
};

Striker.propTypes = {
    match_id: PropTypes.string.isRequired,
  };

export default Striker;