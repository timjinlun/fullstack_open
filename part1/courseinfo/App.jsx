const Header = ({course}) =>{
  console.log(course)
  return (<h1>{course}</h1>)
}




const Total = () =>{
  return (
    <p>
      Number of exercises is 0.
    </p>
  )
} 

// Helper function for Content
const Part = ({name, exercise}) =>{
  return (
    <p>{name} {exercise}</p>
  )
}

const Content = ({parts}) =>{
  return (
    <div>
      <Part name={parts[0].name} exercise={parts[0].exercise} /> 
      <Part name={parts[1].name} exercise={parts[1].exercise} />
      <Part name={parts[2].name} exercise={parts[2].exercise} />
    </div>
  )
}



const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} /> 
    </div>
  )
}

export default App