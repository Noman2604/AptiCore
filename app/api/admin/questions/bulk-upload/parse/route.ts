import { NextRequest, NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { getAuthUser } from "@/lib/auth-guard"

const OPTION_BASED_TYPES = ["mcq", "true_false", "msq"]
const ALLOWED_TYPES = ["mcq", "msq", "true_false", "fill_blank", "numerical", "coding"]
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const categoryId = formData.get("categoryId") as string
    const subcategoryId = formData.get("subcategoryId") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 5MB limit" },
        { status: 400 }
      )
    }

    const fileName = file.name || ""
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json(
        { success: false, error: "Only .xlsx and .xls Excel files are allowed" },
        { status: 400 }
      )
    }

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        { success: false, error: "categoryId and subcategoryId are required" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer as any)

    // Lookup worksheet by name or fallback to first sheet
    const worksheet =
      workbook.getWorksheet("Questions") ||
      workbook.getWorksheet("Sample") ||
      workbook.worksheets[0]

    if (!worksheet) {
      return NextResponse.json(
        {
          success: false,
          error: "No worksheet found in the uploaded file.",
        },
        { status: 400 }
      )
    }

    // Extract headers from first row
    const headers: Record<number, string> = {}
    const headerRow = worksheet.getRow(1)
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = String(cell.value || "").trim()
    })

    const rows: any[] = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Skip header row
      const rowObj: Record<string, any> = {}
      let hasData = false
      row.eachCell((cell, colNumber) => {
        const key = headers[colNumber]
        if (key) {
          let cellVal = cell.value
          if (cellVal && typeof cellVal === "object") {
            if ("text" in cellVal) cellVal = (cellVal as any).text
            else if ("result" in cellVal) cellVal = (cellVal as any).result
          }
          const strVal = cellVal !== null && cellVal !== undefined ? String(cellVal).trim() : ""
          rowObj[key] = strVal
          if (strVal) hasData = true
        }
      })
      if (hasData) {
        rows.push(rowObj)
      }
    })

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "The worksheet has no data rows." },
        { status: 400 }
      )
    }

    const valid: any[] = []
    const invalid: any[] = []

    rows.forEach((row, index) => {
      const rowNumber = index + 2 
      const errors: string[] = []

      const questionText = String(row.questionText || "").trim()
      if (!questionText) errors.push("questionText is required")

      const questionType = String(row.questionType || "").trim().toLowerCase()
      if (!ALLOWED_TYPES.includes(questionType)) {
        errors.push(`questionType must be one of: ${ALLOWED_TYPES.join(", ")}`)
      }

      const difficultyLevel = String(row.difficultyLevel || "medium").trim().toLowerCase() || "medium"
      if (!["easy", "medium", "hard"].includes(difficultyLevel)) {
        errors.push("difficultyLevel must be easy, medium, or hard")
      }

      const explanation = String(row.explanation || "").trim()
      if (!explanation) errors.push("explanation is required")

      let marks = parseFloat(String(row.marks))
      if (isNaN(marks) || marks < 0.25) marks = 4

      let negativeMarks = parseFloat(String(row.negativeMarks))
      if (isNaN(negativeMarks) || negativeMarks < 0) negativeMarks = 1

      let timeLimitSeconds = parseInt(String(row.timeLimitSeconds), 10)
      if (isNaN(timeLimitSeconds) || timeLimitSeconds < 10) timeLimitSeconds = 60

      const parsedRow: any = {
        questionText,
        questionType,
        difficultyLevel,
        explanation,
        marks,
        negativeMarks,
        timeLimitSeconds,
      }

      if (OPTION_BASED_TYPES.includes(questionType)) {
       
        const optionTexts: string[] = []
        for (let i = 1; i <= 4; i++) {
          const optText = String(row[`option${i}`] || "").trim()
          if (optText) optionTexts.push(optText)
        }

        const expectedCount = questionType === "true_false" ? 2 : 4
        if (optionTexts.length !== expectedCount) {
          errors.push(
            questionType === "true_false"
              ? "true_false must have exactly 2 options (option1, option2)"
              : `${questionType} must have exactly 4 options (option1–option4)`
          )
        }

        const rawCorrectAnswer = String(row.correctAnswer || "").trim()
        if (!rawCorrectAnswer) {
          errors.push("correctAnswer is required")
        }

        // Support one correct value (mcq/true_false) or comma-separated (msq)
        const correctAnswerParts = rawCorrectAnswer
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)

        const options = optionTexts.map((text) => ({
          optionText: text,
          isCorrect: correctAnswerParts.some(
            (ans) => ans.toLowerCase() === text.toLowerCase()
          ),
        }))

        const correctCount = options.filter((o) => o.isCorrect).length

        if (rawCorrectAnswer && correctCount === 0) {
          errors.push("correctAnswer doesn't exactly match any of the provided options")
        }
        
        if (correctAnswerParts.length > 0 && correctCount > correctAnswerParts.length) {
          errors.push("correctAnswer matches more than one option with identical text — options must be unique")
        }

        if (questionType === "mcq" && correctCount !== 1) {
          errors.push("mcq must have exactly 1 correct option")
        } else if (questionType === "true_false" && correctCount !== 1) {
          errors.push("true_false must have exactly 1 correct option")
        } else if (questionType === "msq" && correctCount < 2) {
          errors.push("msq must have at least 2 correct options")
        }

        parsedRow.options = options
        parsedRow.correctAnswer = rawCorrectAnswer
      } else {
        // fill_blank, numerical, coding — no options
        const correctAnswer = String(row.correctAnswer || "").trim()
        if (!correctAnswer) {
          errors.push(`correctAnswer is required for ${questionType}`)
        }
        parsedRow.correctAnswer = correctAnswer
        parsedRow.options = []
      }

      if (errors.length > 0) {
        invalid.push({ row: rowNumber, data: row, errors })
      } else {
        valid.push(parsedRow)
      }
    })

    return NextResponse.json({
      success: true,
      data: { valid, invalid },
    })
  } catch (error) {
    console.error("Bulk upload parse error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to parse file" },
      { status: 500 }
    )
  }
}