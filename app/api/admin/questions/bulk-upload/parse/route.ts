import { NextRequest, NextResponse } from "next/server"
import * as xlsx from "xlsx"

const OPTION_BASED_TYPES = ["mcq", "true_false", "msq"]
const ALLOWED_TYPES = ["mcq", "msq", "true_false", "fill_blank", "numerical", "coding"]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const categoryId = formData.get("categoryId") as string
    const subcategoryId = formData.get("subcategoryId") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        { success: false, error: "categoryId and subcategoryId are required" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = xlsx.read(buffer, { type: "buffer" })

   
    const worksheet = workbook.Sheets["Questions"]
    if (!worksheet) {
      return NextResponse.json(
        {
          success: false,
          error: `No sheet named "Questions" found in the uploaded file. Found sheets: ${workbook.SheetNames.join(", ")}`,
        },
        { status: 400 }
      )
    }

  
    const rows = xlsx.utils.sheet_to_json<any>(worksheet, { defval: "" })

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "The Questions sheet has no data rows." },
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