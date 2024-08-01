import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNum] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNum = (event) => {
    setNewNum(event.target.value);
  };
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const nameExists = persons.find((person) => person.name === newName);
    if (nameExists) {
      if (
        window.confirm(
          `${nameExists.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        //Updating the number
        const updatedPerson = {
          name: newName,
          number: newNumber,
        };
        noteService
          .update(nameExists.id, updatedPerson)
          .then((data) => {
            setPersons(
              persons.map((person) => {
                if (person.id !== nameExists.id) return person;
                else return data;
              })
            );
            showMessage(`Updated ${newName}`);
            setNewName("");
            setNewNum("");
          })
          .catch((error) => {
            showMessage(
              `${nameExists.name} was already removed from the server`
            );
            console.log(error.message);
            setPersons(persons.filter((person) => person.id !== nameExists.id));
          });
      }
    }
    //add a person
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      noteService.create(newPerson).then((data) => {
        setPersons(persons.concat(data));
        showMessage(`Added ${newName}`);
        setNewName("");
        setNewNum("");
      });
    }
  };

  const handleDelete = (id) => {
    const personDel = persons.find((person) => person.id === id);
    if (personDel && window.confirm(`Delete ${personDel.name}?`)) {
      noteService
        .deletePerson(id)
        .then((data) => {
          setPersons(persons.filter((person) => person.id !== id));
          showMessage(`Deleted ${personDel.name}`);
        })
        .catch((error) => {
          showMessage(`${personDel.name} was already removed from the server`);
          console.log(error.message);

          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNewNum={handleNewNum}
        handleFormSubmit={handleFormSubmit}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
