'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CenteredTableGenerator() {
  const [textInput, setTextInput] = useState('')
  const [tableData, setTableData] = useState<any[]>([])

  const parseInput = (input: string) => {
    const cleanedInput = input.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"')
    
    try {
      const jsonData = JSON.parse(cleanedInput)
      if (Array.isArray(jsonData)) {
        return jsonData
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        if (Array.isArray(jsonData.data)) {
          return jsonData.data
        }
        return [jsonData]
      }
    } catch (e) {
      const lines = cleanedInput.split('\n').filter(line => line.trim() !== '')
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(header => header.trim())
        return lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim())
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''
            return obj
          }, {} as Record<string, string>)
        })
      }
    }
    return []
  }

  const handleGenerateTable = () => {
    const parsedData = parseInput(textInput)
    setTableData(parsedData)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Grade Table Generator</h2>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your text here (JSON, CSV, or any structured data)"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[200px] w-full text-sm resize-none"
            />
            <Button onClick={handleGenerateTable} className="w-full py-6 text-lg font-semibold">
              Generate Table
            </Button>
          </div>
        </CardContent>
      </Card>

      {tableData.length > 0 && (
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(tableData[0]).map((key, index) => (
                      <TableHead key={index} className="font-bold">
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <TableCell key={cellIndex}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}