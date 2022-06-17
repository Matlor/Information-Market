const getProgressColors = (status) => {
  switch (status) {
    case "OPEN":
      return [
        "bg-blue-800",
        "bg-gray-200",
        "bg-gray-200",
        "bg-gray-200",
        "bg-gray-200",
      ];
    case "PICKANSWER":
      return [
        "bg-green-700",
        "bg-green-700",
        "bg-gray-200",
        "bg-gray-200",
        "bg-gray-200",
      ];
    case "DISPUTABLE":
      return [
        "bg-yellow-400",
        "bg-yellow-400",
        "bg-yellow-400",
        "bg-gray-200",
        "bg-gray-200",
      ];
    case "DISPUTED":
      return [
        "bg-orange-600",
        "bg-orange-600",
        "bg-orange-600",
        "bg-orange-600",
        "bg-gray-200",
      ];
    case "CLOSED":
      return [
        "bg-purple-800",
        "bg-purple-800",
        "bg-purple-800",
        "bg-purple-800",
        "bg-purple-800",
      ];
  }
  // default
  return [
    "bg-gray-800",
    "bg-gray-800",
    "bg-gray-800",
    "bg-gray-800",
    "bg-gray-800",
  ];
};

const QuestionStatusBar = ({ status }) => {
	return (
  <div className="flex flex-row gap-0.5 h-4">
    <div
      className={`basis-5 h-1.5 ${getProgressColors(status)[0]} `}
    />
    <div
      className={`basis-5 h-1.5 ${getProgressColors(status)[1]} `}
    />
    <div
      className={`basis-5 h-1.5 ${getProgressColors(status)[2]} `}
    />
    <div
      className={`basis-5 h-1.5 ${getProgressColors(status)[3]} `}
    />
    <div
      className={`basis-5 h-1.5 ${getProgressColors(status)[4]} `}
    />
  </div>);
};

export default QuestionStatusBar;
