import { Calendar } from '../Calendar'

export default function DisabledSelect() {
  const disabledDate = (current: Date) => {
    const date = new Date()
    return current && current < new Date(date.setDate(date.getDate() - 1))
  }

  return (
    <div>
      <Calendar
        mode="range"
        onDayChange={(date) => {
          console.log(date)
        }}
        disabledDate={disabledDate}
      />
    </div>
  )
}
