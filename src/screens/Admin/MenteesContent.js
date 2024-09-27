import React, { useState, useEffect } from 'react';

const MenteesContent = () => {
  const [mentees, setMentees] = useState([]); // Assume you fetch this from an API or local data
  const [filteredMentees, setFilteredMentees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);

  useEffect(() => {
    // Fetch mentees and set state
    const fetchMentees = async () => {
      // Fetch your mentees data here
      // Example: const response = await fetch('/api/mentees');
      // const data = await response.json();
      // setMentees(data);
    };

    fetchMentees();
  }, []);

  useEffect(() => {
    // Filter mentees based on the search term
    const filtered = mentees.filter((mentee) =>
      mentee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMentees(filtered);
  }, [searchTerm, mentees]);

  // Define the handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedMentee((prev) => ({ ...prev, [name]: value }));
  };

  // Define the handleSave function
  const handleSave = () => {
    if (selectedMentee) {
      // Logic to save changes to the mentee
      // Example: Save the updated mentee back to the server or update local state
      setMentees((prev) => prev.map((mentee) => 
        mentee.id === selectedMentee.id ? selectedMentee : mentee
      ));
      setEditMode(false);
      setSelectedMentee(null);
    }
  };

  const handleEdit = (mentee) => {
    setSelectedMentee(mentee);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    // Logic to delete a mentee
    setMentees((prev) => prev.filter((mentee) => mentee.id !== id));
  };

  return (
    <div>
      <h2>Mentees List</h2>
      <input
        type="text"
        placeholder="Search Mentees"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredMentees.map((mentee) => (
          <li key={mentee.id}>
            {mentee.name}
            <button onClick={() => handleEdit(mentee)}>Edit</button>
            <button onClick={() => handleDelete(mentee.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editMode && selectedMentee && (
        <div>
          <h3>Edit Mentee</h3>
          <input
            type="text"
            name="name"
            value={selectedMentee.name}
            onChange={handleChange} // Call handleChange here
          />
          {/* Add other fields as necessary */}
          <button onClick={handleSave}>Save</button> {/* Call handleSave here */}
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MenteesContent;
