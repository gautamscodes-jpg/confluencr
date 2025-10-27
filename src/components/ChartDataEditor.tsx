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

  // Update editorData when initialData changes
  useEffect(() => {
    console.log("Updating editorData from initialData:", initialData);
    // Ensure each item has a stable ID for React keys
    const dataWithIds = initialData.map(item => ({
      ...item,
      id: item.id || Math.random().toString(36).substr(2, 9) // Generate a unique ID if not present
    }));
    setEditorData(dataWithIds);
  }, [initialData]);

  // Update email input when userEmail prop changes
  useEffect(() => {
    setCurrentEmailInput(userEmail || "");
  }, [userEmail]);

  // Fetch user data when email changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail) {
        // Reset to initial data if no email
        setEditorData(initialData);
        onDataChange(initialData);
        return;
      }

      console.log("Fetching data for email:", userEmail);

      const { data, error } = await supabase
        .from("chart_data")
        .select("values")
        .eq("email", userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user data:", error.message);
        const dataWithIds = initialData.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9)
        }));
        setEditorData(dataWithIds);
        onDataChange(dataWithIds);
      } else if (data && data.values) {
        console.log("Fetched data values:", data.values);
        const dataWithIds = data.values.map((item: any) => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9)
        }));
        setEditorData(dataWithIds);
        onDataChange(dataWithIds);
      } else {
        console.log("No data found, using initial data");
        const dataWithIds = initialData.map(item => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9)
        }));
        setEditorData(dataWithIds);
        onDataChange(dataWithIds);
      }
    };

    fetchUserData();
  }, [userEmail, onDataChange, initialData]);

  const handleAddRow = () => {
    const newRow = { name: "", value: 0, id: Math.random().toString(36).substr(2, 9) };
    const newData = [...editorData, newRow];
    setEditorData(newData);
    onDataChange(newData);
  };

  const handleRemoveRow = (id: string) => {
    console.log("handleRemoveRow: ID to remove=", id);
    console.log("handleRemoveRow: editorData before filter=", editorData);
    const newData = editorData.filter((row) => row.id !== id);
    console.log("handleRemoveRow: newData after filter=", newData);
    setEditorData(newData);
    onDataChange(newData);
  };

  const handleInputChange = (id: string, field: string, value: any) => {
    console.log("handleInputChange: id=", id, ", field=", field, ", value=", value);
    console.log("handleInputChange: editorData before update=", editorData);
    const newData = editorData.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    console.log("handleInputChange: newData after update=", newData);
    setEditorData(newData);
    onDataChange(newData);
  };

  const handleSave = async () => {
    if (userEmail) {
      // Remove the temporary IDs before saving to Supabase
      const dataToSave = editorData.map(({ id, ...rest }) => rest);
      const { error } = await supabase
        .from("chart_data")
        .upsert({ email: userEmail, chart_name: chartName, values: dataToSave }, { onConflict: "email,chart_name" });

      if (error) {
        console.error("Error saving data:", error.message);
        alert("Error saving data: " + error.message);
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
    if (currentEmailInput.trim()) {
      setUserEmail(currentEmailInput.trim());
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFetchData();
    }
  };

  return (
    <div className="chart-data-editor">
      <h3>{chartName} Data Editor</h3>
      <div className="email-input-container">
        <label htmlFor="editorUserEmail">Your Email:</label>
        <input
          type="email"
          style={{padding:"8px"}}
          id="editorUserEmail"
          value={currentEmailInput}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown}
          placeholder="Enter your email to customize charts"
        />
        <button 
          style={{padding:"8px",marginLeft:'4px'}} 
          onClick={handleFetchData}
        >
          Fetch Data
        </button>
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
          {editorData.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.name || ""}
                  onChange={(e) =>
                    handleInputChange(row.id, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.value ?? 0}
                  onChange={(e) =>
                    handleInputChange(row.id, "value", parseInt(e.target.value) || 0)
                  }
                />
              </td>
              <td>
                <button onClick={() => handleRemoveRow(row.id)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex", justifyContent:'space-between', marginTop:'5px'}}>
          <button onClick={handleAddRow}>Add Row</button>
          <button style={{background:'#00c896'}} onClick={handleSave}>
            Save Data
          </button>
      </div>
    </div>
  );
};

export default ChartDataEditor;