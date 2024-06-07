import { Calendar } from '../Calendar'

export default function MultipleSelect() {
  return (
    <div>
      <Calendar
        mode="multiple"
        onDayChange={(date) => {
          console.log(date)
        }}
      />
    </div>
  )
}
