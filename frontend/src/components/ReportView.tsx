import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { listAssessments } from '../api/assessments'
import { Assessment } from '../types'

export default function ReportView() {
  const [data, setData] = useState<Assessment[]>([])

  useEffect(() => {
    listAssessments().then(setData)
  }, [])

  return (
    <div className="w-100">
    <Table striped bordered size="sm" className="w-auto">
      <thead>
        <tr><th>ID</th><th>Pracownicy</th><th>Wolontariusze</th><th>Wyniki</th></tr>
      </thead>
      <tbody>
        {data.map(d => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.employees_range}</td>
            <td>{d.volunteers_range}</td>
            <td>{d.results.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  )
}
