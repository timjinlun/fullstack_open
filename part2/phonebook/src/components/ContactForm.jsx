import InputField from "./InputField";

const ContactForm = ({ onSubmit, newName, handleNameChange, newPhoneNum, handlePhoneChange }) => {
    return (
      <form onSubmit={onSubmit}>
        <InputField label='name' value={newName} onChange={handleNameChange} />
        <InputField label='number' value={newPhoneNum} onChange={handlePhoneChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

  export default ContactForm