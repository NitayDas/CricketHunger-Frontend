import PropTypes from "prop-types";

const ScoreboardItem = ({ item }) => {

    const displayOverNum = item.overs.toString().endsWith(".6")
    ? Math.ceil(parseFloat(item.overs))
    : item.overs;

    return (
        <div className="flex gap-8 items-center text-slate-700">
            <h2 className="text-sm font-bold">{item.bat_team}</h2>
            <h2 className="text-sm font-bold">
                {item.score}/{item.wickets}
                <span className="ml-4">({displayOverNum})</span>
            </h2>
        </div>
    );
};

ScoreboardItem.propTypes = {
    item: PropTypes.shape({
        bat_team: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        wickets: PropTypes.number.isRequired,
        overs: PropTypes.string.isRequired,
    }).isRequired,
};

export default ScoreboardItem;