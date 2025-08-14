interface Props {
  status: "waiting" | "ok" | "error";
  message: string;
}

const FieldStatus = ({{ status }: { status: "waiting" | "ok" | "error"; message: string }}: Props) => {
  const colors = {
    waiting: "text-gray-500",
    ok: "text-green-600",
    error: "text-red-600",
  };
  const icons = {
    waiting: "⏳",
    ok: "✅",
    error: "❌",
  };
  
  return (
    <div className={`flex items-center ${colors[status]}`}>
      <span className="mr-1">{icons[status]}</span>
      {message}
    </div>
  );
};

export default FieldStatus;