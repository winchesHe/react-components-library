import { Calendar } from '../Calendar'

export default function SingleSelect() {
  return (
    <div>
      <Calendar
        onDayChange={(date) => {
          console.log(date)
        }}
      />
    </div>
  )
}
