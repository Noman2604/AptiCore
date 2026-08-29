"use client"

import { useState } from "react"
import { toast } from "sonner"
import { UploadCloud, FileSpreadsheet, XCircle, AlertCircle, CheckCircle2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface BulkUploadWizardProps {
  categoryId: string
  subcategoryId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BulkUploadWizard({
  categoryId,
  subcategoryId,
  open,
  onOpenChange,
  onSuccess,
}: BulkUploadWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [validRows, setValidRows] = useState<any[]>([])
  const [invalidRows, setInvalidRows] = useState<any[]>([])

  const resetState = () => {
    setStep(1)
    setFile(null)
    setValidRows([])
    setInvalidRows([])
    setUploading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetState()
    onOpenChange(newOpen)
  }

  const downloadSample = async () => {
    try {
      const xlsx = await import("xlsx")
      const ws = xlsx.utils.json_to_sheet([
        {
          questionText: "What is 2+2?",
          questionType: "mcq",
          difficultyLevel: "easy",
          option1: "3",
          option2: "4",
          option3: "5",
          option4: "6",
          correctOptions: "2",
          explanation: "2+2=4",
          marks: 4,
          negativeMarks: 1,
          timeLimitSeconds: 60,
        },
        {
          questionText: "Which of these are vowels?",
          questionType: "msq",
          difficultyLevel: "medium",
          option1: "a",
          option2: "b",
          option3: "e",
          option4: "z",
          correctOptions: "1,3",
          explanation: "A and E are vowels",
          marks: 4,
          negativeMarks: 1,
          timeLimitSeconds: 60,
        },
        {
          questionText: "Write a function to return true.",
          questionType: "coding",
          difficultyLevel: "hard",
          correctAnswer: "function() { return true; }",
          explanation: "Basic boolean return.",
          marks: 4,
          negativeMarks: 1,
          timeLimitSeconds: 60,
        },
      ])
      const wb = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(wb, ws, "Sample")
      xlsx.writeFile(wb, "bulk_upload_sample.xlsx")
    } catch (error) {
      toast.error("Failed to generate sample file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadAndParse = async () => {
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("categoryId", categoryId)
      formData.append("subcategoryId", subcategoryId)

      const res = await fetch("/api/admin/questions/bulk-upload/parse", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to parse file")
      }

      setValidRows(json.data.valid)
      setInvalidRows(json.data.invalid)
      setStep(2)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error parsing file")
    } finally {
      setUploading(false)
    }
  }

  const removeInvalidRow = (indexToRemove: number) => {
    setInvalidRows((prev) => prev.filter((_, i) => i !== indexToRemove))
  }

  const handleConfirm = async () => {
    if (validRows.length === 0) {
      toast.error("No valid rows to upload.")
      return
    }

    try {
      setUploading(true)
      const res = await fetch("/api/admin/questions/bulk-upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          validRows,
          categoryId,
          subcategoryId,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to confirm upload")
      }

      toast.success(json.message || "Upload successful")
      setStep(3)
      if (onSuccess) onSuccess()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error confirming upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-200">
        <DialogHeader>
          <DialogTitle>Bulk Upload Questions</DialogTitle>
          <DialogDescription>
            {step === 1 && "Upload an Excel file to bulk import questions."}
            {step === 2 && "Review parsed data and fix errors before confirming."}
            {step === 3 && "Upload Complete!"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <div className="flex flex-col items-center text-center">
                <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select Excel File</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Must be .xlsx or .xls containing questions according to the template.
                </p>
              </div>

              <div className="w-full max-w-sm space-y-4">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <Button 
                  onClick={downloadSample} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Template
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {validRows.length} Valid
                  </Badge>
                  <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {invalidRows.length} Invalid
                  </Badge>
                </div>
              </div>

              <div className="max-h-100 overflow-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Question Type</TableHead>
                      <TableHead className="w-full">Details</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invalidRows.map((item, idx) => (
                      <TableRow key={`invalid-${idx}`} className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-l-rose-500">
                        <TableCell className="font-mono text-sm">{item.row}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Error</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.data.questionType || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium mb-1 line-clamp-1">{item.data.questionText || "No text"}</div>
                          <ul className="text-xs text-rose-600 dark:text-rose-400 list-disc list-inside">
                            {item.errors.map((err: string, eIdx: number) => (
                              <li key={eIdx}>{err}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => removeInvalidRow(idx)}>
                            <XCircle className="h-4 w-4 text-rose-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {validRows.map((row, idx) => (
                      <TableRow key={`valid-${idx}`}>
                        <TableCell className="font-mono text-sm text-muted-foreground">-</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Valid</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{row.questionType}</TableCell>
                        <TableCell className="text-sm line-clamp-1">
                          {row.questionText}
                        </TableCell>
                        <TableCell className="text-right">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}

                    {validRows.length === 0 && invalidRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No data found in file.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {invalidRows.length > 0 && (
                <div className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>You have invalid rows. You can either fix them in Excel and re-upload, or remove them here to continue uploading only the valid questions.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-emerald-100 p-3 mb-4 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Success!</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Successfully imported {validRows.length} questions into the database.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 1 && (
            <>
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button onClick={handleUploadAndParse} disabled={!file || uploading}>
                {uploading ? "Parsing..." : "Upload & Parse"}
                {!uploading && <UploadCloud className="ml-2 h-4 w-4" />}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)} disabled={uploading}>Back</Button>
              <Button 
                onClick={handleConfirm} 
                disabled={validRows.length === 0 || uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {uploading ? "Confirming..." : `Confirm ${validRows.length} Questions`}
              </Button>
            </>
          )}

          {step === 3 && (
            <Button onClick={() => handleOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
