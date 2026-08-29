import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Question from "@/lib/models/Question"
import { verifyAccessToken } from "@/lib/jwt"

type BulkUploadOption = {
  text?: string
  optionText?: string
  value?: string
  isCorrect?: boolean
}

type BulkUploadRow = {
  questionText?: string
  questionType?: string
  difficultyLevel?: string
  explanation?: string
  marks?: string | number
  negativeMarks?: string | number
  timeLimitSeconds?: string | number
  options?: BulkUploadOption[]
  option1?: string
  option2?: string
  option3?: string
  option4?: string
  correctAnswer?: string
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const accessToken = req.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = verifyAccessToken(accessToken)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - admin access required" },
        { status: 403 }
      )
    }

    const { validRows, categoryId, subcategoryId } = await req.json()

    if (!Array.isArray(validRows) || validRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid rows provided" },
        { status: 400 }
      )
    }

    if (!categoryId || !subcategoryId) {
      return NextResponse.json(
        { success: false, error: "categoryId and subcategoryId are required" },
        { status: 400 }
      )
    }

    const finalQuestionsToInsert = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i] as BulkUploadRow
      const errors: string[] = []

      const questionText = String(row.questionText || "").trim()
      if (!questionText) errors.push("questionText is required")

      const questionType = String(row.questionType || "")
        .trim()
        .toLowerCase()
      const allowedTypes = [
        "mcq",
        "msq",
        "true_false",
        "fill_blank",
        "numerical",
        "coding",
      ]
      if (!allowedTypes.includes(questionType)) {
        errors.push(`questionType must be one of: ${allowedTypes.join(", ")}`)
      }

      const difficultyLevel = String(row.difficultyLevel || "medium")
        .trim()
        .toLowerCase()
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
      if (isNaN(timeLimitSeconds) || timeLimitSeconds < 10) {
        timeLimitSeconds = 60
      }

      const parsedRow: any = {
        questionText,
        questionType,
        categoryId,
        subcategoryId,
        difficultyLevel,
        explanation,
        marks,
        negativeMarks,
        timeLimitSeconds,
        createdBy: user.userId,
      }

      if (["mcq", "msq", "true_false"].includes(questionType)) {
        const rawOptions: BulkUploadOption[] = Array.isArray(row.options)
          ? row.options
          : [
              row.option1,
              row.option2,
              row.option3,
              row.option4,
             
            ]
              .filter((option) => String(option ?? "").trim().length > 0)
              .map((text, idx) => ({
                text,
                isCorrect: false,
              }))

        if (questionType === "true_false" && rawOptions.length !== 2) {
          errors.push("true_false must have exactly 2 options")
        } else if (rawOptions.length < 2 || rawOptions.length > 6) {
          errors.push(`${questionType} must have between 2 and 6 options`)
        }

        const options = rawOptions.map((o, idx) => ({
          text: String(o.text ?? o.optionText ?? o.value ?? "").trim(),
          order: idx + 1,
          isCorrect: Boolean(o.isCorrect),
        }))

        if (options.some((o) => !o.text)) {
          errors.push("every option must have non-empty text")
        }

        const correctCount = options.filter((o) => o.isCorrect).length
        if (questionType === "mcq" && correctCount !== 1) {
          errors.push("mcq must have exactly 1 correct option")
        } else if (questionType === "true_false" && correctCount !== 1) {
          errors.push("true_false must have exactly 1 correct option")
        } else if (questionType === "msq" && correctCount < 2) {
          errors.push("msq must have at least 2 correct options")
        }

        const correctAnswer = options
          .filter((o) => o.isCorrect)
          .map((o) => o.text)
          .join(", ")
        if (!correctAnswer) {
          errors.push("correctAnswer is required")
        }

        parsedRow.options = options
        parsedRow.correctAnswer = correctAnswer
      } else {
        const correctAnswer = String(row.correctAnswer || "").trim()
        if (!correctAnswer) {
          errors.push(`correctAnswer is required for ${questionType}`)
        }
        parsedRow.correctAnswer = correctAnswer
        parsedRow.options = []
      }

      if (errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Validation failed on row ${i + 1}: ${errors.join(", ")}`,
          },
          { status: 400 }
        )
      }

      finalQuestionsToInsert.push(parsedRow)
    }

    const inserted = await Question.insertMany(finalQuestionsToInsert)

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${inserted.length} questions`,
      insertedCount: inserted.length,
    })
  } catch (error) {
    console.error("Bulk upload confirm error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to confirm upload",
      },
      { status: 500 }
    )
  }
}
