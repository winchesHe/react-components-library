import { Calendar } from '../Calendar'

export default function RangeSelect() {
  return (
    <div>
      <Calendar
        mode="range"
        onDayChange={(date) => {
          console.log(date)
        }}
      />
    </div>
  )
}
