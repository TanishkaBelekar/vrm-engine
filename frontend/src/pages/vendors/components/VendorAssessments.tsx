import { useState } from "react";

const VendorAssessments = () => {
  //  Replace with real API later
  const [data] = useState<any>(null);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  //  Loading state
  if (isLoading) {
    return <div className="p-6">Loading assessments...</div>;
  }

  //  Error state
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load assessments
      </div>
    );
  }

  // Empty state (IMPORTANT for now)
  if (!data) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">
          Assessments
        </h2>
        <p className="text-gray-500">
          No assessment data available
        </p>
      </div>
    );
  }

  // Future: when API comes
  const questions = data.questions || [];

  return (
    <div className="space-y-6">

      {/* Assessment Progress */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">
            Assessment Progress
          </h2>

          <span className="text-sm text-blue-600">
            {data.assessment_name || "--"}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: `${data.progress || 0}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500">
          {data.progress || 0}% completed
        </p>
      </div>

      {/* Questionnaire */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-semibold text-lg mb-4">
          Security Questionnaire
        </h2>

        {questions.length === 0 ? (
          <p className="text-gray-500">
            No questions available
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((q: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {q.category}
                    </span>

                    <p className="font-medium mt-2">
                      {q.question}
                    </p>

                    {q.answer && (
                      <div className="bg-blue-50 border mt-3 p-3 rounded">
                        <p className="text-sm">
                          {q.answer}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          — {q.reviewer || "Unknown"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">
                      {q.status || "--"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default VendorAssessments;