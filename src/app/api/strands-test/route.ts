import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        message: "Strands API is working!",
        timestamp: new Date().toISOString()
      }
    })
  } catch {
    return NextResponse.json({
      success: false,
      error: "Test API failed"
    }, { status: 500 })
  }
}
