import { useState } from 'react'

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]


const Button = ({handleEvent, text}) => {
  return (
    <>
      <button onClick={handleEvent}>
        {text}
      </button>
    </>
  )
}


const handleVote = (index, votes, setVotes, memo, setMemo) => {
  // create a copy of the votes array
  const newVotes = [...votes]
  // increment the vote count for the given index
  newVotes[index] += 1
  // update the votes state with the new array
  setVotes(newVotes)
  // return the new array

  const newMemo = {...memo}
  if (newVotes[index] > newMemo.maxVotes) {
    newMemo.maxVotes = newVotes[index]
    newMemo.maxIndices = [index]
  }
  else if (newVotes[index] === newMemo.maxVotes) {
    // add the index to the array of indices of the anecdotes that have the maximum vote count
    newMemo.maxIndices.push(index)
  }
  setMemo(newMemo)
  return newMemo

}

const Headline = ({text}) => (<h1>{text}</h1>)


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// choose the next random anecdote .
const handleNext = (anecdotes, setSelected) => {
  // use the setSelected state setter function to update the selected state with the random index
  let rand = getRandomInt(anecdotes.length)
  setSelected(rand)
}


const App = () => {   
  // The selected anecdote
  const [selected, setSelected] = useState(0)
  // Votes for the selected anecdote
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [memo, setMemo] = useState({ maxVotes: 0, maxIndices: [] })



  return (
    <div>
      <Headline text={"Anecdote of the day"} />
      <>{anecdotes[selected]}</>
      <p>has {votes[selected]} votes.</p>

      <Button
        handleEvent={() => handleVote(selected, votes, setVotes,memo, setMemo)}
        text="vote" />

      <Button
        handleEvent={() => handleNext(anecdotes, setSelected)}
        text={'next anecdote'}/>

      <Headline text={"Anecdote with most votes"} />
      {memo.maxIndices.map((index) => (
          <p key={index}>{anecdotes[index]} </p>
        ))}
        <p>has {memo.maxVotes} votes</p>
    </div>
  )
}



export default App

