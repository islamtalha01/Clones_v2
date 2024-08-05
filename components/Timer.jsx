import { useEffect } from 'react'

function Timer({ time, setTime, timerStarted }) {
  let interval = null
  useEffect(() => {
    interval = setInterval(() => {
      setTime((time) => time + 1000)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])
  useEffect(() => {
    if (!timerStarted && time >= 0) {
      setTime(0)
      clearInterval(interval)
    }
  }, [timerStarted])

  return (
    <div className='border text-center text-lg rounded'>
      <Time time={time} />
    </div>
  )
}

export default Timer

// ---------------------------------

function Time(props) {
  return (
    <div className='timer'>
      <span className='digits'>{('0' + Math.floor((props.time / 60000) % 60)).slice(-2)}:</span>
      <span className='digits'>{('0' + Math.floor((props.time / 1000) % 60)).slice(-2)}</span>
      {/* <span className='digits mili-sec'>{('0' + ((props.time / 10) % 100)).slice(-2)}</span> */}
    </div>
  )
}
