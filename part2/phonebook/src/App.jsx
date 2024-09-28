import { useState, useEffect} from 'react'
import Filter from './components/Filter'
import ContactForm from './components/ContactForm'
import Persons from './components/Persons'
import contactService from './services/contact'


const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newPhoneNum, setNewPhoneNum] = useState('')

  const [filterKey, setFilterKey] = useState('')


  // Fetch data from the server using the effect hook.
  useEffect(() => {
    contactService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])



  // A general function that could handle all the changes
  // other onChange function can call this function for lees redundency.
  const handleChange = (event, setState) =>{
    setState(event.target.value)
  }

//-------------------------------------------------{
  // handle when name changes.
  const handleNameChange = (event) => {
    handleChange(event, setNewName)
  }

  // handle when phone number changes.
  const handlePhoneChange = (event) => {
    handleChange(event,setNewPhoneNum)
  }

  // handle when filter bar changes.
  const handleFilterChange = (event) => {
    handleChange(event, setFilterKey)
  }

//-------------------------------------------------}


  
  // make filter keyword case insensitive.
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterKey.toLowerCase())
  )

  // a helper function for contact form


  function resetForm() {
    setNewName('');
    setNewPhoneNum('');
  }

  // add the contact information.
  const submitContactForm = (event) => {
    event.preventDefault();
    const contactObject = {
      name: newName,
      number: newPhoneNum
    };
    const isNameExist = persons.some(person => person.name === newName);

    if (isNameExist) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if (confirm) {
        const person = persons.find(person => person.name === newName);
        // create a new object with the updated phone number.
        const updatedPerson = { ...person, number: newPhoneNum };
        
        contactService
          .update(person.id, updatedPerson)
          .then(returnedValue => {
            // update the state with the new object.
            setPersons(persons.map(person => person.id === returnedValue.id ? returnedValue : person));
            resetForm();
          });
      }

    } else {
      contactService
        .create(contactObject)
        .then(returnedValue => {
          setPersons(persons.concat(returnedValue));
          resetForm();
        });
    }
  }
  // remove the contact information.
  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    const confirm = window.confirm(`Delete ${person.name}?`)
    if (confirm) {
      contactService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterKey} onChange={handleFilterChange} />
      <h2>add new contact</h2>
      <ContactForm 
        onSubmit={submitContactForm} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newPhoneNum={newPhoneNum} 
        handlePhoneChange={handlePhoneChange} 
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}



export default App