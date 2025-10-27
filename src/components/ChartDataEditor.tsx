import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface ChartDataEditorProps {
  chartName: string;
  initialData: any[];
  onDataChange: (newData: any[]) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;

}

const ChartDataEditor: React.FC<ChartDataEditorProps> = ({
  chartName,
  initialData,
  onDataChange,
  userEmail,
  setUserEmail,
}) => {
  const [editorData, setEditorData] = useState(initialData);
  const [currentEmailInput, setCurrentEmailInput] = useState(userEmail || "");

  useEffect(() => {
    setEditorData(initialData);
  }, [initialData]);

  useEffect(() => {
    setCurrentEmailInput(userEmail || "");
  }, [userEmail]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        const { data, error } = await supabase
          .from("chart_data")
          .select("values") // Corrected column name
          .eq("email", userEmail)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("Error fetching user data:", error.message);
          onDataChange(initialData); // Reset to initial data on error or no data
        } else if (data) {
          onDataChange(data.values); // Corrected data access
        } else {
          onDataChange(initialData); // Reset to initial data if no data found
        }
      }
    };

    fetchUserData();
  }, [userEmail, onDataChange, initialData]);

  const handleAddRow = () => {
    setEditorData([...editorData, { name: "", value: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const newData = editorData.filter((_, i) => i !== index);
    setEditorData(newData);
    onDataChange(newData);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newData = editorData.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setEditorData(newData);
    onDataChange(newData);
  };

  const handleSave = async () => {
    if (userEmail) {
      const { error } = await supabase
        .from("chart_data")
        .upsert({ email: userEmail, values: editorData }, { onConflict: "email" }); // Corrected column name

      if (error) {
        console.error("Error saving data:", error.message);
      } else {
        alert("Data saved successfully!");
      }
    } else {
      alert("Please enter your email to save data.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmailInput(e.target.value);
  };

  const handleFetchData = () => {
    setUserEmail(currentEmailInput);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFetchData();
    }
  };

  return (
    <div className="chart-data-editor">
      <h3>{chartName} Data Editor</h3>
      <div  className="email-input-container">
        <label  htmlFor="editorUserEmail">Your Email:</label>
        <input
          type="email"
          style={{padding:"8px"}}
          id="editorUserEmail"
          value={currentEmailInput}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown}
          onBlur={handleFetchData}
          placeholder="Enter your email to customize charts"
        />
        <button style={{padding:"8px",marginLeft:'4px'}} onClick={handleFetchData}>Fetch Data</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {editorData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                <button onClick={() => handleRemoveRow(index)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex", justifyContent:'space-between', marginTop:'5px'}}>
          <button onClick={handleAddRow}>Add Row</button>
          <button style={{background:'#00c896'}} onClick={handleSave}>Save Data</button>

      </div>
    </div>
  );
};

export default ChartDataEditor;