import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface ChartDataEditorProps {
  chartName: string;
  initialData: any[];
  onDataChange: (newData: any[]) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;

}

const ChartDataEditor: React.FC<ChartDataEditorProps> = ({ chartName, initialData, onDataChange, userEmail, setUserEmail }) => {
  const [customValues, setCustomValues] = useState<string>(JSON.stringify(initialData, null, 2));
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (userEmail) {
      loadCustomValues(userEmail);
    } else {
      setMessage('');
    }
  }, [userEmail]);

  const loadCustomValues = async (email: string) => {
    const { data, error } = await supabase
      .from('chart_data')
      .select('values')
      .eq('email', email)
      .eq('chart_name', chartName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error loading custom values:', error);
      setMessage('Error loading previous data.');
    } else if (data) {
      setMessage('Previous custom values loaded. Do you want to overwrite?');
    } else {
      setMessage('No previous custom values found for this email.');
    }
  };

  const handleSaveValues = async () => {
    if (!userEmail) {
      setMessage('Please enter your email first.');
      return;
    }
    try {
      const parsedValues = JSON.parse(customValues);
      const { data: existingData, error: existingError } = await supabase
        .from('chart_data')
        .select('id')
        .eq('email', userEmail)
        .eq('chart_name', chartName)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('chart_data')
          .update({ values: parsedValues })
          .eq('email', userEmail)
          .eq('chart_name', chartName);
        if (error) throw error;
        setMessage('Custom values updated successfully!');
      } else {
        // Insert new record
        const { error } = await supabase
          .from('chart_data')
          .insert([{ email: userEmail, chart_name: chartName, values: parsedValues }]);
        if (error) throw error;
        setMessage('Custom values saved successfully!');
      }
      onDataChange(parsedValues);
    } catch (error: any) {
      console.error('Error saving custom values:', error.message);
      setMessage(`Error saving values: ${error.message}`);
    }
  };

  if (!userEmail) {
    return (
      <div className="chart-editor">
        <h3>Please enter your email in the field above to customize {chartName}</h3>
        <div className="email-input-container">
            <label htmlFor="userEmail">Your Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail || ''}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email to customize charts"
            />
          </div>
      </div>
    );
  }

  return (
    <div className="chart-editor">
                <div className="email-input-container">
            <label htmlFor="userEmail">Your Email:</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail || ''}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email to customize charts"
            />
          </div>

      <h3>Customize {chartName}</h3>
      <textarea
        value={customValues}
        onChange={(e) => setCustomValues(e.target.value)}
        rows={10}
        cols={50}
      />
      <button onClick={handleSaveValues}>Save Custom Values</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChartDataEditor;