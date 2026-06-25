import { NextResponse } from "next/server";
import { defaultFlowers } from "@/lib/data/default-flowers";

export async function GET() {
	try {
		return NextResponse.json(defaultFlowers);
	} catch {
		return NextResponse.json(
			{ message: "Unable to load flower catalog. Please try again shortly." },
			{ status: 500 },
		);
	}
}
