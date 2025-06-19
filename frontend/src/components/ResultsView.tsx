import { BarChart, Bar, XAxis, YAxis } from 'recharts'
import { Table } from 'react-bootstrap'

interface Props {
  results: number[]
}

export default function ResultsView({ results }: Props) {
  const data = results.map((r, i) => ({ name: `P${i+1}`, value: r }))
  return (
    <div>
      <Table striped bordered size="sm" className="w-auto">
        <tbody>
          {data.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.value.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </Table>
      <BarChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  )
}
