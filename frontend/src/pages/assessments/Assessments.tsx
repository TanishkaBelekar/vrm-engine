import { useNavigate } from "react-router-dom";
import { useAssessments } from "../../entities/assessment/useAssessments";

const Assessments = () => {
  const navigate = useNavigate();
  const { data = [], isLoading, error } = useAssessments();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load assessments</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assessments</h2>

      {data.length === 0 && <p>No assessments found</p>}

      {data.map((a: any) => (
        <div
          key={a.id}
          onClick={() => navigate(`/assessments/${a.id}`)}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <p><strong>ID:</strong> {a.id}</p>
          <p><strong>Status:</strong> {a.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Assessments;