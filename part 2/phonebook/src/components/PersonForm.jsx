const PersonForm = ({
  handleFormSubmit,
  handleNameChange,
  handleNewNum,
  newName,
  newNumber,
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNum} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
export default PersonForm;
