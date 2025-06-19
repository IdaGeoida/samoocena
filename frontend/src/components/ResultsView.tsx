import { BarChart, Bar, XAxis, YAxis } from 'recharts'

interface Props {
  results: number[]
}

export default function ResultsView({ results }: Props) {
  const data = results.map((r, i) => ({ name: `P${i+1}`, value: r }))
  return (
    <div>
      <table>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.value.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
      <BarChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  )
}
